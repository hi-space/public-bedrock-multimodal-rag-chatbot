from abc import ABC, abstractmethod
from typing import List
from langchain.schema import Document
from service.chat.claude import BedrockClaude
from service.chat.knowlegebase import BedrockKnowledgeBase
from service.chat.entity import ModelType
from service.chat.retriever.opensearch_multimodal import OpenSearchMultimodal
from service.chat.retriever.opensearch_multivector import OpenSearchMultiVector
from service.chat.retriever.opensearch_hybrid import OpenSearchHybridSearch
from service.chat.prompt import get_prompt

from common.logger import logger


class Retriever(ABC):
    @abstractmethod
    def retrieve(self, text: str = None, image: str = None) -> List[dict]:
        raise NotImplementedError("Subclasses should implement this method.")

    @staticmethod
    def describe_image(image) -> str:
        res = BedrockClaude().get_chat_model().invoke(get_prompt(
            text='''Describe in detail any accessories or clothing items in the image in Korean. Don't explain people.''',
            image=image
        ))
        logger.debug(res)
        return res.content
    

    @staticmethod
    def extract_metadata_from_documents(context: List[Document]) -> List[Document]:
        return [{
                **doc.to_json().get('kwargs', {}).get('metadata', {}),
                'content': doc.to_json().get('kwargs', {}).get('page_content', ''),
            } for doc in context]


class RetrieverFactory():
    @staticmethod
    def get_retriever(modelType: ModelType) -> Retriever:
        if modelType == ModelType.BASIC:
            return BasicRetriever()
        elif modelType == ModelType.KNOWLEDGE_BASE:
            return KnowledgeBaseRetriever()
        elif modelType == ModelType.MULTIMODAL_SEARCH:
            return MultimodalRetriever()
        elif modelType == ModelType.CROSS_MODAL_SEARCH:
            return CrossModalRetriever()
        elif modelType == ModelType.MULTI_VECTOR_SEARCH:
            return MultiVectorRetriever()
        else:
            raise ValueError(f"Unknown ModelType: {modelType}")

        
class BasicRetriever(Retriever):
    def retrieve(self, text: str = None, image: str = None) -> List[dict]:
        return None


class KnowledgeBaseRetriever(Retriever):
    def __init__(self):
        self.kb = BedrockKnowledgeBase(modelArn=ModelType.KNOWLEDGE_BASE.value)

    def retrieve(self, text: str = None, image: str = None) -> List[dict]:
        context = []
        if image:
            imageDesc = Retriever.describe_image(image)
            imageContext = self.kb.retrieve_documents(question=imageDesc)
            context.extend(imageContext)
        if text and text != 'Human: ':
            textContext = self.kb.retrieve_documents(question=text)
            context.extend(textContext)

        metadata = KnowledgeBaseRetriever.knowlegebase_metadata(context)
        return metadata
    
    @staticmethod
    def knowlegebase_metadata(context: List[Document]):
        return [{
                'content': doc.page_content,
                'url': doc.metadata.get('location', {}).get('s3Location', {}).get('uri', ''),
                'source': 's3',
                'similarity': doc.metadata.get('score', 0),            
            } for doc in context]


class MultimodalRetriever(Retriever):
    def retrieve(self, text: str = None, image: str = None) -> List[dict]:
        retriever = OpenSearchMultimodal()
        context = retriever.get_relevant_documents(text=text, image=image)
        metadata = Retriever.extract_metadata_from_documents(context)
        return metadata


class CrossModalRetriever(Retriever):
    def retrieve(self, text: str = None, image: str = None) -> List[dict]:
        retriever = OpenSearchHybridSearch()
        context = []
        if image:
            imageDesc = Retriever.describe_image(image)
            imageContext = retriever.get_relevant_documents(imageDesc)
            context.extend(imageContext)
        if text and text != 'Human: ':
            textContext = retriever.get_relevant_documents(text)
            context.extend(textContext)
        metadata = Retriever.extract_metadata_from_documents(context)
        return metadata
    

class MultiVectorRetriever(Retriever):
    def retrieve(self, text: str = None, image: str = None) -> List[dict]:
        retriever = OpenSearchMultiVector()
        context = retriever.get_relevant_documents(text=text, image=image)
        metadata = Retriever.extract_metadata_from_documents(context)
        return metadata

