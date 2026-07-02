import pytest
from sqlmodel import Session, select
from app.models import Event

def test_listar_eventos_seguindo(client):
    """Garante que o usuário vê os eventos de quem ele segue, mas não vê de quem não segue."""
    
    # Criar 3 perfis diferentes
    
    # Perfil A: O Amigo (Vamos segui-lo)
    amigo_body = {"name": "Amigo", "email": "amigo@teste.com", "password": "123"}
    resp_amigo = client.post("/auth/signup", json=amigo_body)
    id_amigo = resp_amigo.json()["id"]
    token_amigo = client.post("/auth/login", json=amigo_body).json()["access_token"]

    # Perfil B: O Desconhecido (não vamos segui-lo)
    desc_body = {"name": "Desconhecido", "email": "desc@teste.com", "password": "123"}
    client.post("/auth/signup", json=desc_body)
    token_desc = client.post("/auth/login", json=desc_body).json()["access_token"]

    # Nosso Perfil Logado
    eu_body = {"name": "Eu", "email": "eu@teste.com", "password": "123"}
    client.post("/auth/signup", json=eu_body)
    token_eu = client.post("/auth/login", json=eu_body).json()["access_token"]
    headers_eu = {"Authorization": f"Bearer {token_eu}"}

    # O Amigo e o Desconhecido criam 1 evento cada
    client.post("/eventos/", json={"title": "Festa do Amigo", "start_date": "2026-10-10T10:00:00", "duration": 120, "local": "Lugar A", "category_id": 1}, headers={"Authorization": f"Bearer {token_amigo}"})
    client.post("/eventos/", json={"title": "Palestra do Desconhecido", "start_date": "2026-10-11T10:00:00", "duration": 120, "local": "Lugar B", "category_id": 4}, headers={"Authorization": f"Bearer {token_desc}"})

    # Nosso perfil segue o Amigo usando a rota de usuários
    client.post(f"/usuarios/{id_amigo}/seguir", headers=headers_eu)

    # Buscar o feed de quem eu sigo
    response = client.get("/eventos/seguindo", headers=headers_eu)
    data = response.json()

    # VALIDAÇÃO
    assert response.status_code == 200
    assert len(data["dados"]) == 1
    # O único evento na lista tem que ser o do Amigo
    assert data["dados"][0]["title"] == "Festa do Amigo"


def test_listar_eventos_seguindo_vazio(client):
    """Garante que se eu não sigo ninguém, o feed é vazio."""
    
    # Criar e logar com um usuário isolado
    lobo_body = {"name": "Lobo Solitario", "email": "lobo@teste.com", "password": "123"}
    client.post("/auth/signup", json=lobo_body)
    token_lobo = client.post("/auth/login", json=lobo_body).json()["access_token"]
    
    # Buscar o feed sem ter seguido ninguém
    response = client.get("/eventos/seguindo", headers={"Authorization": f"Bearer {token_lobo}"})
    data = response.json()

    assert response.status_code == 200
    assert data["dados"] == []


def test_listar_eventos_seguindo_sem_autenticacao(client):
    """Garante que quem não possui autentificação não acesse a rota."""
    
    # Tentar bater na rota sem enviar os headers de autenticação
    response = client.get("/eventos/seguindo")
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

def test_listar_eventos_busca_parcial(client):
    """Garante que a busca funciona enviando apenas um pedaço do nome do evento."""
    
    user_body = {"name": "Eu", "email": "eu@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Criar dois eventos: um com "Junina" no nome e outro sem
    client.post("/eventos/", json={"title": "Festa Junina da FAU", "start_date": "2027-06-25T19:00:00", "duration": 300, "local": "Pátio", "category_id": 1}, headers=headers)
    client.post("/eventos/", json={"title": "Arraiá da Bio", "start_date": "2027-06-26T19:00:00", "duration": 300, "local": "Pátio", "category_id": 1}, headers=headers)

    # O usuário pesquisa apenas por "Junina"
    response = client.get("/eventos/?busca=Junina")
    data = response.json()

    # 3. VALIDAÇÃO
    assert response.status_code == 200
    assert data["total_eventos"] == 1  # Só deve achar 1 evento
    assert data["dados"][0]["title"] == "Festa Junina da FAU"

def test_listar_eventos_busca_combinada(client):
    """Garante que a combinação de busca de texto com categoria cruza os filtros (AND)."""
    
    user_body = {"name": "Lucas Aura", "email": "aura@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/eventos/", json={"title": "Festa Junina", "start_date": "2027-06-25T19:00:00", "duration": 300, "local": "Faculdade de Arquitetura e Urbanismo", "category_id": 1}, headers=headers)
    client.post("/eventos/", json={"title": "Festa Halloween", "start_date": "2027-10-31T20:00:00", "duration": 300, "local": "Vão da FFLCH", "category_id": 1}, headers=headers)
    client.post("/eventos/", json={"title": "Treino pré Festa Junina", "start_date": "2027-06-20T10:00:00", "duration": 120, "local": "CEPEUSP", "category_id": 2}, headers=headers)

    # Buscar combinando os filtros (busca + category_id)
    response = client.get("/eventos/?busca=Junina&category_id=1")
    data = response.json()

    assert response.status_code == 200
    assert data["total_eventos"] == 1  # Deve ignorar a Festa Halloween (pois não tem Junina no nome) e o Treino (pq não é uma PARTY category=1)
    assert len(data["dados"]) == 1
    assert data["dados"][0]["title"] == "Festa Junina"
    assert data["dados"][0]["category_id"] == 1