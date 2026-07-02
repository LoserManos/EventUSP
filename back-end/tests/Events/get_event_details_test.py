import pytest
from sqlmodel import Session, select
from app.models import Event

def test_ver_detalhes_do_evento_com_sucesso(client):
    """Garante que buscar um ID válido retorna todos os dados do evento."""
    
    user_body = {"name": "Organizador IME", "email": "org@ime.usp.br", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_body = {
        "title": "Hackathon do BCC",
        "start_date": "2026-08-20T08:00:00",
        "duration": 2880, # 48 horas de hackathon
        "local": "CEC",
        "category_id": 8 # ACADEMIC
    }
    
    # Criamos o evento e capturamos o ID que o banco gerou para ele
    resp_criacao = client.post("/eventos/", json=evento_body, headers=headers)
    evento_id = resp_criacao.json()["evento_id"]

    # Bater na rota de detalhes usando o ID gerado
    response = client.get(f"/eventos/{evento_id}")
    data = response.json()

    # VALIDAÇÃO
    assert response.status_code == 200
    assert data["id"] == evento_id
    assert data["title"] == "Hackathon do BCC"
    assert data["local"] == "CEC"
    assert "created_at" in data  # Garante que o banco preencheu a data de criação automaticamente


def test_ver_detalhes_de_evento_inexistente(client):
    """Garante que buscar um ID que não existe retorna Erro 404."""
    
    # Tentar acessar um evento com um ID absurdamente alto
    response = client.get("/eventos/9999")
    data = response.json()

    # VALIDAÇÃO: O FastAPI deve retornar Not Found (404) e a mensagem exata do seu events.py
    assert response.status_code == 404
    assert data["detail"] == "Evento não encontrado."

