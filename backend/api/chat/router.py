from fastapi import APIRouter, WebSocket, Form, File, UploadFile
from fastapi.responses import StreamingResponse, JSONResponse
from service.chat.chain import StreamingChatChain
from service.chat.memory import ChatMemory

from service.chat.entity import *

from common.logger import logger
from utils.images import save_image_file, image_to_base64


router = APIRouter(
    prefix="/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

'''
Supported LLM List
'''
@router.get("/model")
async def list_llm_models():
    return [{"name": model_type.name, "value": model_type.value} for model_type in ModelType]


'''
Get Chat List
'''
@router.get("")
async def chat_list():
    return ChatMemory().get_chat_list()


'''
Multimodal Chat
'''
@router.post("")
async def chat(model: ModelType = Form(...),
                sessionId: str = Form(''),
                text: str = Form(''),
                file: UploadFile = File(None)):
    logger.info(f"[{sessionId}] {text}")
    
    sessionId = None if sessionId == '' else sessionId
    image = await image_to_base64(file) if file else None  

    chain = StreamingChatChain(modelType=model, sessionId=sessionId)
    return StreamingResponse(chain.generate_response(text=text, image=image),
                            media_type='text/event-stream')


'''
Get Chat History
'''
@router.get("/{sessionId}")
async def get_conversations(sessionId: str):
    logger.info(f"[{sessionId}]")
    return JSONResponse(content=ChatMemory().get_memory_dict(chatId=sessionId))

