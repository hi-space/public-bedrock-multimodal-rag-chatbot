import time
import logging
import json
from typing import  Dict, Any
from fastapi import FastAPI, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware


class LoggingMiddleware(BaseHTTPMiddleware):
    def __init__(
            self,
            app: FastAPI,
            *,
            logger: logging.Logger
    ) -> None:
        super().__init__(app)
        self.logger = logger

    async def dispatch(self, request: Request, call_next):
        start_time = time.perf_counter()
        await self._request_log(request)
        response = await call_next(request)
        process_time = time.perf_counter() - start_time
        await self._response_log(request, response, process_time)
        return response

    async def _request_log(self, request: Request) -> None:
        path = request.url.path
        if request.query_params:
            path += f"?{request.query_params}"

        extra: Dict[str, Any] = {
            "url": path,
            "method": request.method,
            "ip": request.client.host,
            "query": dict(request.query_params),
        }

        if self._has_json_body(request):
            request_body = await request.body()
            try:
                extra["body"] = json.loads(request_body.decode("UTF-8"))
            except:
                extra["body"] = str(request_body)

        self.logger.debug(f"{extra}")

    @staticmethod
    def _has_json_body(request: Request) -> bool:
        if (
            request.method in ("POST", "PUT", "PATCH")
            and request.headers.get("content-type") == "application/json"
        ):
            return True
        return False

    async def _response_log(self, request: Request, response: Response, process_time: float) -> None:
        extra: Dict[str, Any] = {
            "url": str(request.url.path),
            "method": request.method,
            "statusCode": response.status_code,
            "processTime": f"{process_time:.4f}s"
        }

        if hasattr(response, 'body'):
            try:
                extra["body"] = json.loads(response.body.decode("UTF-8"))
            except:
                extra["body"] = str(response.body)

        self.logger.info(f"{extra}")