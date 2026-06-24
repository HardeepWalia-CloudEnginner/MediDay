from typing import Optional, Dict
from langchain_qdrant import QdrantVectorStore
from INFRASTRUCTURES.vector_store import QdrantVectorStoreService
from domainentities.interfaces import ILLMService, IMediassistentities

class AppStateContainer:
    """Singleton State"""

    _vectorstoreservice : Optional[QdrantVectorStoreService] =None
    _llmservice : Optional[ILLMService] = None
    _dbservice : Optional[IMediassistentities] = None

_vectorstore_cache : Dict[str,QdrantVectorStore] = {}

def get_vector_store_service()-> QdrantVectorStoreService:
    if not AppStateContainer._vectorstoreservice:
        raise RuntimeError("VectorStore not initialized")
    return AppStateContainer._vectorstoreservice

def get_db_sevice()-> IMediassistentities:
    if not AppStateContainer._dbservice:
        raise RuntimeError("DBService not initialized")
    return AppStateContainer._dbservice

def get_vector_store(collection_name:str)-> QdrantVectorStore:
    vectorstore_service = get_vector_store_service()
    if collection_name not in _vectorstore_cache:
        _vectorstore_cache[collection_name] =  QdrantVectorStore(
                    client=vectorstore_service.client,
                    collection_name= collection_name,
                    embedding= vectorstore_service.dense_embeddings,
                    sparse_embedding= vectorstore_service.sparse_embedding_model
                )
    return _vectorstore_cache[collection_name]

def get_llm() -> ILLMService:
    if not AppStateContainer._llmservice:
        raise RuntimeError("LLMService not initialized")
    return AppStateContainer._llmservice
