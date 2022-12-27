from typing import Union

from multiprocessing.dummy import Process
import asyncio
from fastapi import FastAPI
from pydantic import BaseModel
from server.start import User
import json
from fastapi.middleware.cors import CORSMiddleware
import time


app = FastAPI()


class user_data:
    def __init__(self, username, password):
        self.user = User(username, password)
        self.my_hach = str(self.user.hach)
        self.my_coins = str(self.user.check_coins())

class messageBody(BaseModel):
    from_hach: str
    to_hach: str
    message: object

class coinsBody(BaseModel):
    from_hach: str
    to_hach: str
    count_coins: str

class messageEncryptBody(BaseModel):
    password: str
    message: str

class messageDecryptBody(BaseModel):
    password: str
    message: object

class messageCryptBody(BaseModel):
    action: str
    curlid: str
    random_key: str
    random_number: str
    secret_text: str
    
class testBody(BaseModel):
    action: str
    curlid: str
    random_key: str
    random_number: str
    secret_text: str

class encBody(BaseModel):
    private_key: str
    encrypted_object: testBody

username = "maxat"
password = "123"
user_data = user_data(username, password)

@app.post("/sendMessage")
async def send_message(body: messageBody):
    print(body.message)
    data = {
        "type_task": "custom",
        "from_hach": body.from_hach,
        "to_hach": body.to_hach,
        "message": body.message
    }
    print(data)
    result = user_data.user.send_task(data)
    print(result)
    return result


@app.post("/test_enc")
async def test_enc(body: encBody):
    print(body)
    return user_data.user.decrypt_message(body)


@app.post("/encryptMessage")
async def encrypt_message(body: messageEncryptBody):
    data = {
        "message": body.message,
        "password": body.password
    }
    result = user_data.user.encrypt_message(data)
    return result

@app.post("/decrypt_message")
async def decrypt_message(body: messageDecryptBody):
    data = {
        "private_key": body.password,
        "encrypted_object": body.message
    }
    result = user_data.user.decrypt_message(data)
    return result


@app.post("/send_coins")
async def send_message(body: coinsBody):
    data = {
        "type_task": "send_coins",
        "from_hach": body.from_hach,
        "to_hach": body.to_hach,
        "count_coins": body.count_coins
    }
    result = user_data.user.send_task(data)
    return result


@app.get("/get_tasks")
async def get_tasks():
    return user_data.user.get_tasks()

@app.get("/startDoingTasks")
async def do_tasks():
    user_data.user.do_tasks_value = True
    # user_data.user.do_tasks()

    process = Process(target = user_data.user.do_tasks)
    process.start()
    print('popa')
    # time.sleep(300)
    # user_data.user.do_tasks_value = False

@app.get("/stopDoingTasks")
async def stop_tasks():
    user_data.user.do_tasks_value = False

@app.get("/getAllChains")
async def get_chains():
    return user_data.user.get_chains()

@app.get("/update_coins")
async def update_coins():
    user_data.my_coins = user_data.user.check_coins()
    return {"coins" : user_data.my_coins}

@app.get("/getUserData")
async def my_data():
    data = {
        "username": "maxat",
        'hach': user_data.my_hach,
        'coins': user_data.my_coins
    }
    return data
    



origins = [
    "http://localhost:8080",
    "http://128.0.0.1:8000",
    "http://192.168.0.229:8080",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    max_age=3600
)

