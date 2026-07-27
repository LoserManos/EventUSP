import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from app.main import app  
from app.database import get_session
from app.models import User
from app.security import create_access_token

SQL_URL = "sqlite://"
engine = create_engine(SQL_URL,connect_args={"check_same_thread": False},poolclass=StaticPool) # staticpool faz com que a conexão com o bd

@pytest.fixture(scope="function")
def db_session():

    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session
    SQLModel.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_session():
        yield db_session
    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        test_client.headers.update({"apiKey": "CHAVE SUPER SECRETAAAAAA2"})
        yield test_client
    app.dependency_overrides.clear()



@pytest.fixture(scope="function")
def token_valido(db_session):
    """Cria um usuário no banco em memória e gera um token para ele."""
    #  Cria o usuário fictício usando a db_session do teste
    user = User(name="Test User",nickname="natt",email="test@example.com", password="hash_da_senha")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    # Gera o token
    payload = {"sub": str(user.id)} 
    token = create_access_token(data=payload) 
    
    return token

@pytest.fixture(scope="function")
def auth_client(client, token_valido):
    """Retorna um TestClient que envia o token em todas as requisições."""
    # Injeta o cabeçalho Authorization padrão no cliente com o token de autenticação já injetado
    client.headers.update({"Authorization": f"Bearer {token_valido}"})
    return client