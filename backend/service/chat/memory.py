from langchain_core.language_models.chat_models import BaseChatModel
from langchain.memory import RedisChatMessageHistory, ConversationTokenBufferMemory
from langchain.memory.chat_memory import BaseChatMemory

from redis import Redis
from service.chat.claude import BedrockClaude
from config import config
from common.logger import logger


class ChatMemory():
    def __init__(self, redisUrl=config.REDIS_URL, redisPort=config.REDIS_PORT):
        self.host = redisUrl
        self.port = redisPort
        self.redis = Redis(host=redisUrl, port=redisPort, decode_responses=True)
        self.keyPrefix = "chat:"

    def get_chat_list(self):
        cursor = '0'
        keys = []
        pattern = self.keyPrefix + '*'
        while cursor != 0:
            cursor, batch = self.redis.scan(cursor=cursor, match=pattern)
            keys.extend(batch)
        return keys

    def remove_all_message(self):
        cursor = '0'
        keys = []
        pattern = self.keyPrefix + '*'
        while cursor != 0:
            cursor, batch = self.redis.scan(cursor=cursor, match=pattern)
            keys.extend(batch)
        self.redis.delete(*keys)

    def get_memory(self, chatId: str, llm: BaseChatModel = BedrockClaude().get_chat_model()) -> BaseChatMemory:
        return ConversationTokenBufferMemory(
                llm=llm,
                max_token_limit=5000,
                memory_key="history",
                chat_memory=self.get_redis_chat(chatId),
                ai_prefix="Assistant",
                human_prefix="Human",
                return_messages=True
            )

    def get_memory_dict(self, chatId: str):
        try:
            memory = self.get_memory(chatId=chatId)
            return [{
                'sender': memory.ai_prefix if msg.type == 'ai' else memory.human_prefix,
                'message': msg.content,
            } for msg in memory.buffer_as_messages]
        except Exception as e:
            logger.error(e)
            return []
    
    def clear_memory(self, chatId: str):
        chat = self.get_redis_chat(chatId)
        chat.clear()

    def get_redis_chat(self, chatId: str):
        return RedisChatMessageHistory(
                session_id=chatId,
                url=f"redis://{self.host}:{self.port}",
                key_prefix=self.keyPrefix
            )