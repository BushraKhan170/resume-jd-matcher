from sentence_transformers import SentenceTransformer

# Load the embedding model once
model = SentenceTransformer("all-MiniLM-L6-v2")


def generate_embeddings(chunks):
    """
    Generate vector embeddings for text chunks.
    """

    embeddings = model.encode(chunks)

    return embeddings.tolist()