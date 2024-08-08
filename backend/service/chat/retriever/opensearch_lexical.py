from typing import Dict, List

from langchain.schema import BaseRetriever, Document
from langchain.callbacks.manager import CallbackManagerForRetrieverRun

from db.opensearch import OpenSearchWrapper
from utils.converter import softmax
from common.logger import logger
from config import config


class OpenSearchLexicalSearch(BaseRetriever):
    """Retriever that uses OpenSearch's vector store for retrieving documents."""

    def _get_relevant_documents(
        self, query: str, *, run_manager: CallbackManagerForRetrieverRun
    ) -> List[Document]:
                
        opensearch = OpenSearchWrapper(config.OPENSEARCH_TEXT_INDEX)

        try:
            hits = opensearch.search_raw(self._make_search_query(query=query))['hits']['hits']
    
            normalized_scores = softmax([hit['_score'] for hit in hits])

            documents = [
                Document(
                    page_content=hit.get('_source', {}).get('text', ''),
                    metadata={
                        **hit.get('_source', {}).get('metadata', {}),
                        'similarity': normalized_score
                    }
                ) for hit, normalized_score in zip(hits, normalized_scores)
            ]
            
            return documents
        except Exception as e:
            logger.error(e)
            return []
    
    
    def _make_search_query(
        self, query: str, text_field: str = 'text', k: int = 5, filter: Dict = None, 
    ) -> Dict:

        QUERY_TEMPLATE = {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match": {
                                text_field: {
                                    "query": f'{query}',
                                    "minimum_should_match": f'{k}%',
                                    "operator":  "or",
                                }
                            }
                        },
                    ],
                    "filter": [
                    ]
                }
            }
        }

        if filter:
            QUERY_TEMPLATE["query"]["bool"]["filter"].extend(filter)

        return QUERY_TEMPLATE