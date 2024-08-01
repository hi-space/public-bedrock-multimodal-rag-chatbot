from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv()

class Settings(BaseSettings):
    AWS_REGION: str
    AWS_ACCESS_KEY: str
    AWS_SECRET_KEY: str

    BEDROCK_REGION: str
    LLM_MODEL_ID: str

    DATA_FOLDER: str
    DYNAMODB_TABLE: str

    OPENSEARCH_REGION: str
    OPENSEARCH_ENDPOINT: str
    OPENSEARCH_INDEX_TEXT: str
    OPENSEARCH_INDEX_IMAGE: str

    REDIS_HOST: str
    REDIS_PORT: str

config = Settings()
