import os
from typing import Any
import os

from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_qdrant import FastEmbedSparse
from domainentities.interfaces import IEmbeddingService

# Dense embeddings — semantic understanding

class MediEmbeddingService(IEmbeddingService):

    def __init__(self):
        try:
            load_dotenv()
            self.model_name = os.getenv("EMBEDDING_MODEL")
            self.dense_embeddings = HuggingFaceEmbeddings(
                model_name=self.model_name,
                model_kwargs={"device":"cpu"},
                encode_kwargs={"normalize_embeddings":True},
            )
            # Sparse embeddings — BM25 keyword matching (via FastEmbed)
            self.sparse_embedding_model = FastEmbedSparse(model_name="Qdrant/bm25",batch_size =32)
        except Exception as e:
            raise e

    def get_embeddings(self)-> Any:
        return self.dense_embeddings, self.sparse_embedding_model





