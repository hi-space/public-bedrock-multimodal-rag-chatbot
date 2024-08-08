from typing import List
from langchain.schema import BaseRetriever, Document
from langchain.callbacks.manager import CallbackManagerForRetrieverRun

from config import config
from common.logger import logger
from db.opensearch import OpenSearchWrapper
from utils.converter import softmax


class OpenSearchSemanticSearch(BaseRetriever):
    """Retriever that uses OpenSearch's vector store for retrieving documents."""

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
        opensearch = OpenSearchWrapper(index=config.OPENSEARCH_TEXT_INDEX)
        docs = opensearch.vectordb.similarity_search_with_score(
            query=query,
        )
        
        normalized_scores = softmax([score for _, score in docs])
    
        documents = [
            Document(
                page_content=doc.to_json().get('kwargs', {}).get('page_content', ''),
                metadata={
                    **doc.to_json().get('kwargs', {}).get('metadata', {}),
                    'similarity': normalized_score
                }
            ) for (doc, _), normalized_score in zip(docs, normalized_scores)
        ]

        return documents
