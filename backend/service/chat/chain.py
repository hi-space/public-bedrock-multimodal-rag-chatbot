import asyncio
import time
from typing import AsyncGenerator
from langchain_core.language_models.chat_models import BaseChatModel
from langchain.callbacks import StreamingStdOutCallbackHandler, AsyncIteratorCallbackHandler

from service.chat.claude import BedrockClaude
from service.chat.entity import ModelType, ResponseMsg, ResponseMsgType
from service.chat.prompt import get_prompt
from service.chat.rag import RetrieverFactory
from service.chat.memory import ChatMemory
from common.logger import logger
from utils.uuid import generate_uuid


class StreamingChatChain:
    def __init__(self, modelType: ModelType, sessionId: str = generate_uuid()):
        self.modelType = modelType
        self.sessionId = sessionId

        self.llm = None
        self.memory = None
        self.retriever = None

        self.initialize()

    def initialize(self):
        self.llm = self.get_llm()
        self.memory = ChatMemory().get_memory(chatId=self.sessionId, llm=self.llm)
        self.retriever = RetrieverFactory.get_retriever(modelType=self.modelType)
    

    '''
    Generate SSE responses
    '''
    async def generate_response(self, text: str = '', image: str = None) -> AsyncGenerator[str, None]:
        callback = AsyncIteratorCallbackHandler()
        
        self.llm = self.get_llm(callback=callback)

        context = self.retriever.retrieve(
            text=text,
            image=image
        )

        if len(self.memory.chat_memory.messages) == 0 and text == '':
            text = '이 상품에 대해 설명해줘'

        msg = get_prompt(text=text,
                            image=image,
                            conversations=self.memory.buffer_as_str,
                            context=context)
                
        startTime = time.monotonic()
        task = asyncio.create_task(
            self.llm.ainvoke(msg)
        )
        
        try:
            endTime = 0
            receiveFirstToken = False
            async for token in callback.aiter():
                if not receiveFirstToken:
                    endTime = time.monotonic()
                    receiveFirstToken = True

                yield StreamingChatChain.make_response_msg(ResponseMsg(
                    type=ResponseMsgType.TOKEN,
                    data=token
                ))

            if context:
                yield StreamingChatChain.make_response_msg(ResponseMsg(
                    type=ResponseMsgType.SOURCES,
                    sources=context
                ))

            result = await task
            yield StreamingChatChain.make_response_msg(ResponseMsg(
                type=ResponseMsgType.END_TOKEN,
                data={
                    'sessionId': self.sessionId,
                    'message': result.content.rstrip('\n'),
                    'tokens': result.response_metadata.get('usage', {}),
                    'elapsedTime': endTime - startTime,
                }
            ))
            
            self.memory.chat_memory.add_user_message(text)
            self.memory.chat_memory.add_ai_message(result.content)
            
            logger.debug(result)
        except Exception as e:
            logger.error(f"Caught exception: {e}")
            yield StreamingChatChain.make_response_msg(ResponseMsg(
                type=ResponseMsgType.END_TOKEN,
                data={
                    'sessionId': self.sessionId,
                    'message': '오류가 발생했습니다. 다시 시도해주세요.',
                    'tokens': 0,
                    'elapsedTime': 0,
                }
            ))
        finally:
            callback.done.set()

    '''
    LLM Model
    '''
    def get_llm(self, callback=StreamingStdOutCallbackHandler()) -> BaseChatModel:
        return BedrockClaude().get_chat_model(callback=callback)


    '''
    Transform data
    '''
    @staticmethod
    def make_response_msg(msg: ResponseMsg):
        return msg.model_dump_json() + '\n\n'
    