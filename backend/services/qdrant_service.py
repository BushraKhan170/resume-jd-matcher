from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient(
    host="localhost",
    port=6333
)

COLLECTION_NAME = "study_notes"


def create_collection():

    collections = client.get_collections().collections
    names = [collection.name for collection in collections]

    if COLLECTION_NAME not in names:

        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )


def store_embeddings(chunks, embeddings):

    create_collection()

    points = []

    for i in range(len(chunks)):
        points.append(
            PointStruct(
                id=i,
                vector=embeddings[i],
                payload={
                    "text": chunks[i]
                }
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )