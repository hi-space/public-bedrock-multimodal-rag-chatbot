import boto3
from botocore.config import Config
from typing import List
from langchain.schema import Document
from langchain.chains import RetrievalQA
from langchain_community.retrievers import AmazonKnowledgeBasesRetriever
from langchain_aws.chat_models import ChatBedrock
from langchain.prompts import PromptTemplate

from config import config
from common.logger import logger
from service.chat.prompt import FASHION_PROMPT_TEMPLATE


class BedrockKnowledgeBase():
    def __init__(self,
                 knowledgeBaseId = config.KNOWLEDGEBASE_ID,
                 modelArn = 'arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1'):

        self.region = config.BEDROCK_REGION
        self.knowledgeBaseId = knowledgeBaseId
        self.modelArn = modelArn
        self.resultCount = 5

        self.config = Config(
            connect_timeout=120,
            read_timeout=120,
            retries={'max_attempts': 5}
        )

        self.agent = boto3.client(
            service_name = 'bedrock-agent-runtime',
            config=self.config,
            region_name = self.region,
            aws_access_key_id=config.AWS_ACCESS,
            aws_secret_access_key=config.AWS_SECRET
        )


    '''
    Bedrock API: generate a response with retrieval (sync)
    '''
    def gen_msg(self, question):
        return self.agent.retrieve_and_generate(
            input={
                'text': question,
            },
            retrieveAndGenerateConfiguration={
                'type': 'KNOWLEDGE_BASE',
                'knowledgeBaseConfiguration': {
                    'knowledgeBaseId': self.knowledgeBaseId,
                    'modelArn': self.modelArn,
                    'retrievalConfiguration': {
                        'vectorSearchConfiguration': {
                            'numberOfResults': self.resultCount,
                            'overrideSearchType': 'HYBRID' # Default: SEMANTIC
                        }
                    }
                }
            }
        )
    
    '''
    Bedrock API: retrieve
    '''
    def retrieve(self, question):
        try:
            res = self.agent.retrieve(
                    retrievalQuery= {
                        'text': question
                    },
                    knowledgeBaseId=self.knowledgeBaseId,
                    retrievalConfiguration= {
                        'vectorSearchConfiguration': {
                            'numberOfResults': self.resultCount,
                        }
                    }
                )
            return [doc['content']['text'] for doc in res.get('retrievalResults')]
        except Exception as e:
            logger.error(e)

        return None


    '''
    LangChain API: generate a response with retrieval (async)
        Returns:
            dict: ['query', 'result', 'source_documents']
    '''
    async def gen_chat_msg(self, chat: ChatBedrock, question: str):
        qa = RetrievalQA.from_chain_type(
            llm=chat,
            chain_type="stuff",
            retriever=self.as_retriever(),
            return_source_documents=True,
            chain_type_kwargs={
                "prompt": PromptTemplate(
                    template=FASHION_PROMPT_TEMPLATE,
                    input_variables=["question", "context"]
                )
            }
        )

        return await qa.ainvoke({
            "query": question,
        })
    
    '''
    LangChain API: retrieve
        Returns:
            [Document]: ['page_content', 'metadata']
    '''
    def retrieve_documents(self, question) -> List[Document]:
        return self.as_retriever().get_relevant_documents(
            query=question
        )

    '''
    LangChain API: get knowlegebase retriever
    '''
    def as_retriever(self):
        return AmazonKnowledgeBasesRetriever(
            region_name=self.region,
            knowledge_base_id=self.knowledgeBaseId,
            retrieval_config={
                "vectorSearchConfiguration": {
                    "numberOfResults": self.resultCount,
                    # 'overrideSearchType': "SEMANTIC", # do not work
                }
            },
        )
    