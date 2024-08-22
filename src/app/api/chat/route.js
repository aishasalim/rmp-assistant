// app/api/chat/route.js

import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Function to extract URLs from a text
function extractUrls(text) {
  const urlRegex = /https:\/\/www\.ratemyprofessors\.com\/professor\/\d+/g;
  return text.match(urlRegex) || [];
}

// Function to replace URLs from a text
function replaceUrlsInText(text, urls, processed_data) {
  for(let i = 0; i < urls.length; i++){
    text = text.replace(
      urls[i], 
      processed_data[i].id + " with " + processed_data[i].metadata["rating"] + " star rating in " + processed_data[i].metadata["department"]
    );
  }
  return text;
}

// Function to scrape a webpage
async function scrapeWebpage(url) {
  try {
    // Fetch the HTML of the page
    const { data } = await axios.get(url);
    
    // Load the HTML into cheerio
    const $ = cheerio.load(data);
    
    // Select the element containing the professor's name
    const name = $('div.NameTitle__Name-dowf0z-0 span').first().text().trim();
    const lastName = $('div.NameTitle__Name-dowf0z-0 span.NameTitle__LastNameWrapper-dowf0z-2').first().text().trim();
    const fullName = `${name} ${lastName}`;

    // Select the rating element and extract its text content
    const ratingText = $('div.RatingValue__Numerator-qw8sqy-2.liyUjw').text().trim();

    // Select the element containing the comments
    const comments = $('div.Comments__StyledComments-dzzyvm-0').text().trim();

    // Extract department name
    const departmentName = $('a.TeacherDepartment__StyledDepartmentLink-fl79e8-0').text().trim();

    const review = {
      name: fullName,
      rating: ratingText,
      review: comments,
      department: departmentName,
    }

    return review;
  } catch (error) {
    console.error(`Failed to retrieve the webpage. Error: ${error}`);
    return null;
  }
}

async function upsertPC(text, client ,index) {
  const urls = extractUrls(text);
  const processed_data = [];

  for (const url of urls) {
    const data = await scrapeWebpage(url);
    if (!data) continue;

    try {
      const response = await client.embeddings.create({
        input: data.review,
        model: "text-embedding-ada-002"
      });

      const embedding = response.data[0].embedding;
      processed_data.push({
        values: embedding,
        id: data.name,
        metadata: {
          rating: data.rating,
          review: data.review,
          department: data.department,
        }
      });
    } catch (error) {
      console.error(`Failed to create embedding. Error: ${error}`);
    }
  }

  try {
    const upsert_response = await index.upsert(processed_data);
    return replaceUrlsInText(text, urls, processed_data);
  } catch (error) {
    console.error(`Failed to upsert vectors. Error: ${error}`);
    return null;
  }
}


// Step 2: Define the system prompt
const systemPrompt = `
You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
For every user question, the top 3 professors that match the user question are returned.
Use them to answer the question if needed.
`;

// Step 3: Create the POST function
export async function POST(req) {
  const data = await req.json();

  // Step 4: Initialize Pinecone and OpenAI
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });
  const index = pc.index('rag').namespace('ns1');
  const openai = new OpenAI();

  // Step 5: Process the user’s query
  let text = data[data.length - 1].content;
  if(extractUrls(text).length > 0){
    text = await upsertPC(text, openai, index)
  }
  console.log(text)
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002', // Make sure to use the correct model
    input: text,
    encoding_format: 'float',
  });

  // Step 6: Query Pinecone
  const results = await index.query({
    topK: 5,
    includeMetadata: true,
    vector: embedding.data[0].embedding,
  });

  // Step 7: Format the results
  let resultString = '';
  results.matches.forEach((match) => {
    resultString += `
    Returned Results:
    Professor: ${match.id}
    Review: ${match.metadata.review}
    Subject: ${match.metadata.subject}
    Stars: ${match.metadata.stars}
    \n\n`;
  });

  // Step 8: Prepare the OpenAI request
  const lastMessage = data[data.length - 1];
  const lastMessageContent = lastMessage.content + resultString;
  const lastDataWithoutLastMessage = data.slice(0, data.length - 1);

  // Step 9: Send request to OpenAI
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      ...lastDataWithoutLastMessage,
      { role: 'user', content: lastMessageContent },
    ],
    model: 'gpt-3.5-turbo',
    stream: true,
  });

  // Step 10: Set up streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            const text = encoder.encode(content);
            controller.enqueue(text);
          }
        }
      } catch (err) {
        controller.error(err);
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream);
}
