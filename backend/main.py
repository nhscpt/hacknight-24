import uvicorn
import json
from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import Response
from fastapi.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import db as Database
from utils import *

db = Database.DB("localhost", 6379)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

headers = {"Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":"GET, POST, OPTIONS"}

    
class UserData(BaseModel):
    username: str
    password: str
    friends: list
    flangs: list
    llangs: list

@app.post("/create_user")
async def create_user(request: Request, data: UserData):
    if data != {}:

        db.add_user(data.username, argon_hash(data.password), data.friends, data.flangs, data.llangs)
        return JSONResponse(status_code=200,
        content={},
        headers=headers)
    else:
        return JSONResponse(status_code=404,
        content={},
        headers=headers)
    
    
class UserUUID(BaseModel):
    user_uuid: str

@app.post("/get_user")
async def get_user(request: Request, data: UserUUID):
    user_data = db.get_user_by_uuid(data.user_uuid)

    if user_data is not None:
        return JSONResponse(status_code=200,
        content=json.dumps(user_data),
        headers=headers)
    else:
        return JSONResponse(status_code=404,
        content={},
        headers=headers)
        
        
class AuthData(BaseModel):
    user: str
    password: str

@app.post("/authenticate")
async def authenticate(request: Request, data: AuthData):
    user = db.get_user_by_username(data.user)
    if user is None:
        return {"authenticated": False}

    if verify_password(user["password"], data.password):
        response = JSONResponse(status_code=200, content={"authenticated": True})
        response.set_cookie(key="key", value=user["uuid"], path="/")
        return response
            
    return {"authenticated": False}

@app.post("/add_friend")
async def add_friend(request: Request, data: UserUUID):
    if db.add_friend(x, data.user_uuid) is not None:
        JSONResponse(status_code=200, content={}, headers=headers)
    else:
        JSONResponse(status_code=404, content={}, headers=headers)