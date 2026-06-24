from typing import Any, List
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_classic.chains.retrieval import create_retrieval_chain
from langchain_classic.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.vectorstores import VectorStoreRetriever
from langchain_groq import ChatGroq
from langchain_classic.retrievers import ContextualCompressionRetriever
from langchain_classic.retrievers.document_compressors import CrossEncoderReranker
from langchain_community.cross_encoders import HuggingFaceCrossEncoder

from domainentities.interfaces import ILLMService
import os

load_dotenv()
GROQ_MODEL = os.getenv("GROQ_MODEL")

class ragresponse(BaseModel):
    answer:str
    retrieval_type:str
    citations:List[dict]

class llmservice(ILLMService):

    def __init__(self):
        #self.retriever = ivectorstoresevice.initialize_vectorstore()
        llm: Any
        cross_encoder = HuggingFaceCrossEncoder(
            model_name="cross-encoder/ms-marco-MiniLM-L-6-v2")
        self.reranker = CrossEncoderReranker(
            model=cross_encoder, top_n=3
        )
        #self.hybrid_rag = self.intialize_hybchain()
    def  llm_chat(self):
        self.llm = ChatGroq(
            model=GROQ_MODEL,
            temperature=0.1,
            max_tokens=800,
            reasoning_format="parsed",
            timeout=None,
            max_retries=2,
        )
        return self.llm
    def intialize_hybchain(self,retriever:VectorStoreRetriever):

        # Prompt template
        system_prompt = """You are a helpful hospital support assistant.
        Answer the customer's question using ONLY the information provided in the context .
        and also check asked question is chain of last question or its new question

        Keep answers concise and friendly.

        Context:
        {context}"""

        prompt_template = ChatPromptTemplate.from_messages(
            [("system",system_prompt),
             ("human","{input}")]
        )
        #Build Chain:
        question_ans_chain = create_stuff_documents_chain(self.llm, prompt_template)
        self.hybrid_rag = create_retrieval_chain(retriever, question_ans_chain)
        return self.hybrid_rag

    def generate_response(self, hybrid_rag:Any, question: str):
        print("Generating response")
        response = hybrid_rag.invoke({"input":question})
        collection_name = response['context'][0].metadata.get('collection','unknown')
        print(f"collection_name:{collection_name}")
        section_title = response['context'][0].metadata.get('section_title','unknown')
        print(f"section_title:{section_title}")
        source_url = response['context'][0].metadata.get('Source', 'unknown')
        print(f"source_url:{source_url}")
        page_content = response['context'][0].page_content

        print(f"page_content:{page_content}")
        _ragresponse = ragresponse(answer=response['answer'],
                                   retrieval_type="Hybrid_Rag",
                                   citations=[{
                                       "document_name":collection_name,
                                       "section_title":section_title,
                                       "content":page_content,
                                       "source_url":source_url
                                   }])
        print(_ragresponse)
        return  _ragresponse

    def check_role_retriever(self,retriever:VectorStoreRetriever,question:str):
         reranking_retriever = ContextualCompressionRetriever(
                base_compressor=self.reranker,
                base_retriever=retriever
         )
         response = reranking_retriever.invoke(question)
         return response, reranking_retriever