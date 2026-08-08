from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient

model = SentenceTransformer("all-MiniLM-L6-v2")

client = QdrantClient(
    host="localhost",
    port=6333
)

COLLECTION_NAME = "study_notes"


def retrieve_chunks(query: str, limit: int = 5):

    # Convert the user's query into an embedding
    query_embedding = model.encode(query).tolist()

    # Search Qdrant for the most similar chunks
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit,
        with_payload=True
    )

    chunks = []

    for result in results.points:
        if result.payload and "text" in result.payload:
            chunks.append(result.payload["text"])

    return chunks