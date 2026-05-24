from fastapi import FastAPI
from app.database import get_session, create_db_and_tables
from app.routes import auth,events,users
app = FastAPI()

app.include_router(auth.router) ## inclui as rotas do auth no arquivo principal

@app.on_event("startup")
def on_startup():
    create_db_and_tables() ##cria as tabelas do banco de dados(se não existirem)

@app.get("/")
def root():
    return {"status": "API rodando!"}