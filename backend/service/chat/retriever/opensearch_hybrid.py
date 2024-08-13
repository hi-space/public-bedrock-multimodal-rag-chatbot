from langchain.schema import BaseRetriever
from langchain.retrievers import EnsembleRetriever
from service.chat.retriever.opensearch_semantic import OpenSearchSemanticSearch
from service.chat.retriever.opensearch_lexical import OpenSearchLexicalSearch


class OpenSearchHybridSearch(BaseRetriever):    
    def __new__(cls, weights=[0.5, 0.5]):
        semantic_search = OpenSearchSemanticSearch()
        lexical_search = OpenSearchLexicalSearch()

        ensemble_retriever = EnsembleRetriever(
            retrievers=[lexical_search, semantic_search],
            weights=weights
        )
        
        return ensemble_retriever