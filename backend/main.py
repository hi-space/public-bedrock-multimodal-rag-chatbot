from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from middleware.logger import LoggingMiddleware
from api.root.router import router as rootRouter
from api.chat.router import router as chatRouter
from api.product.router import router as productRouter

from common.logger import logger


app = FastAPI()

app.add_middleware(LoggingMiddleware, logger = logger)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rootRouter)
app.include_router(chatRouter)
app.include_router(productRouter)