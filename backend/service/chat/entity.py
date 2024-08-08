from fastapi import Form, File, UploadFile
from enum import Enum
from pydantic import BaseModel
from typing import Optional, Union, List, Dict
from langchain.schema import Document


class ModelType(str, Enum):
    BASIC = "anthropic.claude-3-sonnet-20240229-v1:0"
    KNOWLEDGE_BASE = "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1"
    MULTIMODAL_SEARCH = 'multimodal-retireval'
    CROSS_MODAL_SEARCH = 'cross-modal-retrieval'
    MULTI_VECTOR_SEARCH = 'multi-vector-retireval'


class ResponseMsgType(str, Enum):
    NONE = "none"
    TOKEN = "token"
    END_TOKEN = "end_token"
    SOURCES = "sources"


class Message(BaseModel):
    model: str
    text: str
    file: Optional[UploadFile] = None
    prompt: Optional[str] = None


class ResponseMsg(BaseModel):
    type: ResponseMsgType
    data: Optional[Union[str, Dict]] = ''
    sources: Optional[List] = []
