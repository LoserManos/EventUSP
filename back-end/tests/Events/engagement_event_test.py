import pytest
from sqlmodel import Session, select
from app.models import Event, Interests

# Cenario 1: Curtir um evento com sucesso
def test_like_event_success(client):
    """Garante que um usuário consegue curtir um evento pela primeira vez e o contador sobe."""
    
    user_body = {"name": "Liker", "nickname": "liker_boy", "email": "liker@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "liker@teste.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Criar um evento alvo
    event_body = {"title": "Festa da Curtida", "start_date": "2027-01-01T20:00:00", "duration": 240, "local": "Salão", "category_id": 1}
    evento_id = client.post("/eventos/", json=event_body, headers=headers).json()["evento_id"]

    # Curtir o evento
    response = client.post(f"/eventos/{evento_id}/curtir", headers=headers)
    data = response.json()

    # Sucesso e mensagem correta
    assert response.status_code == 200
    assert data["mensagem"] == "Evento curtido com sucesso."

    # Verifica se o número de likes do evento realmente subiu para 1
    resp_evento = client.get(f"/eventos/{evento_id}")
    assert resp_evento.json()["likes"] == 1

# Cenario 2: Remover a curtida
def test_unlike_event_success(client):
    """Garante que curtir um evento já curtido remove o like e diminui o contador."""
    
    user_body = {"name": "Unliker", "nickname": "unliker_boy", "email": "unliker@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "unliker@teste.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    event_body = {"title": "Festa do Deslike", "start_date": "2027-01-01T20:00:00", "duration": 240, "local": "Salão", "category_id": 1}
    evento_id = client.post("/eventos/", json=event_body, headers=headers).json()["evento_id"]

    # Curte pela primeira vez
    client.post(f"/eventos/{evento_id}/curtir", headers=headers)

    # Bate na mesma rota de novo para "descurtir"
    response = client.post(f"/eventos/{evento_id}/curtir", headers=headers)
    data = response.json()

    assert response.status_code == 200
    assert data["mensagem"] == "Curtida removida."

    # Verifica se o número de likes voltou para 0
    resp_evento = client.get(f"/eventos/{evento_id}")
    assert resp_evento.json()["likes"] == 0

# Cenario 3: Tentar curtir um evento que não existe (Erro 404)
def test_like_nonexistent_event(client):
    """Garante que o banco não quebra ao tentar curtir um ID de evento falso."""
    
    user_body = {"name": "Ghost", "nickname": "ghost_liker", "email": "ghost@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "ghost@teste.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Passamos um ID que sabemos que não existe (9999)
    response = client.post("/eventos/9999/curtir", headers=headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Evento não encontrado."


# Cenario 4: Tentar curtir sem estar logado (Erro 401)
def test_like_event_unauthorized(client):
    """Garante que anônimos não conseguem injetar curtidas no sistema."""
    
    # Tentativa de curtir sem enviar os headers com o token de autenticação
    response = client.post("/eventos/1/curtir")

    # FastAPI barra direto na entrada
    assert response.status_code == 401

# Cenario 5: Demonstrar interesse num evento com sucesso (Validando no Banco)
def test_interest_event_success(client, db_session):
    """Garante que a rota cria corretamente a relação na tabela Interests (ocupa a vaga)."""
    
    user_body = {"name": "Interessado", "nickname": "interessado_boy", "email": "interessado@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    
    # Pegamos o token e também o ID do usuário para checar no banco depois
    login_data = client.post("/auth/login", json={"email": "interessado@teste.com", "password": "123"}).json()
    token = login_data["access_token"]
    user_id = login_data["id_user"]
    headers = {"Authorization": f"Bearer {token}"}

    event_body = {"title": "Workshop de Python", "start_date": "2027-02-01T10:00:00", "duration": 120, "local": "Laboratório", "category_id": 3}
    evento_id = client.post("/eventos/", json=event_body, headers=headers).json()["evento_id"]

    # Demonstrar interesse
    response = client.post(f"/eventos/{evento_id}/interesse", headers=headers)
    
    # Valida resposta da API
    assert response.status_code == 200
    assert response.json()["mensagem"] == "Interesse registrado com sucesso!"

    # Verifica se a "vaga" foi ocupada no banco de dados
    statement = select(Interests).where(Interests.user_id == user_id, Interests.event_id == evento_id)
    interesse_salvo = db_session.exec(statement).first()
    
    assert interesse_salvo is not None # Se não for None, a vaga foi registrada!


# Cenario 6: Remover o interesse 
def test_remove_interest_success(client, db_session):
    """Garante que a rota deleta a relação na tabela Interests (libera a vaga)."""
    
    user_body = {"name": "Desistente", "nickname": "desistente_boy", "email": "desistente@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    
    login_data = client.post("/auth/login", json={"email": "desistente@teste.com", "password": "123"}).json()
    token = login_data["access_token"]
    user_id = login_data["id_user"]
    headers = {"Authorization": f"Bearer {token}"}

    event_body = {"title": "Palestra Lotada", "start_date": "2027-02-01T10:00:00", "duration": 120, "local": "Auditório", "category_id": 4}
    evento_id = client.post("/eventos/", json=event_body, headers=headers).json()["evento_id"]

    # Registra interesse e ocupa a vaga
    client.post(f"/eventos/{evento_id}/interesse", headers=headers)

    # Bate na mesma rota para remover o interesse
    response = client.post(f"/eventos/{evento_id}/interesse", headers=headers)

    # Validações da API
    assert response.status_code == 200
    assert response.json()["mensagem"] == "Interesse removido. Vaga liberada."

    # Vai no banco checar se a vaga sumiu mesmo
    statement = select(Interests).where(Interests.user_id == user_id, Interests.event_id == evento_id)
    interesse_salvo = db_session.exec(statement).first()
    
    assert interesse_salvo is None # Se é None, a relação foi apagada e a vaga está livre!


# Cenario 7: Tentar demonstrar interesse num evento inexistente
def test_interest_nonexistent_event(client):
    """Garante erro 404 ao tentar demonstrar interesse num ID de evento falso."""
    
    user_body = {"name": "Viajante", "nickname": "viajante_nick", "email": "viajante@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "viajante@teste.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/eventos/9999/interesse", headers=headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Evento não encontrado."


# Cenario 8: Tentar demonstrar interesse sem estar autenticado
def test_interest_event_unauthorized(client):
    """Garante que anonimos não conseguem interagir com as vagas dos eventos."""
    
    response = client.post("/eventos/1/interesse")
    
    assert response.status_code == 401

# Cenario 9: Comentar em um evento com sucesso
def test_add_comment_success(client):
    """Garante que um usuário logado consegue adicionar um comentário no evento."""
    
    user_body = {"name": "Comentarista", "nickname": "comentador", "email": "comenta@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "comenta@teste.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    event_body = {"title": "Roda de Conversa", "start_date": "2027-03-01T10:00:00", "duration": 60, "local": "Sala 1", "category_id": 5}
    evento_id = client.post("/eventos/", json=event_body, headers=headers).json()["evento_id"]

    # Enviar o comentário
    response = client.post(f"/eventos/{evento_id}/comentarios", json={"content": "Muito legal!"}, headers=headers)
    
    assert response.status_code == 201
    assert response.json()["mensagem"] == "Comentário adicionado."


# Cenário 10: Tentar comentar em um evento inexistente 
def test_add_comment_nonexistent_event(client):
    """Garante erro 404 ao tentar comentar em um evento que não existe."""
    
    user_body = {"name": "Fantasma", "nickname": "fantasminha", "email": "fantasma@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "fantasma@teste.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/eventos/9999/comentarios", json={"content": "Primeiro!"}, headers=headers)
    
    assert response.status_code == 404
    assert response.json()["detail"] == "Evento não encontrado."


# Cenario 11: Tentar comentar sem estar autenticado
def test_add_comment_unauthorized(client):
    """Garante que apenas usuários logados podem enviar comentários."""
    
    response = client.post("/eventos/1/comentarios", json={"content": "Hacker anonimo!"})
    
    assert response.status_code == 401