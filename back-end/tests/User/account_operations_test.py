import pytest
from sqlmodel import Session,select
from app.models import User
import os
import shutil
import pytest

## cenario 1: visualizar  perfil de usuário com token de autenticação
def test_get_profile(auth_client):
    response = auth_client.get("/usuarios/me")
    dtreponse = response.json()
    assert response.status_code == 200
    assert dtreponse["email"] == "test@example.com"
    assert dtreponse["name"] == "Test User"
## cenario 2: visualizar  perfil de usuário sem token de autenticação
def test_get_profile_no_token(client):
    response = client.get("/usuarios/me")
    assert response.status_code == 401

## cenario 3: editar meu perfil de usuário com token de autenticação
def test_get_profile(auth_client):
    body = {"name": "novo nome", "bio":"nova bio"}
    response = auth_client.post("/usuarios/me",body)
    dtreponse = response.json()
    assert response.status_code == 200
    assert dtreponse["name"] == "novo nome"
    assert dtreponse["name"] == "nova bio"
## cenario 4: editar meu perfil de usuário com token de autenticação, porém, campo não permitido
def test_get_profile_foribidden(auth_client):
    body = {"email": "novo@gmail.com", "bio":"nova bio"}
    response = auth_client.post("/usuarios/me",body)
    assert response.status_code == 422

## cenario 5: editar meu perfil de usuário sem token de autenticação
def test_get_profile(client):
    body = {"name": "novo nome", "bio":"nova bio"}
    response = client.patch("/usuarios/me",body)
    assert response.status_code == 401


## cenario 7: upload em foto de perfil com sucesso
def test_upload_user_photo_com_sucesso(auth_client):
    file_name = "foto_teste.jpg"
    file_content = b"conteudo_da_imagem_fake"
    files = {
        "file": (file_name, file_content, "image/jpeg")
    }
    
    response = auth_client.post("/me/foto", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["mensagem"] == "Foto atualizada com sucesso."
    assert "static/defaults/user_" in data["picture_profile"]
    db_path = data["picture_profile"]
    full_saved_path = f"app/{db_path}" 
    
    if os.path.exists(full_saved_path):
        os.remove(full_saved_path)

## cenario 8: visualizar perfil de outro usuário existente
def test_get_profile(auth_client,db_session):
    user = User(name="otavio", email="ot@example.com", password="hash_da_senha")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    res = auth_client.get(f"/usuarios/{user.id}")
    dtres = res.json()
    assert res.status_code == 200
    assert dtres["name"] == user.name
    assert dtres["email"] == user.email
    assert dtres["id"] == user.id
    assert dtres["picture_profile"] == user.picture_profile

## cenario 9: tenta visualizar o perfil de um usuário que não existe no sistema
def test_get_profile_no_user(auth_client):
    res = auth_client.get(f"/usuarios/{-2}")
    assert res.status_code == 404


## cenario 9: seguir usuário existente
def test_follow_user(auth_client,db_session):
    user = User(name="otavio", email="ot@example.com", password="hash_da_senha")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    res = auth_client.post(f"/usuarios/{user.id}/seguir")
    dtres = res.json()
    assert res.status_code == 200
    assert dtres["seguindo_id"] == user.id


## cenario 10: seguir própria conta, deve retornar erro
def test_follow_myself(auth_client):
    res = auth_client.get("/usuarios/me")
    dtres = res.json()
    assert dtres["id"] is not None
    res = auth_client.post(f"/usuarios/{dtres["id"]}/seguir")    
    assert res.status_code == 400


## cenario 11: seguir  conta que já está seguindo
def test_follow_already_follow(auth_client,db_session):
    user = User(name="otavio", email="ot@example.com", password="hash_da_senha")
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    auth_client.post(f"/usuarios/{user.id}/seguir")
    res = auth_client.post(f"/usuarios/{user.id}/seguir")
    dtres =  res.json()
    assert res.status_code == 200
    assert dtres["mensagem"] == "Você já segue este usuário"

## cenário 12: seguir conta que não existe
def test_follow_nobody(auth_client,client,db_session):

    res = auth_client.post(f"/usuarios/{-2}/seguir")
    dtres =  res.json()
    assert res.status_code == 200
    assert dtres["mensagem"] == "Você já segue este usuário"

def test_listar_usuarios(client):
    """Garante que a listagem padrão retorna todos os usuários com a paginação correta."""
    
    # 1. PREPARAÇÃO: Criar 3 usuários no banco (o primeiro já nos dá o token)
    user_logado = {"name": "Admin", "email": "admin@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/auth/signup", json={"name": "Leonardo_Cesar", "email": "leo@teste.com", "password": "123"})
    client.post("/auth/signup", json={"name": "Otavio", "email": "otavio@teste.com", "password": "123"})

    # 2. AÇÃO: Bater na rota sem passar nenhum filtro (deve assumir page=1, limit=20)
    response = client.get("/usuarios/", headers=headers)
    data = response.json()

    # 3. VALIDAÇÃO: Status 200 e estrutura de paginação
    assert response.status_code == 200
    assert data["current_page"] == 1
    assert data["limit"] == 20
    assert data["total_records"] >= 3  # Pelo menos os 3 que acabamos de criar
    assert "data" in data


def test_listar_usuarios_com_busca(client):
    """Garante que o filtro 'search' funciona usando ilike (ignorando maiúsculas/minúsculas)."""
    
    user_logado = {"name": "Buscador", "email": "busca@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    client.post("/auth/signup", json={"name": "Leonardo_Cesar", "email": "leo_alvo@teste.com", "password": "123"})
    
    # Buscar por um pedaço do nome em minúsculo
    response = client.get("/usuarios/?search=cesar", headers=headers)
    data = response.json()

    # Deve encontrar o Leonardo_Cesar
    assert response.status_code == 200
    # Como o banco de testes é limpo a cada rodada (ou deve ser), garantimos que achou alguém
    assert len(data["data"]) >= 1 
    nomes_encontrados = [user["name"] for user in data["data"]]
    assert any("Leonardo_Cesar" in nome for nome in nomes_encontrados)


def test_listar_usuarios_paginacao_personalizada(client):
    """Garante que os parâmetros limit e page alteram a devolução dos dados."""
    
    user_logado = {"name": "Testador", "email": "pag@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    
    # Pedir a página 1, mas limitando a apenas 1 resultado por página
    response = client.get("/usuarios/?page=1&limit=1", headers={"Authorization": f"Bearer {token}"})
    data = response.json()

    assert response.status_code == 200
    assert data["limit"] == 1
    assert len(data["data"]) == 1
    assert data["total_pages"] == data["total_records"] # Se o limite é 1, total_pages = total_records


def test_listar_usuarios_erros_de_validacao(client):
    """Garante que a API não aceita páginas inválidas ou limites abusivos."""
    
    user_logado = {"name": "Hacker Limite", "email": "limite@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_logado)
    token = client.post("/auth/login", json=user_logado).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Página zero ou negativa
    resp_page = client.get("/usuarios/?page=0", headers=headers)
    assert resp_page.status_code == 422

    # Tentativa 2: Pedir 500 usuários de uma vez (burlar o le=100)
    resp_limit = client.get("/usuarios/?limit=500", headers=headers)
    assert resp_limit.status_code == 422


def test_listar_usuarios_sem_autenticacao(client):
    """Proteção básica da rota."""
    response = client.get("/usuarios/")
    assert response.status_code == 401

def test_listar_usuarios_busca_sem_resultados(client):
    """Garante que buscar por um termo inexistente retorna status 200 com lista vazia."""
    
    user_logado = {"name": "Validador", "email": "valida_vazio@teste.com", "password": "123"}
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




