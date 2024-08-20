from dotenv import load_dotenv
import os
import json
from pinecone import Pinecone, ServerlessSpec
from openai import OpenAI

# Load environment variables from env.local
load_dotenv(dotenv_path='.env.local')

# Initialize Pinecone
api_key = os.getenv("PINECONE_API_KEY")
if not api_key:
    raise ValueError("PINECONE_API_KEY not found")
pc = Pinecone(api_key=api_key)

# Uncomment this block only if you need to create the index for the first time
# Otherwise, comment it out to avoid conflicts
# pc.create_index(
#     name="rag",
#     dimension=1536,
#     metric="cosine",
#     spec=ServerlessSpec(cloud="aws", region="us-east-1"),
# )

# Load the review data
data = json.load(open("reviews.json"))

processed_data = []
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Create embeddings for each review
for review in data["reviews"]:
    response = client.embeddings.create(
        input=review['review'], model="text-embedding-ada-002"
    )
    embedding = response.data[0].embedding
    processed_data.append(
        {
            "values": embedding,
            "id": review["professor"],
            "metadata":{
                "review": review["review"],
                "subject": review["subject"],
                "stars": review["stars"],
            }
        }
    )

# Insert the embeddings into the Pinecone index
index = pc.Index("rag")
upsert_response = index.upsert(
    vectors=processed_data,
    namespace="ns1",
)
print(f"Upserted count: {upsert_response['upserted_count']}")

# Print index statistics
print(index.describe_index_stats())
