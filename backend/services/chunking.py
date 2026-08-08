from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_document(text: str):
    """
    Split document into smaller chunks.
    """

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )

    chunks = splitter.split_text(text)

    return chunks