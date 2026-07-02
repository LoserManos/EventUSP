import pytest
from sqlmodel import Session, select
from app.models import Event

def test_editar_evento_com_sucesso(client):
    """Garante que o dono do evento consegue alterar os dados permitidos."""
    
    user_body = {"name": "Dono do Evento", "email": "dono@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_original = {
        "title": "Festa da Computação - Versão Antiga",
        "start_date": "2026-11-20T22:00:00",
        "duration": 240,
        "local": "Local Antigo",
        "category_id": 1
    }
    resp_criacao = client.post("/eventos/", json=evento_original, headers=headers)
    evento_id = resp_criacao.json()["evento_id"]

    dados_atualizados = {
        "title": "Festa da Computação - O Retorno",
        "local": "Novo Local Maior"
    }
    response = client.patch(f"/eventos/{evento_id}", json=dados_atualizados, headers=headers)
    data = response.json()

    # O status deve ser 200 e os dados devem ter mudado
    assert response.status_code == 200
    assert data["title"] == "Festa da Computação - O Retorno"
    assert data["local"] == "Novo Local Maior"
    # A duração, que não foi enviada no PATCH, deve continuar intacta
    assert data["duration"] == 240 


def test_editar_evento_de_outro_usuario(client):
    """Garante que a API bloqueia a edição (Erro 403) se o evento for de outra pessoa."""
    
    vitima_body = {"name": "Bom de Guerra", "email": "kratos@teste.com", "password": "123"}
    client.post("/auth/signup", json=vitima_body)
    token_vitima = client.post("/auth/login", json=vitima_body).json()["access_token"]
    
    evento_body = {
        "title": "Meu Evento Intocável",
        "start_date": "2026-12-01T10:00:00",
        "duration": 120,
        "local": "Minha Sala",
        "category_id": 3
    }
    resp_criacao = client.post("/eventos/", json=evento_body, headers={"Authorization": f"Bearer {token_vitima}"})
    evento_id = resp_criacao.json()["evento_id"]

    # Usuário B (Invasor) faz login
    invasor_body = {"name": "Invasor", "email": "invasor@teste.com", "password": "123"}
    client.post("/auth/signup", json=invasor_body)
    token_invasor = client.post("/auth/login", json=invasor_body).json()["access_token"]
    headers_invasor = {"Authorization": f"Bearer {token_invasor}"}

    # O Invasor tenta alterar o título do evento da Vítima
    response = client.patch(f"/eventos/{evento_id}", json={"title": "Evento Hackeado!"}, headers=headers_invasor)

    # FastAPI deve barrar com Forbidden (403)
    assert response.status_code == 403
    assert response.json()["detail"] == "Você não tem permissão para editar este evento."


def test_editar_evento_inexistente(client):
    """Garante que tentar editar um evento que não existe retorna Erro 404."""
    
    user_body = {"name": "Testador Patch", "email": "patch@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    
    response = client.patch("/eventos/9999", json={"title": "Novo Título"}, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404

def test_editar_evento_tentando_injetar_likes(client):
    """Garante que o dono não consegue fraudar o número de curtidas via PATCH."""
    
    user_body = {"name": "Trapaceiro", "email": "trapaca@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_body = {
        "title": "Festa Vazia",
        "start_date": "2026-11-20T22:00:00",
        "duration": 240,
        "local": "Salão",
        "category_id": 1
    }
    evento_id = client.post("/eventos/", json=evento_body, headers=headers).json()["evento_id"]

    dados_maliciosos = {
        "title": "Festa Vazia (Mas com título novo)",
        "likes": 5000
    }
    response = client.patch(f"/eventos/{evento_id}", json=dados_maliciosos, headers=headers)
    data = response.json()

    # O título muda, mas os likes continuam intactos (devem ser ignorados)
    assert response.status_code == 200
    assert data["title"] == "Festa Vazia (Mas com título novo)"
    assert data["likes"] == 0  

def test_editar_evento_com_strings_vazias(client):
    """Garante que a API bloqueia alteração de título ou local para strings só de espaços."""
    
    user_body = {"name": "Editor Espaço", "email": "espaco@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_body = {"title": "Palestra Valida", "start_date": "2026-09-15T14:00:00", "duration": 60, "local": "Auditório", "category_id": 4}
    evento_id = client.post("/eventos/", json=evento_body, headers=headers).json()["evento_id"]

    # Tentar atualizar o título apenas com espaços em branco
    response = client.patch(f"/eventos/{evento_id}", json={"title": "     "}, headers=headers)
    
    # Deve retornar 422
    assert response.status_code == 422
    assert "title" in response.text


def test_editar_evento_duracao_negativa(client):
    """Garante que a API bloqueia alteração de duração para valores menores ou iguais a zero."""
    
    user_body = {"name": "Editor Tempo", "email": "tempo_edit@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_body = {"title": "Workshop", "start_date": "2026-09-15T14:00:00", "duration": 60, "local": "Sala 1", "category_id": 3}
    evento_id = client.post("/eventos/", json=evento_body, headers=headers).json()["evento_id"]

    # Tentar colocar duração negativa
    response = client.patch(f"/eventos/{evento_id}", json={"duration": -10}, headers=headers)
    
    assert response.status_code == 422
    assert "duration" in response.text


def test_editar_evento_data_passada(client):
    """Garante que a API bloqueia alteração de data para uma data que já passou."""
    
    user_body = {"name": "Editor Passado", "email": "passado@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_body = {"title": "Congresso", "start_date": "2026-09-15T14:00:00", "duration": 60, "local": "Anfiteatro", "category_id": 5}
    evento_id = client.post("/eventos/", json=evento_body, headers=headers).json()["evento_id"]

    # Tentar alterar a data para o ano de 2021
    response = client.patch(f"/eventos/{evento_id}", json={"start_date": "2021-01-01T00:00:00"}, headers=headers)
    
    assert response.status_code == 422
    assert "start_date" in response.text