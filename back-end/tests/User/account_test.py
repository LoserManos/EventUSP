import pytest
from sqlmodel import Session,select
from app.models import User

## cenario 1: criação de user com bio, com sucesso!
def test_create_account(client,db_session:Session):
    
    body = {
        "name": "nattan",
        "email": "nattan@gmail.com",
        "password":"123",
        "bio": "lalalala"
    }

    response = client.post("/auth/singup",json=body)
    dataResponse = response.json()
    assert response.status_code == 201
    assert dataResponse["name"] == "nattan"
    assert dataResponse["email"] == "nattan@gmail.com"
    assert dataResponse["bio"] == "lalalala"
    query = select(User).where(User.email == dataResponse["email"])
    user = db_session.exec(query).first()
    assert user is not None
    assert user.name == dataResponse["name"]





