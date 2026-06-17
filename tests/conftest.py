import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from app.main import app  
from app.database import get_session

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
        yield test_client
    app.dependency_overrides.clear()