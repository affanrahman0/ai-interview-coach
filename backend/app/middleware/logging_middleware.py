"""
PHASE 1 (hardening) / PHASE 6: Simple request logging middleware.
"""

# import time
# import logging
# from starlette.middleware.base import BaseHTTPMiddleware
#
# logger = logging.getLogger("ai_interview_coach")
#
#
# class LoggingMiddleware(BaseHTTPMiddleware):
#     async def dispatch(self, request, call_next):
#         start_time = time.time()
#         response = await call_next(request)
#         duration_ms = (time.time() - start_time) * 1000
#         logger.info(
#             f"{request.method} {request.url.path} - {response.status_code} - {duration_ms:.2f}ms"
#         )
#         return response
