import json

from typing import List
from requests_aws4auth import AWS4Auth
from opensearchpy import OpenSearch, RequestsHttpConnection
from langchain.vectorstores import OpenSearchVectorSearch

from aws.embedding import BedrockEmbedding
from config import config


class OpenSearchWrapper():
    def __init__(self, endpoint, index, region=config.BEDROCK_REGION):
        self.region = region
        self.endpoint = endpoint
        self.index = index

        self.awsauth = AWS4Auth(
            config.AWS_ACCESS_KEY,
            config.AWS_SECRET_KEY,
            self.region,
            'es'
        )

        self.client = OpenSearch(
            hosts=[{'host': self.endpoint.replace('https://', ''), 'port': 443}],
            http_auth=self.awsauth,
            use_ssl=True,
            verify_certs=True,
            connection_class=RequestsHttpConnection,
            timeout=300
        )


    '''
    Index Create / Delete
    '''
    def create_index(self,
                     index_path: str = 'os-index-schema.json',
                     index_body: dict = None):
        
        if index_path:
            # load index schema
            with open(index_path, 'r') as f:
                index_body = json.load(f)

        if not index_body:
            raise

        # delete index if it exist
        self.delete_index()

        # create index
        self.client.indices.create(index=self.index, body=index_body)
        print(f'create index: {self.index}')

        # get index info
        self.get_index_info()


    def get_index_info(self):
        self.client.indices.get(index=self.index)


    def delete_index(self):
        if self.client.indices.exists(index=self.index):
            self.client.indices.delete(index=self.index, ignore=[400, 404])
            print(f'delete index: {self.index}')

    '''
    Update/GET/Delete Document
    '''
    def update_doc(self, id: str, body: dict):
        self.client.update(
            index=self.index,
            id=id,
            body={ "doc": body, "doc_as_upsert": True},
            refresh=True
        )

    def get_doc(self, id: str):
        return self.client.get(
            index=self.index,
            id=id
        )

    def search(self, body: dict = None):
        if not body:
            body = {
                "query": {
                    "match_all": {}
                }
            }

        body.update({
            "_source": {
                "excludes": ["vector_field"]
            }
        })

        try:
            res = self.client.search(
                index=self.index,
                body=body,
            )
            return res['hits']['hits']
        except Exception as e:
            print(e)
            return []
        

    '''
    Vector Store
    '''
    def get_vector_store(self, is_multimodal=True):
        embedding = BedrockEmbedding().textmodal
        if is_multimodal:
            embedding = BedrockEmbedding().multimodal

        return OpenSearchVectorSearch(
            opensearch_url=config.OPENSEARCH_ENDPOINT,
            index_name=self.index,
            embedding_function=embedding,
            is_aoss=False,
            connection_class=RequestsHttpConnection,
            http_auth=self.awsauth,
            text_field="text",
            vector_field="vector_field",
            engine="faiss",
            space_type="l2",
            timeout=60
        )
    

    def vector_search(self, vector: List = [], k: int = 3):
        res = self.client.search(
                index=self.index,
                body={
                    "query": {
                        "knn": {
                            "vector_field": {
                                "vector": vector,
                                "k": k,
                            }
                        }
                    },
                    "_source": {
                        "excludes": ["vector_field"]
                    },
                }
            )
        return res['hits']['hits']

        
    def similarity_search(self, query: str, k: int = 3, is_multimodal=True):
        vectordb = self.get_vector_store(index_name=self.index, is_multimodal=is_multimodal)
        return vectordb.similarity_search_with_score(
            query=query,
            k=k,
            search_type='approximate_search',
            space_type='l2'
        )

