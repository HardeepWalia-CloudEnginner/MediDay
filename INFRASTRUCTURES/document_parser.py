from typing import List

from docling.datamodel import pipeline_options
from docling.datamodel.base_models import InputFormat
from docling.datamodel.base_models import InputFormat
from docling.datamodel.pipeline_options import PdfPipelineOptions, RapidOcrOptions
from docling.document_converter import DocumentConverter, PdfFormatOption
from docling.chunking import HybridChunker
from transformers import AutoTokenizer
from langchain_core.documents import Document
from domainentities.entities import Processedchunks
from domainentities.interfaces import IDocumentParser
import os

class DoclingParserSevice(IDocumentParser):

    permitted_roles = ["doctor", "admin"]
    def parse_and_chunk(self,source_url:str,doc_collection:str,roles:List[str]) -> List[Processedchunks]:
        pipeline_option = PdfPipelineOptions()
        pipeline_option.ocr_options = RapidOcrOptions()
        embedding_model = os.getenv("EMBEDDING_MODEL")
        print(f"roles:{roles}")
        converter = DocumentConverter(
            format_options={
                InputFormat.PDF: PdfFormatOption(pipeline_options = pipeline_option)
            }
        )
        dl_docs = converter.convert(source_url).document
        tokenizer = AutoTokenizer.from_pretrained(embedding_model)
        chunker = HybridChunker(
            tokenizer=tokenizer,  # aligns chunk size to the embedding model's token limit
            max_tokens = 128 , # max tokens per chunk
            merge_peers = True  # merge undersized sibling chunks under the same heading
        )
        chunk_iter = chunker.chunk(dl_doc=dl_docs)
        processed_chunks = []

        for chunk in chunk_iter:

            node_label = getattr(chunk.meta.doc_items[0], "label", "text") if chunk.meta.doc_items else "text"

            if "table" in node_label.lower():
                chunk_type = "table"
            elif "heading" in node_label.lower() or "title" in node_label.lower():
                chunk_type = "heading"
            elif "code" in node_label.lower():
                chunk_type = "code"
            else:
                chunk_type = "text"  # Default fallback for standard text layers

            headings = chunk.meta.headings
            headcrumb = ">".join(headings)
            processed_chunks.append(Document(
                page_content =  chunker.contextualize(chunk = chunk),  #f"{headcrumb}{chunk.text}",
                metadata = {
                    "Source": source_url,
                    "collection": doc_collection,
                    "access_roles": roles,
                    "section_title": headings[-1] if headings[-1] else "Root",
                    "chunk_type": chunk_type
                }
            ))
        return processed_chunks