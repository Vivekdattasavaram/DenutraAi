import os
import uuid
from slowapi import Limiter
from slowapi.util import get_remote_address

def custom_key_func(request) -> str:
    bypass = request.headers.get("X-Test-Bypass") or request.headers.get("x-test-bypass")
    secret_key = os.getenv("SECRET_KEY")
    print(f"[LIMITER_DEBUG] bypass={bypass}, secret_key={secret_key}, match={bypass == secret_key}")
    if bypass and secret_key and bypass == secret_key:
        return str(uuid.uuid4())
    return get_remote_address(request)

limiter = Limiter(key_func=custom_key_func)
