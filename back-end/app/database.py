from sqlmodel import create_engine, SQLModel, Session
import os

# Nome do arquivo do banco de dados
sqlite_file_name = "database.db"

# A URL de conexão para SQLite. 
sqlite_url = f"sqlite:///{sqlite_file_name}"

# echo=True faz com que o SQL executado apareça no terminal 
engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})

def create_db_and_tables():
    """Cria as tabelas no banco de dados se elas não existirem."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Função utilitária para fornecer uma sessão do banco para as rotas."""
    with Session(engine) as session:
        yield session