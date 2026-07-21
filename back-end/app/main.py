from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from app.database import get_session, create_db_and_tables, engine
from app.routes import auth,events,users, organizations
from app.models import Category, CategoryType

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(events.router)
app.include_router(auth.router) ## inclui as rotas do auth no arquivo principal
app.include_router(organizations.router)

def popular_categorias_iniciais():
    """Lê o Enum CategoryType e cria todas as categorias no banco automaticamente."""
    with Session(engine) as session:
        for tipo_enum in CategoryType:
            # Verifica se essa categoria já existe no banco para não duplicar
            categoria_existente = session.exec(select(Category).where(Category.type == tipo_enum)).first()
            if not categoria_existente:
                nova_categoria = Category(type=tipo_enum)
                session.add(nova_categoria)
        session.commit()

@app.on_event("startup")
def on_startup():
    create_db_and_tables() ##cria as tabelas do banco de dados(se não existirem)
    popular_categorias_iniciais() ## cria as catogrias iniciais



@app.get("/")
def root():
    return {"status": "API rodando!"}