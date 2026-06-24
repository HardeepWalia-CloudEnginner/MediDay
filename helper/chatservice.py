import time
from typing import Any
from fastapi import Depends, HTTPException
from rich import status
from qdrant_client.http import models as qmodel
from domainentities.interfaces import ILLMService, Ichatservice
from helper.appstatecontainer import get_vector_store_service, get_llm, get_vector_store


class medichatservice(Ichatservice):


    def medibot_chat(self,payload:Any,
                     vectorstoreservice: Any,
                     llmService:Any) -> Any:

        try:
            print("--Inialize medibot_chat--")
            print(payload)
            target_collection = vectorstoreservice.identify_target_collection(payload.query,llmService.llm_chat())
            #target_collection = "clinical"
            print(f"target_collection: {target_collection}")
            print(f"QdrantVectorStore: {time.time()}")

            vector_store = get_vector_store(target_collection)

            qdrant_filter = qmodel.Filter(
                must = [
                    qmodel.FieldCondition(
                    key = "metadata.access_roles",
                    # Qdrant naturally checks array intersections when a list parameter is filtered
                    match= qmodel.MatchAny(any= [payload.user.role])  # e.g., ["doctor", "nurse"]
                    )
                ]
            )
            retriever = vector_store.as_retriever(
                search_kwargs={
                    "k": 3,
                    "filter": qdrant_filter
                }
            )
            response,reranking_retriever = llmService.check_role_retriever(retriever,payload.query)
            if not response:
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                    detail="You don't have permission to view documents for this request or query.")
            hybrid_rag = llmService.intialize_hybchain(reranking_retriever)
            response = llmService.generate_response(hybrid_rag,payload.query)
            print(response)
            return response
        except Exception as e:
            raise HTTPException(status_code=500,detail=str(e))
