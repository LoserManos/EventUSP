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

    org = Organization(name="Tech Club", description="Clube de Tecnologia", creator_id=user_id)
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

    org = Organization(name="Arte Club", description="Clube de Artes", creator_id=user_id)
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

# Cenário 5: Usuário cria uma organização corretamente
def test_create_organization_success(client, db_session):
    """Garante que o criador da organização é automaticamente definido como ADMIN."""
    user_body = {"name": "Fundador", "nickname": "fundador_nick", "email": "fundador@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    
    login_data = client.post("/auth/login", json={"email": "fundador@org.com", "password": "123"}).json()
    token = login_data["access_token"]
    user_id = login_data["id_user"]
    headers = {"Authorization": f"Bearer {token}"}

    org_data = {"name": "Clube de Leitura", "description": "Lendo bons livros."}
    
    # Action
    response = client.post("/organizacoes/", json=org_data, headers=headers)
    
    assert response.status_code == 201
    data = response.json()
    assert data["mensagem"] == "Organização criada com sucesso!"
    assert "organizacao_id" in data
    
    # Assertion Banco: Verifica se o vínculo foi criado como ADMIN
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == user_id, 
        MemberOrganization.organization_id == data["organizacao_id"]
    )
    membership = db_session.exec(stmt).first()
    assert membership is not None
    assert membership.role == OrgRole.ADMIN
    assert membership.status is True

# Cenário 6: Usuário anônimo tenta criar uma organização
def test_create_organization_unauthorized(client):
    """Garante que usuários anônimos não podem criar organizações."""
    org_data = {"name": "Clube Hacker", "description": "Invasão 101."}
    response = client.post("/organizacoes/", json=org_data)
    assert response.status_code == 401

# Cenário 7: ADM de uma organização tenta editá-la
def test_update_organization_success(client, db_session):
    """Garante que um ADMIN pode editar a organização."""
    user_body = {"name": "Admin Edit", "nickname": "admin_edit", "email": "adminedit@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "adminedit@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Nome Antigo", description="Desc Antiga", creator_id=login_data["id_user"])
    db_session.add(org)
    db_session.commit()
    db_session.refresh(org)

    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.ADMIN, status=True)
    db_session.add(membership)
    db_session.commit()

    # Action
    update_data = {"name": "Nome Novo Atualizado"}
    response = client.patch(f"/organizacoes/{org.id}", json=update_data, headers=headers)

    assert response.status_code == 200
    assert response.json()["name"] == "Nome Novo Atualizado"
    assert response.json()["description"] == "Desc Antiga" # Garante que o outro campo não foi apagado

# Cenário 8: Membro comum tenta editar a organização
def test_update_organization_forbidden(client, db_session):
    """Garante que um membro comum (MEMBER) recebe erro 403 ao tentar editar a organização."""
    user_body = {"name": "Comum", "nickname": "comum_edit", "email": "comumedit@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "comumedit@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Intocável", description="Membro não edita", creator_id=login_data["id_user"])
    db_session.add(org)
    db_session.commit()

    # Cargo MEMBER (não ADMIN)
    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.MEMBER, status=True)
    db_session.add(membership)
    db_session.commit()

    update_data = {"name": "Tentando Hackear"}
    response = client.patch(f"/organizacoes/{org.id}", json=update_data, headers=headers)

    assert response.status_code == 403
    assert response.json()["detail"] == "Apenas administradores podem editar a organização."

# Cenário 9: ADM da organização tenta deletá-la
def test_delete_organization_success(client, db_session):
    """Garante que um ADMIN pode deletar a organização."""
    user_body = {"name": "Destruidor", "nickname": "destruidor_nick", "email": "del@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "del@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Alvo", description="Para ser deletada", creator_id=login_data["id_user"])
    db_session.add(org)
    db_session.commit()

    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.ADMIN, status=True)
    db_session.add(membership)
    db_session.commit()

    response = client.delete(f"/organizacoes/{org.id}", headers=headers)
    assert response.status_code == 204

    # Verifica no banco se apagou mesmo
    org_deletada = db_session.get(Organization, org.id)
    assert org_deletada is None

# Cenário 10: Usuário que não é um ADM tenta deletar a organização
def test_delete_organization_forbidden(client, db_session):
    """Garante que membros comuns não podem deletar a organização."""
    user_body = {"name": "Comum", "nickname": "comum_del", "email": "comumdel@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "comumdel@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Alvo Seguro", description="Não vai cair", creator_id=login_data["id_user"])
    db_session.add(org)
    db_session.commit()

    # Cargo MEMBER
    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.MEMBER, status=True)
    db_session.add(membership)
    db_session.commit()

    response = client.delete(f"/organizacoes/{org.id}", headers=headers)
    assert response.status_code == 403

# Cenário 11: Usuário envia um pedido para entrar na organização
def test_join_organization_success(client, db_session):
    """Garante que pedir para entrar cria um vínculo com status=False (pendente)."""
    user_body = {"name": "Novato", "nickname": "novato", "email": "novato@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "novato@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Clube Aberto", description="Venha participar", creator_id=login_data["id_user"])
    db_session.add(org)
    db_session.commit()

    response = client.post(f"/organizacoes/{org.id}/entrar", headers=headers)
    
    assert response.status_code == 200
    assert "Aguarde a aprovação" in response.json()["mensagem"]

    # Verifica no banco se entrou como pendente
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == login_data["id_user"], 
        MemberOrganization.organization_id == org.id
    )
    membership = db_session.exec(stmt).first()
    assert membership.status is False
    assert membership.role == OrgRole.MEMBER

# Cenário 11: Usuário que já pediu para entrar na organização tenta mandar outra solicitação
def test_join_organization_already_pending(client, db_session):
    """Garante que não é possível pedir para entrar duas vezes."""
    user_body = {"name": "Ansioso", "nickname": "ansioso", "email": "ansioso@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "ansioso@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Clube Demorado", description="Demora a aprovar", creator_id=login_data["id_user"])
    db_session.add(org)
    db_session.commit()

    # Cria a primeira solicitação pendente
    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.MEMBER, status=False)
    db_session.add(membership)
    db_session.commit()

    # Tenta de novo
    response = client.post(f"/organizacoes/{org.id}/entrar", headers=headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Sua solicitação de entrada já está pendente."

# Cenário 12: Usuário já é membro e tenta enviar convite de entrada
def test_join_organization_already_member(client, db_session):
    """Garante que alguém que já é membro ATIVO não consegue enviar outro convite de entrada."""
    user_body = {"name": "Ja Sou Membro", "nickname": "jasou", "email": "jasou@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "jasou@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Clube Fechado", description="Já estou dentro", creator_id=login_data["id_user"])
    db_session.add(org)
    db_session.commit()

    # Já é membro ativo (status=True)
    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.MEMBER, status=True)
    db_session.add(membership)
    db_session.commit()

    response = client.post(f"/organizacoes/{org.id}/entrar", headers=headers)
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Você já é membro desta organização."

# Cenário 13: Membro comum de uma organização tenta sair dela
def test_leave_organization_success(client, db_session):
    """Garante que um membro comum consegue sair da organização."""
    user_body = {"name": "Saindo", "nickname": "saindo", "email": "saindo@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "saindo@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Clube Chato", description="Vou sair", creator_id=999)
    db_session.add(org)
    db_session.commit()

    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.MEMBER, status=True)
    db_session.add(membership)
    db_session.commit()

    response = client.delete(f"/organizacoes/{org.id}/sair", headers=headers)
    assert response.status_code == 200
    assert response.json()["mensagem"] == "Você saiu da organização com sucesso."

# Cenário 14: O único ADM tenta sair da organização
def test_leave_organization_only_admin_error(client, db_session):
    """Garante a proteção de que o único ADMIN não pode sair da organização."""
    user_body = {"name": "Solitario", "nickname": "solitario", "email": "soli@org.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    login_data = client.post("/auth/login", json={"email": "soli@org.com", "password": "123"}).json()
    headers = {"Authorization": f"Bearer {login_data['access_token']}"}

    org = Organization(name="Meu Clube", description="Só tem eu", creator_id=999)
    db_session.add(org)
    db_session.commit()

    # O usuário é o único ADMIN
    membership = MemberOrganization(user_id=login_data["id_user"], organization_id=org.id, role=OrgRole.ADMIN, status=True)
    db_session.add(membership)
    db_session.commit()

    response = client.delete(f"/organizacoes/{org.id}/sair", headers=headers)
    assert response.status_code == 400
    assert "único administrador" in response.json()["detail"]

# Cebário 15: Criador transfere o status de "dono" para outro ADMIN
def test_transfer_ownership_success(client, db_session):
    """Garante que o criador consegue transferir a propriedade para outro ADMIN."""

    user1_body = {"name": "Fundador", "nickname": "fundador_transf", "email": "dono@org.com", "password": "123"}
    client.post("/auth/signup", json=user1_body)
    token1 = client.post("/auth/login", json={"email": "dono@org.com", "password": "123"}).json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    user2_body = {"name": "Herdeiro", "nickname": "herdeiro", "email": "herdeiro@org.com", "password": "123"}
    client.post("/auth/signup", json=user2_body)
    user2_id = client.post("/auth/login", json={"email": "herdeiro@org.com", "password": "123"}).json()["id_user"]

    # User 1 cria a organização (ele será o creator_id automaticamente)
    org_data = {"name": "Império", "description": "Passando a coroa."}
    org_id = client.post("/organizacoes/", json=org_data, headers=headers1).json()["organizacao_id"]

    # Inserimos o User 2 diretamente no banco como ADMIN para simular uma promoção
    membership = MemberOrganization(user_id=user2_id, organization_id=org_id, role=OrgRole.ADMIN, status=True)
    db_session.add(membership)
    db_session.commit()

    # User 1 transfere para User 2
    response = client.patch(f"/organizacoes/{org_id}/transferir-propriedade/{user2_id}", headers=headers1)

    assert response.status_code == 200
    assert "sucesso" in response.json()["mensagem"]

    # Verifica no banco se o creator_id mudou
    org_atualizada = db_session.get(Organization, org_id)
    assert org_atualizada.creator_id == user2_id

# Cenário 16: Dono da organização tenta transferir seu status para um membro comum
def test_transfer_ownership_not_admin_target(client, db_session):
    """Garante que o novo dono precisa ser ADMIN antes de receber a propriedade."""
    
    user1_body = {"name": "Dono 2", "nickname": "dono2", "email": "dono2@org.com", "password": "123"}
    client.post("/auth/signup", json=user1_body)
    token1 = client.post("/auth/login", json={"email": "dono2@org.com", "password": "123"}).json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    user2_body = {"name": "Iniciante", "nickname": "iniciante", "email": "iniciante@org.com", "password": "123"}
    client.post("/auth/signup", json=user2_body)
    user2_id = client.post("/auth/login", json={"email": "iniciante@org.com", "password": "123"}).json()["id_user"]

    org_data = {"name": "Clube Exigente", "description": "Tem que ser admin."}
    org_id = client.post("/organizacoes/", json=org_data, headers=headers1).json()["organizacao_id"]

    # Insere o User 2 como MEMBER (Não é admin)
    membership = MemberOrganization(user_id=user2_id, organization_id=org_id, role=OrgRole.MEMBER, status=True)
    db_session.add(membership)
    db_session.commit()

    # Tenta transferir
    response = client.patch(f"/organizacoes/{org_id}/transferir-propriedade/{user2_id}", headers=headers1)

    assert response.status_code == 400
    assert response.json()["detail"] == "O novo dono precisa ser promovido a ADMIN antes de receber a propriedade."

# Cenário 17: Um ADMIN que não é o dono tenta transferir o status de dono para outro
def test_transfer_ownership_forbidden(client, db_session):
    """Garante que um ADMIN comum não pode roubar a propriedade e dar para outro."""
    
    user1_body = {"name": "Criador Real", "nickname": "criador_real", "email": "real@org.com", "password": "123"}
    client.post("/auth/signup", json=user1_body)
    token1 = client.post("/auth/login", json={"email": "real@org.com", "password": "123"}).json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    user2_body = {"name": "Admin Falso", "nickname": "admin_falso", "email": "falso@org.com", "password": "123"}
    client.post("/auth/signup", json=user2_body)
    token2 = client.post("/auth/login", json={"email": "falso@org.com", "password": "123"}).json()["access_token"]
    headers2 = {"Authorization": f"Bearer {token2}"}

    user3_body = {"name": "Laranja", "nickname": "laranja", "email": "laranja@org.com", "password": "123"}
    client.post("/auth/signup", json=user3_body)
    user3_id = client.post("/auth/login", json={"email": "laranja@org.com", "password": "123"}).json()["id_user"]

    # User 1 cria a org
    org_data = {"name": "Clube Seguro", "description": "Protegido contra golpes."}
    org_id = client.post("/organizacoes/", json=org_data, headers=headers1).json()["organizacao_id"]

    # Coloca o User 2 e User 3 como ADMINs
    db_session.add(MemberOrganization(user_id=user2_body["nickname"], organization_id=org_id, role=OrgRole.ADMIN, status=True)) # User 2
    db_session.add(MemberOrganization(user_id=user3_id, organization_id=org_id, role=OrgRole.ADMIN, status=True)) # User 3
    db_session.commit()

    # User 2 (Admin, mas não criador) tenta transferir a propriedade para o User 3
    response = client.patch(f"/organizacoes/{org_id}/transferir-propriedade/{user3_id}", headers=headers2)

    assert response.status_code == 403
    assert response.json()["detail"] == "Apenas o criador original pode transferir a propriedade da organização."

# Cenário 18: Dono da organização tenta sair dela
def test_leave_organization_creator_blocked(client, db_session):
    """Garante que o criador não pode usar a rota de sair da organização."""
    
    user1_body = {"name": "Preso", "nickname": "preso", "email": "preso@org.com", "password": "123"}
    client.post("/auth/signup", json=user1_body)
    token1 = client.post("/auth/login", json={"email": "preso@org.com", "password": "123"}).json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # Cria org
    org_data = {"name": "Hotel California", "description": "You can never leave."}
    org_id = client.post("/organizacoes/", json=org_data, headers=headers1).json()["organizacao_id"]

    # Tenta sair
    response = client.delete(f"/organizacoes/{org_id}/sair", headers=headers1)

    assert response.status_code == 400
    assert "transferir a propriedade" in response.json()["detail"]

# Cenário 19: Um ADMIN tenta promover um membro comum a ADMIN
def test_promote_member_success(client, db_session):
    """Garante que um ADMIN pode promover um membro comum a ADMIN."""
    
    user1_body = {"name": "Admin Chefe", "nickname": "admin_chefe", "email": "chefe_promove@org.com", "password": "123"}
    client.post("/auth/signup", json=user1_body)
    token1 = client.post("/auth/login", json={"email": "chefe_promove@org.com", "password": "123"}).json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    user2_body = {"name": "Comum Promovido", "nickname": "comum_promovido", "email": "promovido@org.com", "password": "123"}
    client.post("/auth/signup", json=user2_body)
    user2_id = client.post("/auth/login", json={"email": "promovido@org.com", "password": "123"}).json()["id_user"]

    org_data = {"name": "Clube da Promoção", "description": "Subindo de cargo."}
    org_id = client.post("/organizacoes/", json=org_data, headers=headers1).json()["organizacao_id"]

    # Inserimos o Alvo como MEMBER ativo no banco
    membership = MemberOrganization(user_id=user2_id, organization_id=org_id, role=OrgRole.MEMBER, status=True)
    db_session.add(membership)
    db_session.commit()

    # Promover o alvo
    response = client.patch(f"/organizacoes/{org_id}/membros/{user2_id}/promover", headers=headers1)

    assert response.status_code == 200
    assert "promovido a ADMIN com sucesso" in response.json()["mensagem"]

    # 6. Verifica no banco se a role mudou mesmo
    stmt = select(MemberOrganization).where(MemberOrganization.user_id == user2_id, MemberOrganization.organization_id == org_id)
    alvo_db = db_session.exec(stmt).first()
    assert alvo_db.role == OrgRole.ADMIN

# Cenário 20: Membro comum tenta promover alguém a ADMIN
def test_promote_member_forbidden(client, db_session):
    """Garante que um membro comum NÃO PODE promover ninguém."""
    # Setup: Dois usuários comuns
    client.post("/auth/signup", json={"name": "Suj", "nickname": "sujeito1", "email": "sujeito1@org.com", "password": "123"})
    token_sujeito = client.post("/auth/login", json={"email": "sujeito1@org.com", "password": "123"}).json()["access_token"]
    headers_suj = {"Authorization": f"Bearer {token_sujeito}"}
    
    client.post("/auth/signup", json={"name": "Alvo", "nickname": "alvo_p", "email": "alvop@org.com", "password": "123"})
    alvo_id = client.post("/auth/login", json={"email": "alvop@org.com", "password": "123"}).json()["id_user"]

    # Criação org direto no banco para o teste
    org = Organization(name="Clube Errado", description="Desc", creator_id=99)
    db_session.add(org)
    db_session.commit()

    # Adiciona os dois como MEMBER
    db_session.add(MemberOrganization(user_id=alvo_id, organization_id=org.id, role=OrgRole.MEMBER, status=True))
    db_session.commit()

    # Action (O Sujeito 1 que não é admin tenta promover o Alvo)
    response = client.patch(f"/organizacoes/{org.id}/membros/{alvo_id}/promover", headers=headers_suj)

    assert response.status_code == 403
    assert response.json()["detail"] == "Apenas administradores podem promover membros."

# Cenário 21: ADMIN tenta rebaixar outro ADMIN que não é o criador
def test_demote_member_success(client, db_session):
    """Garante que um ADMIN pode rebaixar outro ADMIN (desde que não seja o criador)."""
    # 1. Setup: Criador (Admin 1)
    client.post("/auth/signup", json={"name": "Chefe", "nickname": "chefe_demote", "email": "chefe_d@org.com", "password": "123"})
    token1 = client.post("/auth/login", json={"email": "chefe_d@org.com", "password": "123"}).json()["access_token"]
    headers1 = {"Authorization": f"Bearer {token1}"}

    # 2. Setup: Alvo (Admin 2)
    client.post("/auth/signup", json={"name": "Rebaixado", "nickname": "rebaixado", "email": "rebaixado@org.com", "password": "123"})
    user2_id = client.post("/auth/login", json={"email": "rebaixado@org.com", "password": "123"}).json()["id_user"]

    # 3. Admin 1 cria a organização
    org_data = {"name": "Clube da Demoção", "description": "Caindo de cargo."}
    org_id = client.post("/organizacoes/", json=org_data, headers=headers1).json()["organizacao_id"]

    # 4. Inserimos o Alvo como ADMIN ativo no banco
    membership = MemberOrganization(user_id=user2_id, organization_id=org_id, role=OrgRole.ADMIN, status=True)
    db_session.add(membership)
    db_session.commit()

    # 5. ACTION: Admin 1 rebaixa Admin 2
    response = client.patch(f"/organizacoes/{org_id}/membros/{user2_id}/rebaixar", headers=headers1)

    assert response.status_code == 200
    assert "rebaixado a MEMBER com sucesso" in response.json()["mensagem"]

    # 6. Verifica no banco se a role caiu
    stmt = select(MemberOrganization).where(MemberOrganization.user_id == user2_id, MemberOrganization.organization_id == org_id)
    alvo_db = db_session.exec(stmt).first()
    assert alvo_db.role == OrgRole.MEMBER

# Cenário 22: Alguém tenta rebaixar o criador da organização
def test_demote_creator_blocked(client, db_session):
    """Garante que ninguém consegue aplicar um golpe e rebaixar o criador da organização."""
    # Setup: Criador original
    client.post("/auth/signup", json={"name": "Criador", "nickname": "criador_imortal", "email": "imortal@org.com", "password": "123"})
    login_criador = client.post("/auth/login", json={"email": "imortal@org.com", "password": "123"}).json()
    criador_id = login_criador["id_user"]
    headers_criador = {"Authorization": f"Bearer {login_criador['access_token']}"}

    # Setup: Outro Admin 
    client.post("/auth/signup", json={"name": "Golpista", "nickname": "golpista_demote", "email": "golpista@org.com", "password": "123"})
    token_golpista = client.post("/auth/login", json={"email": "golpista@org.com", "password": "123"}).json()["access_token"]
    headers_golpista = {"Authorization": f"Bearer {token_golpista}"}

    # Criador cria a org
    org_data = {"name": "Clube Blindado", "description": "O criador não cai."}
    org_id = client.post("/organizacoes/", json=org_data, headers=headers_criador).json()["organizacao_id"]

    golpista_id = client.post("/auth/login", json={"email": "golpista@org.com", "password": "123"}).json()["id_user"]
    
    db_session.add(MemberOrganization(user_id=golpista_id, organization_id=org_id, role=OrgRole.ADMIN, status=True))
    db_session.commit()

    # Golpista (que é admin) tenta rebaixar o Criador
    response = client.patch(f"/organizacoes/{org_id}/membros/{criador_id}/rebaixar", headers=headers_golpista)

    assert response.status_code == 403
    assert response.json()["detail"] == "O criador da organização não pode perder o cargo de administrador."