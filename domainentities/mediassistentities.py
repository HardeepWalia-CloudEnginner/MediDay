import os
import sqlite3
import re
from typing import Any, List
from pathlib import Path
from langchain_classic.chains import create_sql_query_chain
from langchain_community.utilities import SQLDatabase
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.utils.pydantic import create_model
from sympy import false

from INFRASTRUCTURES.llmservice import ragresponse
from domainentities.interfaces import IMediassistentities


class mediassistservice(IMediassistentities):
    def __init__(self,llm :Any):
        current_file_dir = Path(__file__).resolve().parent
        db_dir = os.path.join(current_file_dir.parent/ "Data" /"db","mediassist.db")

        print(f"dir: {db_dir}")
        print(f"Database file exists: {os.path.exists(db_dir)} at location: {db_dir}")
        # self.connection = sqlite3.connect('mediasite.db')
        # self.cursor = self.connection.cursor()
        self.db = SQLDatabase.from_uri(f"sqlite:///{db_dir}")
        # self.sql_rag = self.sql_rag_chain(llm)
        self.system_prompt = self.system_prompt()

        if hasattr(llm, "temperature"):
            self.llm = llm.copy(update={"temperature": 0.0})
        else:
            self.llm = llm

    def validate_access(self,role: str):
        _roles =["billing_executive","admin"]
        if role in _roles:
            return True
        else:
            return False

    def clean_sql(self, raw:str):
        """Strip markdown fences and any preamble, leaving only the SQL statement."""
        raw = re.sub(r"```(?:sql)?", "", raw).strip("`").strip()
        if "SQLQuery" in raw:
            raw = raw.split("SQLQuery")[-1].strip()
        return raw

    def sql_rag_query_chain(self,llm:Any):

        sql_generation_prompt = PromptTemplate.from_template(
            """You are a SQLite code generator. Given an input question and the database schema, write a syntactically correct SQLite query to answer the question.
            Do not return more than {top_k} rows.
            CRITICAL RULES:
            - Output ONLY the raw SQL query code string.
            - Do NOT include any introductory or concluding text.
            - Do NOT say "Here is your query" or "I'm sorry".
            - Output only valid SELECT statements.

            Only use the following tables and columns:
            {table_info}

            Question: {input}
            SQLQuery:"""
        )
        sql_query_chain = create_sql_query_chain(llm,self.db, prompt=sql_generation_prompt)
        return sql_query_chain

    def system_prompt(self):
        SYSTEM_PROMPT = """You are a MediBot support analytics assistant.
        Given a user question and the SQL query result from our tickets database,
        provide a clear, concise natural language answer.
        Be specific with numbers and facts from the data."""
        return SYSTEM_PROMPT

    def sql_rag_chain(self,question:str):

        sql_rag = self.sql_rag_query_chain(self.llm)
        raw_sql = sql_rag.invoke({"question":question})
        sql = self.clean_sql(raw_sql)
        table_names = self.db.get_usable_table_names()
        print(f"🚨 ACTUAL DATABASE TABLES: {table_names}")
        result = self.db.run(sql)
        answer_prompt = ChatPromptTemplate.from_messages(
            [("system",self.system_prompt),
             ("human","Question:{question}\nSQL Result:{result}\n\nAnswer:")]
        )
        response = answer_prompt | self.llm
        _content =  response.invoke({"question":question,"result":result}).content
        rag_response = {
            "answer":_content,
            "retrieval_type":"Sql_Rag"
        }
        return rag_response

