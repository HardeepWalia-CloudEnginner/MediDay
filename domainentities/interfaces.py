from abc import ABC, abstractmethod

from langchain_core.vectorstores import VectorStoreRetriever
from domainentities.entities import *

class IDocumentParser(ABC):
    @abstractmethod
    def parse_and_chunk(self,source_url:str,doc_collection:str,roles:List[str]) -> List[Processedchunks]:
        pass

class IEmbeddingService(ABC):
    @abstractmethod
    def get_embeddings(self) -> Any:
        pass

class IVectorStoreSevice(ABC):
    @abstractmethod
    def initialize_vectorstore(self,source_url:str, collection:str, roles:List[str]) :
        pass

    @abstractmethod
    def get_collections(self) -> List[str]:
        pass
    @abstractmethod
    def identify_target_collection(self, query: str, llm:Any):
        pass

class ILLMService(ABC):

    @abstractmethod
    def intialize_hybchain(self,retriever:VectorStoreRetriever) -> Any:
        pass
    @abstractmethod
    def generate_response(self,hybrid_rag:Any,question:str) -> str:
        pass
    @abstractmethod
    def check_role_retriever(self, retriever: VectorStoreRetriever, question: str):
        pass

    @abstractmethod
    def llm_chat(self):
        pass

class IMediassistentities(ABC):
    @abstractmethod
    def sql_rag_chain(self, question: str):
        pass

    def validate_access(self, roles: str):
        pass

class Ichatservice(ABC):
    @abstractmethod
    def medibot_chat(self, payload: Any,
                     vectorstoreservice: Any,
                     llmService: Any):
        pass