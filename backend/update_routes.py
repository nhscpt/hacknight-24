from fastapi import APIRouter
from starlette.requests import Request
from starlette.responses import Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from db import db
from utils import *

router = APIRouter()

headers = {"Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":"GET, POST, OPTIONS"}

class ListInput(BaseModel):
    list_input: list[str]

@router.post("/update_user")
async def update_user(request: Request, username: str):
    user_uuid = request.cookies.get("key")
    if user_uuid != None and username != "":
        db.update_username(user_uuid, username)
        return JSONResponse(status_code=200, content={}, headers=headers)
    elif not username:
        return JSONResponse(status_code=400, content={}, headers=headers)
    else:
        return JSONResponse(status_code=404, content={}, headers=headers)

@router.post("/update_password")
async def update_password(request: Request, password: str):
    user_uuid = request.cookies.get("key")
    if user_uuid and password:
        db.update_password(user_uuid, argon_hash(password))
        return JSONResponse(status_code=200, content={}, headers=headers)
    elif not password:
        return JSONResponse(status_code=400, content={}, headers=headers)
    else:
        return JSONResponse(status_code=404, content={}, headers=headers)

@router.post("/update_friends")
async def update_friends(request: Request, data: ListInput):
    user_uuid = request.cookies.get("key")
    if user_uuid and data.list_input:
        db.update_friends(user_uuid, data.list_input)
        return JSONResponse(status_code=200, content={}, headers=headers)
    elif not data.list_input:
        return JSONResponse(status_code=400, content={}, headers=headers)
    else:
        return JSONResponse(status_code=404, content={}, headers=headers)

@router.post("/update_flangs")
async def update_flangs(request: Request, data: ListInput):
    user_uuid = request.cookies.get("key")
    if user_uuid and data.list_input:
        db.update_flangs(user_uuid, data.list_input)
        return JSONResponse(status_code=200, content={}, headers=headers)
    elif not data.list_input:
        return JSONResponse(status_code=400, content={}, headers=headers)
    else:
        return JSONResponse(status_code=404, content={}, headers=headers)

@router.post("/update_llangs")
async def update_llangs(request: Request, data: ListInput):
    user_uuid = request.cookies.get("key")
    if user_uuid and data.list_input:
        db.update_llangs(user_uuid, data.list_input)
        return JSONResponse(status_code=200, content={}, headers=headers)
    elif not data.list_input:
        return JSONResponse(status_code=400, content={}, headers=headers)
    else:
        return JSONResponse(status_code=404, content={}, headers=headers)