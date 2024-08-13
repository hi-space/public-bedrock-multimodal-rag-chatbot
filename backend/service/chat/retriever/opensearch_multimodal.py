from typing import Dict, List

from langchain.schema import Document

from common.logger import logger
from service.chat.embedding import BedrockEmbedding
from service.chat.retriever.opensearch_hybrid import OpenSearchHybridSearch
from db.opensearch import OpenSearchWrapper
from config import config


class OpenSearchMultimodal():
    """Retriever that uses OpenSearch's vector store for retrieving documents."""
    
    def get_relevant_documents(self, text: str = None, image: str = None) -> List[Document]:
        vector = BedrockEmbedding().embedding_multimodal(text=text, image=image)
        opensearch = OpenSearchWrapper(
            index=config.OPENSEARCH_IMAGE_INDEX
        )

        res = opensearch.search_raw(self._make_search_query(vector=vector))
        hits = res['hits']['hits']

        documents = []
        for hit in hits:
            documents.append(Document(
                page_content=hit['_source']['text'],
                metadata={
                    **hit['_source']['metadata'],
                    'similarity': hit['_score'],
                    'sourceId': hit['_id'],
                }
            ))

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