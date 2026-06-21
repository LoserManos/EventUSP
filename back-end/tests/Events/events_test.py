import pytest
from sqlmodel import Session, select
from app.models import Event

def test_criar_evento_com_sucesso(client, db_session: Session):
    user_body = {
        "name": "Leo",
        "email": "leo@teste.com",
        "password": "senha",
        "bio": "Testando rotas de eventos"
    }
    client.post("/auth/singup", json=user_body)
    login_response = client.post("/auth/login", json=user_body)
    token = login_response.json()["access_token"]

    headers = {
        "Authorization": f"Bearer {token}"
    }

    event_body = {
        "title": "Treino Aberto de Vôlei",
        "start_date": "2026-08-15T18:00:00",
        "duration": 120,
        "local": "CEPEUSP - Módulo 6",
        "category_id": 2 #categoria 2 é de SPORT
    }

    response = client.post("/eventos/", json=event_body, headers=headers)
    data = response.json()

    assert response.status_code == 201
    assert data["mensagem"] == "Evento criado com sucesso!"
    assert "evento_id" in data

    # VALIDAÇÃO NO BANCO DE DADOS
    evento_salvo = db_session.exec(select(Event).where(Event.title == event_body["title"])).first()
    assert evento_salvo is not None
    assert evento_salvo.category_id == 2

def test_criar_evento_sem_autenticacao(client):
    """Garante que a API bloqueia requisições sem o header Authorization."""
    event_body = {
        "title": "Festa Junina Fau",
        "start_date": "2026-10-10T22:00:00",
        "duration": 360,
        "local": "Faculdade de Arquitetura e Urbanismo",
        "category_id": 1 # Categoria 1 é PARTY
    }

    # Disparar a requisição sem a variável 'headers'
    response = client.post("/eventos/", json=event_body)
    data = response.json()

    # O FastAPI deve retornar 401 e o detalhe padrão de falta de autenticação
    assert response.status_code == 401
    assert data["detail"] == "Not authenticated"


def test_criar_evento_com_token_invalido(client):
    """Garante que a API barra tokens inventados, corrompidos ou expirados."""
    
    event_body = {
        "title": "Palestra Magna",
        "start_date": "2026-11-05T10:00:00",
        "duration": 120,
        "local": "Auditório Principal",
        "category_id": 4
    }

    # Cria um cabeçalho com um token que não foi gerado pelo nosso app
    headers = {
        "Authorization": "Bearer um_token_completamente_falso_e_inventado"
    }

    response = client.post("/eventos/", json=event_body, headers=headers)
    data = response.json()

    assert response.status_code == 401
    assert data["detail"] == "Token inválido ou expirado. Faça login novamente."

def test_criar_evento_dados_incompletos(client):
    """Garante que a API bloqueia a criação se faltarem campos obrigatórios (ex: título e local)."""
    
    user_body = {"name": "Pica-Pau", "email": "picapau@teste.com", "password": "senha"}
    client.post("/auth/singup", json=user_body)
    login_response = client.post("/auth/login", json=user_body)
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    event_body_incompleto = {
        "start_date": "2026-08-15T18:00:00",
        "duration": 120,
        "category_id": 2
        # Faltam title e local
    }

    response = client.post("/eventos/", json=event_body_incompleto, headers=headers)

    # O status deve ser 422 (Entidade Não Processável)
    assert response.status_code == 422
    
    # Opcional: O FastAPI detalha na resposta exatamente o que faltou. Podemos validar se ele acusou o "title" e o "local".
    detalhes_erro = response.json()["detail"]
    erros_campos = [erro["loc"][-1] for erro in detalhes_erro]
    
    assert "title" in erros_campos
    assert "local" in erros_campos

def test_criar_evento_duracao_negativa(client):
    """Garante que o Pydantic barra eventos com duração zero ou negativa."""
    
    user_body = {"name": "Xablau", "email": "xablau@teste.com", "password": "senha"}
    client.post("/auth/singup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    event_body = {
        "title": "Reunião Rápida",
        "start_date": "2026-12-10T10:00:00",
        "duration": -30, 
        "local": "Sala 2",
        "category_id": 3
    }
    
    response = client.post("/eventos/", json=event_body, headers=headers)
    
    assert response.status_code == 422
    assert "duration" in response.text # Confirma se o erro apontou para o campo correto

def test_criar_evento_data_passada(client):
    """Garante que o Pydantic barra a criação de eventos que já aconteceram."""
    
    user_body = {"name": "Viajante_do_tempo", "email": "tempo@teste.com", "password": "senha"}
    client.post("/auth/singup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Data no ano de 2020
    event_body = {
        "title": "Festa do Passado",
        "start_date": "2020-05-10T22:00:00", 
        "duration": 240,
        "local": "Galpão da Vet",
        "category_id": 1
    }
    
    response = client.post("/eventos/", json=event_body, headers=headers)
    
    assert response.status_code == 422
    assert "start_date" in response.text # Confirma se o erro apontou para a data