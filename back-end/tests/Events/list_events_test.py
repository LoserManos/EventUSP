import pytest
from sqlmodel import Session, select
from app.models import Event

def test_listar_eventos_paginacao(client):
    """Garante que o feed retorna a quantidade correta de eventos e calcula o total."""
    
    user_body = {"name": "Espectador", "email": "feed@teste.com", "password": "senha"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Criação de eventos genéricos para testarmos depois 
    for i in range(3):
        event_body = {
            "title": f"Semana de Arte e Cultura - Dia {i+1}",
            "start_date": "2026-10-10T10:00:00",
            "duration": 240,
            "local": "Praça do Relógio",
            "category_id": 5
        }
        client.post("/eventos/", json=event_body, headers=headers)

    # Buscar o feed pedindo a primeira página, mas com limite de 2 eventos
    response = client.get("/eventos/?pagina=1&limite=2")
    data = response.json()

    assert response.status_code == 200
    assert data["pagina_atual"] == 1
    assert data["total_eventos"] == 3  # O banco tem 3 eventos no total
    assert len(data["dados"]) == 2     # O array retornado só pode conter 2

def test_listar_eventos_filtros(client):
    """Garante que os filtros de busca por texto e categoria funcionam no Feed."""

    user_body = {"name": "Divulgador", "email": "divulga@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    eventos = [
        {"title": "Palestra de Inteligência Artificial", "start_date": "2026-09-01T14:00:00", "duration": 120, "local": "Auditório Principal", "category_id": 4},
        {"title": "Festa Haloween", "start_date": "2026-09-05T22:00:00", "duration": 300, "local": "Vão da FFLCH", "category_id": 1},
        {"title": "Treino de Futebol", "start_date": "2026-09-10T09:00:00", "duration": 180, "local": "CEPEUSP", "category_id": 2}
    ]
    for ev in eventos:
        client.post("/eventos/", json=ev, headers=headers)

    # Testes se o usuário pesquisar por "Festa"
    resp_busca = client.get("/eventos/?busca=Festa")
    assert resp_busca.status_code == 200
    assert resp_busca.json()["total_eventos"] == 1
    assert resp_busca.json()["dados"][0]["title"] == "Festa Haloween"

    # Testes se o usuário pesquisa por "Esportes" (ID 2)
    resp_cat = client.get("/eventos/?category_id=2")
    assert resp_cat.status_code == 200
    assert resp_cat.json()["total_eventos"] == 1
    assert resp_cat.json()["dados"][0]["title"] == "Treino de Futebol"


def test_listar_eventos_pagina_invalida(client):
    """Garante que a API bloqueia páginas zero ou negativas."""
    response = client.get("/eventos/?pagina=0")
    assert response.status_code == 422
    assert "pagina" in response.text


def test_listar_eventos_limite(client):
    """Garante que ninguém trave o banco pedindo milhares de eventos."""
    response = client.get("/eventos/?limite=500")
    
    # FastAPI deve barrar pois o 'le' (less than or equal) é 100
    assert response.status_code == 422
    assert "limite" in response.text

def test_listar_eventos_busca_texto_inexistente(client):
    """Garante que pesquisar por um nome que não existe retorna uma lista vazia."""
    
    # Pesquisar por um evento que sabemos que não está no banco
    response = client.get("/eventos/?busca=festa da pipoca")
    data = response.json()

    # Status 200, zero eventos e array vazio
    assert response.status_code == 200
    assert data["total_eventos"] == 0
    assert data["dados"] == []

def test_listar_eventos_categoria_vazia(client):
    """Garante que filtrar por uma categoria que (ainda) não tem eventos retorna lista vazia."""
    
    # Buscar por um ID de categoria (ex: 8) que sabemos que não tem eventos criados nos testes
    response = client.get("/eventos/?category_id=8")
    data = response.json()

    # VALIDAÇÃO
    assert response.status_code == 200
    assert data["total_eventos"] == 0
    assert data["dados"] == []