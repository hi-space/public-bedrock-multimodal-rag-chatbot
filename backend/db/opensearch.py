import boto3
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
from langchain_community.vectorstores import OpenSearchVectorSearch

from service.chat.embedding import BedrockEmbedding
from common.singleton import SingletonInstane
from common.logger import logger
from config import config


class OpenSearchWrapper(SingletonInstane):
    def __init__(self, index, endpoint = config.OPENSEARCH_ENDPOINT):
        self.endpoint = endpoint
        self.index = index
                
        awsauth = AWS4Auth(
            config.AWS_ACCESS,
            config.AWS_SECRET,
            'us-east-1',
            'es'
        )

        self.client = OpenSearch(
            hosts=[{'host': self.endpoint.replace('https://', ''), 'port': 443}],
            http_auth=awsauth,
            use_ssl=True,
            verify_certs=True,
            connection_class=RequestsHttpConnection,
            timeout=300
        )

        self.vectordb = OpenSearchVectorSearch(
            opensearch_url=self.endpoint,
            index_name=self.index,
            embedding_function=BedrockEmbedding().textmodal,
            is_aoss=False,
            connection_class=RequestsHttpConnection,
            http_auth=awsauth,
            text_field="text",
            vector_field="vector_field"
        )

    def search_raw(self, query: dict):
        return self.client.search(
            index=self.index,
            body=query
        )
    
    def search(self, query: dict):
        results = self.search_raw(query)
        hits = results["hits"]["hits"]
        return [hit["_source"] for hit in hits]
    
    def search_by_name(self, keyword: str):
        return self.search({
            "query": {
                "query_string": {
                    "query": keyword + "*",
                    "fields": ["metadata.productDisplayName", "metadata.namekor"]
                },
            },
            "size": 0
        })

    def as_retriever(self, k=5):
        return self.vectordb.as_retriever(
            search_type="similarity",
            search_kwargs={
                "k": k
            }
        )
    