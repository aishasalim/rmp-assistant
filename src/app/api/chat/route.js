// app/api/chat/route.js

import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

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
  const text = data[data.length - 1].content;
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
