import re
from typing import List
from urllib import response

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi_utils.cbv import cbv
from helper.appstatecontainer import *
from domainentities.interfaces import Ichatservice
from helper.chatservice import medichatservice

router = APIRouter(prefix="/api/v1/ingestrequest",tags=["RAG Endpoints"])

class IngestRequest(BaseModel):
    source_url: str
    collection_name: str
    roles: List[str]

class UserModel(BaseModel):
    id: str
    username: Optional[str] = None
    role: str

class RequestModel(BaseModel):
    query: str
    user: UserModel

@cbv(router)
class IngestController:

    vectorstoreservice: QdrantVectorStoreService = Depends(get_vector_store_service)
    llmService: ILLMService = Depends(get_llm)
    mediassist_service : IMediassistentities = Depends(get_db_sevice)
    chatservice: Ichatservice = Depends(medichatservice)

    SQL_KEYWORDS = re.compile(   r"\b("
        # --- Aggregations & Calculations ---
        r"how many|count|total|sum|average|avg|maximum|max|minimum|min|percentage|percent|ratio|metrics|"
        # --- Structural/Listing Commands ---
        r"list all|show all|get all|records|rows|table|database|top \d+|highest|lowest|most|least|"
        # --- Healthcare/Patient Domain Entities ---
        r"patient(?:\s*ids?)?|doctor(?:\s*names?)?|physician|claim(?:\s*ids?)?|ticket(?:\s*ids?)?|diagnosis code|icd|"
        # --- Date & Time Series Math ---
        r"admitted(?:\s*date)?|discharged|born in|dob|date of birth|last month|this year|quarter|date range"
        r")\b",
        re.IGNORECASE
    )

    @router.post("/ingest",status_code=status.HTTP_201_CREATED)
    async def ingest_docuemnt(self, payload: IngestRequest):
        try:
            print(payload.source_url)
            self.vectorstoreservice.initialize_vectorstore(payload.source_url,
                                                                  payload.collection_name,
                                                                  payload.roles)

            return {"status": "success"}
        except Exception as e:
            raise HTTPException(status_code=500,detail=str(e))

    @router.post("/query",status_code=status.HTTP_200_OK)
    async def faq(self,payload:RequestModel):
        try:
            if self.SQL_KEYWORDS.search(payload.query):
                    print("--SqlRAG--")
                    _IsValid = self.mediassist_service.validate_access(payload.user.role)
                    print(f"IsValid: {_IsValid}")
                    if _IsValid:
                        response = self.mediassist_service.sql_rag_chain(payload.query)
                        print(response)
                    else:
                        response = {"answer":"😞 Sorry, You dont have required access to check details !"}


            else:
                print("--Ichatservice--")
                response = self.chatservice.medibot_chat(payload=payload,
                                                         vectorstoreservice = self.vectorstoreservice,
                                                         llmService=self.llmService)
                print(response)
            return response
        except Exception as e:
            raise HTTPException(status_code=500,detail=str(e))
