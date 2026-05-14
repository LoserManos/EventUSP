from fastapi import FastAPI
from app.database import get_session, create_db_and_tables
app = FastAPI()

@app.on_event("startup")
def on_startup():
    ## cria as tabelas do banco de dados(se não existirem)
    create_db_and_tables()

@app.get("/")
def root():
    return {"status": "API rodando!"}