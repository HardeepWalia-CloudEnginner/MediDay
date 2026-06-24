from dataclasses import dataclass,field
from typing import List,Dict,Any

@dataclass
class Processedchunks:
    headings: List[str]
    page_content :str
    chunk_text:str
    source_document:str
    collection:str
    access_roles:List[str]
    section_title :str
    chunk_type:str

@dataclass
class DomainDocument:
    page_content:str
    meta_data:Dict[str,Any]
