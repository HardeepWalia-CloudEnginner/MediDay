from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from APIS.ingestrequestController import router as ingestrouter
from INFRASTRUCTURES.document_parser import DoclingParserSevice
from INFRASTRUCTURES.embedding_service import MediEmbeddingService
from INFRASTRUCTURES.llmservice import llmservice
from INFRASTRUCTURES.vector_store import QdrantVectorStoreService
from domainentities.mediassistentities import mediassistservice
from helper.appstatecontainer import AppStateContainer

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    parser = DoclingParserSevice()
    embedder = MediEmbeddingService()

    AppStateContainer._vectorstoreservice = QdrantVectorStoreService(IDocumentParser=parser,
                                                                     IEmbeddingService=embedder)
    AppStateContainer._llmservice = llmservice()
    AppStateContainer._dbservice = mediassistservice(AppStateContainer._llmservice.llm_chat())
    yield

def create_application() -> FastAPI:
    """Application factory to configure and initialize the FastAPI engine."""

    fastapi_app = FastAPI(
        title="Clean Architecture AI Engine Backend",
        description="Production RAG core service orchestration built with .NET-style Class Controllers.",
        version="1.0.0",
        lifespan = lifespan
    )

    # 2. Configure Cross-Origin Resource Sharing (CORS) for Frontend integrations
    fastapi_app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Adjust this in production to specific domains
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    # 3. Mount / Register your Class-Based Controller Router
    fastapi_app.include_router(ingestrouter)
    return fastapi_app




# Instantiate the global app reference that Uvicorn calls
app = create_application()



# Press the green button in the gutter to run the script.
if __name__ == '__main__':
    uvicorn.run("main:app", host="127.0.0.2", port=8001, reload=True)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
