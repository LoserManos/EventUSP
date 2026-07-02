import pytest
from sqlmodel import Session,select
from app.models import User

## cenario 1: criação de user com bio, com sucesso!
def test_create_account(client,db_session:Session):
    
    body = {"name": "nattan","email": "nattan@gmail.com","password":"123","bio": "lalalala"}

    response = client.post("/auth/signup",json=body)
    dataResponse = response.json()
    assert response.status_code == 201
    assert dataResponse["name"] == "nattan"
    assert dataResponse["email"] == "nattan@gmail.com"
    assert dataResponse["bio"] == "lalalala"
    query = select(User).where(User.email == dataResponse["email"])
    user = db_session.exec(query).first()
    assert user is not None
    assert user.name == dataResponse["name"]


## cenario 2: criação de user sem bio, com sucesso!
def test_create_account_no_bio(client,db_session:Session):
    
    body = {"name": "nattan","email": "nattan@gmail.com","password":"123"}

    response = client.post("/auth/signup",json=body)
    dataResponse = response.json()
    assert response.status_code == 201
    assert dataResponse["name"] == "nattan"
    assert dataResponse["email"] == "nattan@gmail.com"
    query = select(User).where(User.email == dataResponse["email"])
    user = db_session.exec(query).first()
    assert user is not None
    assert user.name == dataResponse["name"]

## cenario 3: criação de user com email já cadastrado, deve retornar erro
def test_create_account_same_email(client,db_session:Session):
    
    user1 = {"name": "nattan","email": "nattan@gmail.com","password":"123","bio": "lalalala"}

    client.post("/auth/signup",json=user1)
    user2 = {"name": "leonardo","email": "nattan@gmail.com","password":"123","bio": "lalalala"}

    response = client.post("/auth/signup",json=user2)
    dataResponse = response.json()
    assert response.status_code == 400

## cenario 4: criação de user com nome já cadastrado, deve retornar erro
def test_create_account_same_name(client,db_session:Session):
    
    user1 = {"name": "nattan","email": "nattan@gmail.com","password":"123","bio": "lalalala"}
    client.post("/auth/signup",json=user1)
    user2 = {"name": "nattan","email": "n@gmail.com","password":"123","bio": "lalalala"}
    response = client.post("/auth/signup",json=user2)
    dataResponse = response.json()
    assert response.status_code == 400


## cenario 5: login correto em conta existente, deve retornar sucesso
def test_login(client,db_session:Session):
    
    user = {"name": "nattan","email": "nattan@gmail.com","password":"123","bio": "lalalala"}
    client.post("/auth/signup",json=user)
    login = {"name": "nattan","email": "nattan@gmail.com","password":"123",}
    res = client.post("/auth/login",json=login)
    dataRes = res.json()
    query = select(User).where(User.email == login["email"])
    user = db_session.exec(query).first()
    assert user is not None
    assert res.status_code == 200
    assert dataRes["token_type"] == "bearer"
    assert dataRes["id_user"] == user.id
    assert dataRes["access_token"] is not None


## cenario 6: login com senha errada em conta existente, deve retornar erro
def test_login(client,db_session:Session):
    
    user = {"name": "nattan","email": "nattan@gmail.com","password":"123","bio": "lalalala"}
    client.post("/auth/signup",json=user)
    login = {"name": "nattan","email": "nattan@gmail.com","password":"1234",}
    res = client.post("/auth/login",json=login)
    assert res.status_code == 400


## cenario 7: login com email errado em conta existente, deve retornar erro
def test_login(client,db_session:Session):
    
    user = {"name": "nattan","email": "nattan@gmail.com","password":"123","bio": "lalalala"}
    client.post("/auth/signup",json=user)
    login = {"name": "nattan","email": "natt@gmail.com","password":"1234",}
    res = client.post("/auth/login",json=login)
    assert res.status_code == 400



