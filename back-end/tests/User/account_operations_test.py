import pytest
from sqlmodel import Session, select
from app.models import User
import os
import shutil

## cenario 1: visualizar perfil de usuário com token de autenticação
def test_get_profile(auth_client):
    response = auth_client.get("/usuarios/me")
    dtreponse = response.json()
    assert response.status_code == 200
    assert dtreponse["email"] == "test@example.com"
    assert "nickname" in dtreponse

## cenario 2: visualizar perfil de usuário sem token de autenticação
def test_get_profile_no_token(client):
    response = client.get("/usuarios/me")
    assert response.status_code == 401

## cenario 3: editar meu perfil de usuário (PATCH correto)
def test_update_profile(auth_client):
    body = {"name": "novo nome", "bio": "nova bio"}
    response = auth_client.patch("/usuarios/me", json=body)
    dtreponse = response.json()
    assert response.status_code == 200
    assert dtreponse["name"] == "novo nome"
    assert dtreponse["bio"] == "nova bio"

## cenario 4: editar perfil com campo não existente
def test_update_profile_forbidden(auth_client):
    body = {"email": "novo@gmail.com", "bio": "nova bio","tokeasasn":"sjaikhsa"}
    response = auth_client.patch("/usuarios/me", json=body)
    assert response.status_code == 422

## cenario 5: editar perfil sem token
def test_update_profile_no_token(client):
    body = {"name": "novo nome", "bio": "nova bio"}
    response = client.patch("/usuarios/me", json=body)
    assert response.status_code == 401

## cenario 7: upload em foto de perfil com sucesso
def test_upload_user_photo_com_sucesso(auth_client):
    file_name = "foto_teste.jpg"
    file_content = b"conteudo_da_imagem_fake"
    files = {"file": (file_name, file_content, "image/jpeg")}
    
    response = auth_client.post("/usuarios/me/foto", files=files) 
    assert response.status_code == 200
    data = response.json()
    assert "picture_profile" in data
    
    db_path = data["picture_profile"]
    full_saved_path = f"app/{db_path}" 
    if os.path.exists(full_saved_path):
        os.remove(full_saved_path)

## cenario 8: visualizar perfil de outro usuário (pelo ID)
def test_get_other_profile(auth_client, db_session):
    user = User(name="otavio", nickname="otavio_nick", email="ot@example.com", password="hash")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    res = auth_client.get(f"/usuarios/{user.id}")
    dtres = res.json()
    assert res.status_code == 200
    assert dtres["nickname"] == "otavio_nick"

## cenario 9: seguir usuário existente (com nickname ou ID)
def test_follow_user(auth_client, db_session):
    user = User(name="otavio", nickname="otavio_nick", email="ot@example.com", password="hash")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    
    res = auth_client.post(f"/usuarios/{user.id}/seguir")
    assert res.status_code == 200

## cenario 10: seguir própria conta
def test_follow_myself(auth_client):
    res = auth_client.get("/usuarios/me")
    my_id = res.json()["id"]
    res = auth_client.post(f"/usuarios/{my_id}/seguir")    
    assert res.status_code == 400

## cenario 11: seguir conta que já segue
def test_follow_already_follow(auth_client, db_session):
    user = User(name="otavio", nickname="otavio_nick", email="ot@example.com", password="hash")
    db_session.add(user)
    db_session.commit()
    auth_client.post(f"/usuarios/{user.id}/seguir")
    res = auth_client.post(f"/usuarios/{user.id}/seguir")
    assert res.status_code == 200
    assert res.json()["mensagem"] == "Você já segue este usuário."

## cenário 12: seguir conta que não existe
def test_follow_nobody(auth_client):
    res = auth_client.post(f"/usuarios/{-2}/seguir")
    dtres =  res.json()
    assert res.status_code == 400
    assert dtres["detail"] == "Não é possível seguir um usuário inexistente."

## cenario 13: editar perfil com espaços
def test_edit_profile_blank_spaces(client):
    user_body = {"name": "Editor", "nickname": "editor_nick", "email": "editor@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "editor@teste.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    body = {"name": "   ", "bio": "   "}
    response = client.patch("/usuarios/me", json=body, headers=headers)
    assert response.status_code == 422

def test_list_users(client,auth_client):
    """Garante que a listagem padrão retorna todos os usuários com a paginação correta."""
    
    client.post("/auth/signup", json={"name": "Leonardo_Cesar","nickname":"for", "email": "leo@teste.com", "password": "123"})
    client.post("/auth/signup", json={"name": "Otavio","nickname":"uyou" , "email":"otavio@teste.com", "password": "123"})

    # 2. AÇÃO: Bater na rota sem passar nenhum filtro (deve assumir page=1, limit=20)
    response = auth_client.get("/usuarios/")
    data = response.json()

    # 3. VALIDAÇÃO: Status 200 e estrutura de paginação
    assert response.status_code == 200
    assert data["current_page"] == 1
    assert data["limit"] == 20
    assert data["total_records"] >= 3  # Pelo menos os 3 que acabamos de criar
    assert "data" in data


def test_list_users_with_filter(client):
    """Garante que o filtro 'search' funciona usando ilike no nickname (ignorando maiúsculas/minúsculas)."""
    
    user_logado = {"name": "Buscador", "nickname":"sas","email": "busca@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/auth/signup", json={"name": "Leonardo_Cesar","nickname":"leocesar", "email": "leo_alvo@teste.com", "password": "123"})
    
    # Buscar por um pedaço do nome em minúsculo
    response = client.get("/usuarios/?search=cesar", headers=headers)
    data = response.json()

    # Deve encontrar o usuário pelo nickname
    assert response.status_code == 200
    # Como o banco de testes é limpo a cada rodada (ou deve ser), garantimos que achou alguém
    assert len(data["data"]) >= 1 
    nicknames_found = [user["nickname"] for user in data["data"]]
    assert any("leocesar" in nick for nick in nicknames_found)


def test_list_users_custom_pagination(client):
    """Garante que os parâmetros limit e page alteram a devolução dos dados."""
    
    user_logado = {"name": "Testador","nickname":"sasa", "email": "pag@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    
    # Pedir a página 1, mas limitando a apenas 1 resultado por página
    response = client.get("/usuarios/?page=1&limit=1", headers={"Authorization": f"Bearer {token}"})
    data = response.json()

    assert response.status_code == 200
    assert data["limit"] == 1
    assert len(data["data"]) == 1
    assert data["total_pages"] == data["total_records"] # Se o limite é 1, total_pages = total_records


def test_list_users_validation_error(client):
    """Garante que a API não aceita páginas inválidas ou limites abusivos."""
    
    user_logado = {"name": "Hacker Limite", "nickname":"sasa","email": "limite@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Página zero ou negativa
    resp_page = client.get("/usuarios/?page=0", headers=headers)
    assert resp_page.status_code == 422

    # Tentativa 2: Pedir 500 usuários de uma vez (burlar o le=100)
    resp_limit = client.get("/usuarios/?limit=500", headers=headers)
    assert resp_limit.status_code == 422


def test_list_users_no_autentfication(client):
    """Proteção básica da rota."""
    response = client.get("/usuarios/")
    assert response.status_code == 401

def test_list_users_no_result(client):
    """Garante que buscar por um termo inexistente retorna status 200 com lista vazia."""
    
    user_logado = {"name": "Validador", "nickname":"sasa","email": "valida_vazio@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Buscar por uma string que sabemos que não bate com nenhum usuário criado
    response = client.get("/usuarios/?search=XYZ_NinguemTemEsseNome_ZYX", headers=headers)
    data = response.json()

    # 3. A API deve processar com sucesso, mas entregar uma página vazia
    assert response.status_code == 200
    assert data["total_records"] == 0
    assert data["total_pages"] == 0
    assert data["data"] == []  # Garante que o array de usuários veio totalmente vazio




