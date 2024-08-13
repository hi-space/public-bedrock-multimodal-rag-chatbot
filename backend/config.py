from dotenv import load_dotenv
from pydantic_settings import BaseSettings

from common.logger import logger


load_dotenv()

class Settings(BaseSettings):
    AWS_REGION: str

    AWS_ACCESS: str
    AWS_SECRET: str

    OPENSEARCH_ENDPOINT: str
    OPENSEARCH_IMAGE_INDEX: str
    OPENSEARCH_TEXT_INDEX: str
    
    REDIS_URL: str
    REDIS_PORT: str

    DYNAMODB_TABLE: str

    BEDROCK_REGION: str
    BEDROCK_MODEL: str
    KNOWLEDGEBASE_ID: str


config = Settings()
logger.debug(config)