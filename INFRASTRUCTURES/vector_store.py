
from typing import List
from pydantic import BaseModel, Field, create_model
from typing import Literal
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.vectorstores import VectorStoreRetriever
from langchain_qdrant import QdrantVectorStore, RetrievalMode, sparse_embeddings
from INFRASTRUCTURES.embedding_service import *
from domainentities.interfaces import IVectorStoreSevice, IDocumentParser
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, SparseVectorParams,SparseIndexParams

class QdrantVectorStoreService(IVectorStoreSevice):

     qclient: QdrantClient

     def __init__(self,
                  IDocumentParser,
                  IEmbeddingService):
         self.vectorstore = None
         self.Idcoumentparser = IDocumentParser
         self.IEmbeddingService = IEmbeddingService
         self.dense_embeddings,self.sparse_embedding_model = self.IEmbeddingService.get_embeddings()
         print(f"embedding:{self.dense_embeddings}")
         print(f"sparse_embedding:{self.sparse_embedding_model}")
         self.path = "/temp/rag_qdrant"
         self.retriever : VectorStoreRetriever
         load_dotenv()
         self.GROQ_MODEL = os.getenv("GROQ_MODEL")
         self.client = QdrantClient(path=self.path)
     def initialize_vectorstore(self,source_url:str, collection:str, roles:List[str]):
         try:
             print("initializing vectorstore")
             print(f"url: {source_url}")
             print(f"roles: {roles}")
             if not self.client.collection_exists(collection_name=collection):
                 print(f"Collection '{collection}' not found. Creating brand new hybrid collection schema...")
                 self.client.create_collection(
                     collection_name=collection,
                     vectors_config= VectorParams(
                         size=384,  # <-- Change this to match your dense embeddings output size exactly
                         distance= Distance.COSINE
                     ),
                     sparse_vectors_config={
                         "langchain-sparse": SparseVectorParams(
                             index= SparseIndexParams(on_disk=True)
                         )
                     }
                 )
             else:
                 print(f"Collection '{collection}' verified on disk. Appending new document chunks to it...")
             self.vectorstore = QdrantVectorStore(
                 client=self.client,
                 embedding= self.dense_embeddings,
                 sparse_embedding= self.sparse_embedding_model,
                 collection_name = collection,
                 retrieval_mode=RetrievalMode.HYBRID,

             )
             document_chunk = self.Idcoumentparser.parse_and_chunk(source_url, collection, roles)
             self.vectorstore.add_documents(documents = document_chunk)

         except Exception as e:
             print(f"Exception: {e}")
             raise e

     def get_collections(self):

         names = [col.name for col in self.client.get_collections().collections]
         print(f"collection_name: {names}")
         return names

     def identify_target_collection(self, query: str,llm: Any):
        """
        Analyzes the user question and returns the correct collection name string.
        """
        print(f"llm:{llm}")

        dynamicliteraltype = Literal.__getitem__(tuple(self.get_collections()))

        RouterDecisionModel = create_model(
            "RouterDecision",
            collection_name =(dynamicliteraltype,
                              Field(
                                  default=...,
                                  description="The target collection name that contains data related to the question."
                              ))
            )

        structured_llm = llm.with_structured_output(RouterDecisionModel)
        system_instructions = (
            "You are an intent routing engine for a medical center. Classify the user's question and identify the single most appropriate collection name"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_instructions),
            ("user", "Question: {query}")
        ])

        # 4. Chain them together and execute
        routing_chain = prompt | structured_llm
        result = routing_chain.invoke({"query": query})

        # Returns exactly "billing", "general", or "faq"
        return result.collection_name