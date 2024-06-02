import uvicorn
import json
import asyncio
from time import sleep
from threading import Thread, Lock
from fastapi import FastAPI
from starlette.requests import Request
from starlette.responses import Response
from fastapi.responses import JSONResponse
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from db import db
from utils import *
import update_routes as UR

queue = {} # {UUID:caller_id}
queue_lock = Lock()    

def remove_from_queue_t(user_uuid: str):
    global queue
    with queue_lock:
        if user_uuid in queue:
            del queue[user_uuid]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
app.include_router(UR.router)

headers = {"Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods":"GET, POST, OPTIONS"}

class UserData(BaseModel):
    username: str
    password: str
    flangs: list
    llangs: list

class UserUUID(BaseModel):
    user_uuid: str

class AuthData(BaseModel):
    user: str
    password: str
    
class QueueData(BaseModel):
    caller_id: str

@app.post("/create_user")
async def create_user(request: Request, data: UserData):
    if data != {}:

        db.add_user(data.username, argon_hash(data.password), data.flangs, data.llangs)
        return JSONResponse(status_code=200,
        content={},
        headers=headers)
    else:
        return JSONResponse(status_code=404,
        content={},
        headers=headers)
    
    
@app.post("/get_user")
async def get_user(request: Request, data: UserUUID):
    user_data = db.get_user_by_uuid(data.user_uuid)

    if user_data is not None:
        return JSONResponse(status_code=200,
        content=user_data,
        headers=headers)
    else:
        return JSONResponse(status_code=404,
        content={},
        headers=headers)
                

async def find_queue_match(current_user, user_uuid):
    global queue

    while True:
        with queue_lock:
            items_snapshot = list(queue.items())  # Create a snapshot of the items
            for uuid, call_id in items_snapshot:
                if uuid == user_uuid:
                    continue  # can't match with yourself
                user = db.get_user_by_uuid(uuid)
                if user is None:
                    continue
                
                current_flangs = current_user["flangs"]
                current_llangs = current_user["llangs"]
                user_flangs = user["flangs"]
                user_llangs = user["llangs"]

                if (any(element in current_flangs for element in user_llangs)
                    and any(element in user_flangs for element in current_llangs)):
                    
                    if (any(element in user_llangs for element in current_flangs)
                        and any(element in current_llangs for element in user_flangs)):
                        
                        # Remove both users from the queue
                        Thread(target=remove_from_queue_t, args=(uuid,)).start()

                        return {"caller_id": call_id, "user_id": uuid}
        
        await asyncio.sleep(1)  # Sleep to prevent a tight loop and yield execution

@app.post("/enter_queue")
async def enter_queue(request: Request, data: QueueData):
    global queue

    user_uuid = request.cookies.get("key")
    if user_uuid is None:
        return JSONResponse(status_code=404, content={"error": "User UUID not found in cookies"}, headers={})

    current_user = db.get_user_by_uuid(user_uuid)
    if current_user is None:
        return JSONResponse(status_code=404, content={"error": "User not found"}, headers={})

    with queue_lock:
        queue[user_uuid] = data.caller_id

    response = await find_queue_match(current_user, user_uuid)
    if response:
        return JSONResponse(status_code=200, content=response, headers={})
    else:
        return JSONResponse(status_code=404, content={}, headers={})




@app.post("/authenticate")
async def authenticate(request: Request, data: AuthData):
    user = db.get_user_by_username(data.user)
    if user is None:
        return {"authenticated": False}

    if verify_hash(user["password"], data.password):
        response = JSONResponse(status_code=200, content={"authenticated": True})
        response.set_cookie(key="key", value=user["uuid"], path="/")
        return response
            
    return {"authenticated": False}
    
@app.post("/add_friend")
async def add_friend(request: Request, data: UserUUID):
    if db.add_friend(request.cookies.get("key"), data.user_uuid):
        JSONResponse(status_code=200, content={}, headers=headers)
    else:
        JSONResponse(status_code=404, content={}, headers=headers)

@app.post("/remove_friend")
async def remove_friend(request: Request, data: UserUUID):
    user_uuid = request.cookies.get("key")
    if data.user_uuid != "" and user_uuid is not None:
        db.remove_friend(user_uuid, data.user_uuid)
        return JSONResponse(status_code=200, content={}, headers=headers)
    else:
        return JSONResponse(stauts_code=400, content={}, headers=headers)
        
@app.get("/get_all_users") # DELETE LATER!
async def get_all_users(request: Request):
    try:
        return JSONResponse(status_code=200, content=db.get_all_users(), headers=headers)
    except:
        return JSONResponse(status_code=404, content={}, headers=headers)