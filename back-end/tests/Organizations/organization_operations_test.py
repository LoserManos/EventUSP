import pytest
import os
from sqlmodel import select
from app.models import Organization, MemberOrganization, OrgRole

# Cenario 1: Sucesso Usuário é ADMIN da organização
def test_upload_org_photo_success(client, db_session):
    user_body = {"name": "Chefe", "nickname": "chefinho", "email": "chefe@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "chefe@org.com", "password": "123"}).json()
    token = login_data["access_token"]
    user_id = login_data["id_user"]
    headers = {"Authorization": f"Bearer {token}"}

    org = Organization(name="Tech Club", description="Clube de Tecnologia")
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)

    # Conecta o Usuário à Organização com o cargo de ADMIN
    membership = MemberOrganization(user_id=user_id, organization_id=org.id, role=OrgRole.ADMIN, status=True)
    db_session.add(membership)
    db_session.commit()

    # Faz o upload da imagem
    file_name = "foto_org.jpg"
    file_content = b"conteudo_fake"
    files = {"file": (file_name, file_content, "image/jpeg")}
    
    response = client.post(f"/organizacoes/{org.id}/foto", files=files, headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert "picture_profile" in data
    assert f"org_{org.id}_{file_name}" in data["picture_profile"]

    # Limpeza da imagem gerada
    full_saved_path = f"app/{data['picture_profile']}" 
    if os.path.exists(full_saved_path):
        os.remove(full_saved_path)


# Cenario 2: Usuário é da organização, mas NÃO é admin (Erro 403)
def test_upload_org_photo_forbidden_role(client, db_session):
    user_body = {"name": "Membro", "nickname": "membro_comum", "email": "membro@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "membro@org.com", "password": "123"}).json()
    token = login_data["access_token"]
    user_id = login_data["id_user"]
    headers = {"Authorization": f"Bearer {token}"}

    org = Organization(name="Arte Club", description="Clube de Artes")
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)

    # Cargo de MEMBER em vez de ADMIN
    membership = MemberOrganization(user_id=user_id, organization_id=org.id, role=OrgRole.MEMBER, status=True)
    db_session.add(membership)
    db_session.commit()

    files = {"file": ("foto.jpg", b"fake", "image/jpeg")}
    response = client.post(f"/organizacoes/{org.id}/foto", files=files, headers=headers)

    assert response.status_code == 403
    assert response.json()["detail"] == "Apenas administradores podem alterar a foto da organização."


# Cenario 3: Tentar alterar a foto de uma organização que não existe (Erro 404)
def test_upload_org_photo_not_found(client):
    user_body = {"name": "Hacker", "nickname": "hacker_boy", "email": "hacker@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json={"email": "hacker@org.com", "password": "123"}).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    files = {"file": ("foto.jpg", b"fake", "image/jpeg")}
    response = client.post("/organizacoes/9999/foto", files=files, headers=headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Organização não encontrada."


# Cenario 4: Tentar alterar sem estar autenticado (Erro 401)
def test_upload_org_photo_unauthorized(client):
    files = {"file": ("foto.jpg", b"fake", "image/jpeg")}
    # Requisição SEM o headers (sem token)
    response = client.post("/organizacoes/1/foto", files=files)

    assert response.status_code == 401