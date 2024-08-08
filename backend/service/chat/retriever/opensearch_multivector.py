from typing import Dict, List

from langchain.schema import Document

from common.logger import logger
from service.chat.embedding import BedrockEmbedding
from service.chat.retriever.opensearch_hybrid import OpenSearchHybridSearch
from db.opensearch import OpenSearchWrapper
from utils.converter import softmax
from config import config


class OpenSearchMultiVector():
    """Retriever that uses OpenSearch's vector store for retrieving documents."""
    
    def get_relevant_documents(self, text: str = None, image: str = None) -> List[Document]:
        documents = []
        text_docs = []
        image_docs = []
        
        if text:
            vector = BedrockEmbedding().embedding_text(text=text)
            retriever = OpenSearchHybridSearch()
            text_docs = retriever.get_relevant_documents(text)
            
        if image:
            text = None
            vector = BedrockEmbedding().embedding_multimodal(text=text, image=image)
            opensearch = OpenSearchWrapper(
                index=config.OPENSEARCH_IMAGE_INDEX
            )

            res = opensearch.search_raw(self._make_search_query(vector=vector))
            hits = res['hits']['hits']

            normalized_scores = softmax([hit['_score'] for hit in hits])
            image_docs = [
                Document(
                    page_content=hit['_source']['text'],
                    metadata={
                        **hit['_source']['metadata'],
                        'similarity': normalized_score,
                        'sourceId': hit['_id'],
                    }
                ) for hit, normalized_score in zip(hits, normalized_scores)
            ]
            
        documents.extend(image_docs)
        documents.extend(text_docs)
    
        return documents

    def _make_search_query(
        self, vector: str, vector_field: str = 'vector_field', k: int = 3, filter: Dict = None
    ) -> Dict:
        QUERY_TEMPLATE = {
            "query": {
                "knn": {
                    vector_field: {
                        "vector": vector,
                        "k": k,
                    }
                }
            },
            "_source": {
                "excludes": []
            },
        }

        if filter:
            QUERY_TEMPLATE["query"]["bool"]["filter"].extend(filter)

        return QUERY_TEMPLATE