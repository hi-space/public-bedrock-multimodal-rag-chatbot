from enum import Enum
from pydantic import BaseModel


class ChatRequest(BaseModel):
    text: str = ''
    image: str = ''