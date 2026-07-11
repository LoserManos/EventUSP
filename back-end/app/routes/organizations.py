from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlmodel import Session, select, func
import os
import shutil

from app.database import get_session
from app.models import User, Organization, MemberOrganization, OrgRole
from app.security import get_actual_user
from app.schemas import OrganizationCreateSchema, OrganizationUpdateSchema

router = APIRouter(
    prefix="/organizacoes",
    tags=["Organizações"]
)

# Criar Organização
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_organization(
    org_data: OrganizationCreateSchema, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    # Cria a organização no banco usando os dados enviados
    nova_org = Organization(
        name=org_data.name,
        description=org_data.description,
        creator_id=current_user.id
    )
    session.add(nova_org)
    session.commit()
    session.refresh(nova_org) 
    
    # Vincula o usuário criador como ADMIN da nova organização
    membership = MemberOrganization(
        user_id=current_user.id,
        organization_id=nova_org.id,
        role=OrgRole.ADMIN,
        status=True # Já entra com status de aprovado (afinal, ele é o dono)
    )
    session.add(membership)
    session.commit()
    
    return {"mensagem": "Organização criada com sucesso!", "organizacao_id": nova_org.id}

# Upload da Foto da Organização
@router.post("/{org_id}/foto", status_code=status.HTTP_200_OK)
async def upload_org_photo(
    org_id: int,
    file: UploadFile = File(...), 
    current_user: User = Depends(get_actual_user),
    session: Session = Depends(get_session)
):
    # Verifica se a organização existe
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # Verifica se o usuário é membro da organização E se tem cargo de ADMIN
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == current_user.id,
        MemberOrganization.organization_id == org_id
    )
    membership = session.exec(stmt).first()

    if not membership or membership.role != OrgRole.ADMIN:
        raise HTTPException(status_code=403, detail="Apenas administradores podem alterar a foto da organização.")

    upload_dir = "app/static/defaults"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_name = f"org_{org.id}_{file.filename}"
    file_path = f"{upload_dir}/{file_name}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_path = f"static/defaults/{file_name}"
    
    # Atualiza o banco de dados
    org.picture_profile = db_path
    session.add(org)
    session.commit()
    session.refresh(org)
    
    return {"mensagem": "Foto da organização atualizada com sucesso.", "picture_profile": db_path}

# Editar Organização
@router.patch("/{org_id}", status_code=status.HTTP_200_OK)
def update_organization(
    org_id: int, 
    org_data: OrganizationUpdateSchema, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    # Verifica se a organização existe
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # Verifica se o usuário é membro e ADMIN
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == current_user.id,
        MemberOrganization.organization_id == org_id
    )
    membership = session.exec(stmt).first()

    if not membership or membership.role != OrgRole.ADMIN:
        raise HTTPException(status_code=403, detail="Apenas administradores podem editar a organização.")

    # Atualiza apenas os campos fornecidos
    dados_atualizar = org_data.model_dump(exclude_unset=True)
    for key, value in dados_atualizar.items():
        setattr(org, key, value)

    session.add(org)
    session.commit()
    session.refresh(org)

    return org

# Excluir Organização
@router.delete("/{org_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_organization(
    org_id: int, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    # Verifica se a organização existe
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # Verifica permissões (Apenas ADMIN pode apagar)
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == current_user.id,
        MemberOrganization.organization_id == org_id
    )
    membership = session.exec(stmt).first()

    if not membership or membership.role != OrgRole.ADMIN:
        raise HTTPException(status_code=403, detail="Apenas administradores podem excluir a organização.")

    # Elimina a organização
    session.delete(org)
    session.commit()
    
    return

# Solicitar Entrada na Organização
@router.post("/{org_id}/entrar", status_code=status.HTTP_200_OK)
def join_organization(
    org_id: int, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    # Verifica se a organização existe
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # Verifica se o usuário já fez a solicitação ou já é membro
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == current_user.id,
        MemberOrganization.organization_id == org_id
    )
    membership = session.exec(stmt).first()

    if membership:
        if membership.status:
            raise HTTPException(status_code=400, detail="Você já é membro desta organização.")
        else:
            raise HTTPException(status_code=400, detail="Sua solicitação de entrada já está pendente.")

    # Cria a solicitação de entrada (Cargo MEMBER, status=False)
    novo_membro = MemberOrganization(
        user_id=current_user.id,
        organization_id=org.id,
        role=OrgRole.MEMBER,
        status=False # Significa que está aguardando aprovação
    )
    session.add(novo_membro)
    session.commit()

    return {"mensagem": "Solicitação de entrada enviada com sucesso! Aguarde a aprovação de um administrador."}

# Sair da Organização
@router.delete("/{org_id}/sair", status_code=status.HTTP_200_OK)
def leave_organization(
    org_id: int, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    # Verifica se a organização existe
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # Bloqueio do criador: ele não pode simplesmente sair
    if current_user.id == org.creator_id:
        raise HTTPException(
            status_code=400, 
            detail="Você é o criador da organização. Antes de sair, você deve transferir a propriedade para outro administrador ou excluir a organização."
        )

    # Verifica se o usuário é membro (ou tem solicitação pendente)
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == current_user.id,
        MemberOrganization.organization_id == org_id
    )
    membership = session.exec(stmt).first()

    if not membership:
        raise HTTPException(status_code=400, detail="Você não faz parte desta organização.")

    # Proteção: Evitar que a organização fique sem nenhum ADMIN
    if membership.role == OrgRole.ADMIN:
        stmt_admins = select(func.count()).select_from(MemberOrganization).where(
            MemberOrganization.organization_id == org_id,
            MemberOrganization.role == OrgRole.ADMIN
        )
        admin_count = session.exec(stmt_admins).one()
        
        if admin_count <= 1:
            raise HTTPException(
                status_code=400, 
                detail="Você é o único administrador. Transfira a liderança para outro membro ou exclua a organização antes de sair."
            )

    # Remove o vínculo do usuário com a organização
    session.delete(membership)
    session.commit()

    return {"mensagem": "Você saiu da organização com sucesso."}

# Promover usuário a ADMIN
@router.patch("/{org_id}/membros/{alvo_id}/promover", status_code=status.HTTP_200_OK)
def promote_member(
    org_id: int, 
    alvo_id: int, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # Verifica se quem está executando a ação é ADMIN
    requester_membership = session.exec(select(MemberOrganization).where(
        MemberOrganization.user_id == current_user.id,
        MemberOrganization.organization_id == org_id
    )).first()

    if not requester_membership or requester_membership.role != OrgRole.ADMIN:
        raise HTTPException(status_code=403, detail="Apenas administradores podem promover membros.")

    # Busca o usuário alvo
    target_membership = session.exec(select(MemberOrganization).where(
        MemberOrganization.user_id == alvo_id,
        MemberOrganization.organization_id == org_id
    )).first()

    if not target_membership or not target_membership.status:
        raise HTTPException(status_code=404, detail="Usuário alvo não é um membro ativo desta organização.")

    if target_membership.role == OrgRole.ADMIN:
        return {"mensagem": "O usuário já é um administrador."}

    # Promove
    target_membership.role = OrgRole.ADMIN
    session.add(target_membership)
    session.commit()

    return {"mensagem": f"Usuário {alvo_id} promovido a ADMIN com sucesso."}

# Rebaixar usuário a MEMBER
@router.patch("/{org_id}/membros/{alvo_id}/rebaixar", status_code=status.HTTP_200_OK)
def demote_member(
    org_id: int, 
    alvo_id: int, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # 1. PROTEÇÃO DO CRIADOR: Ninguém pode rebaixar o criador da organização!
    if alvo_id == org.creator_id:
        raise HTTPException(status_code=403, detail="O criador da organização não pode perder o cargo de administrador.")

    # Verifica se quem está executando a ação é ADMIN
    requester_membership = session.exec(select(MemberOrganization).where(
        MemberOrganization.user_id == current_user.id,
        MemberOrganization.organization_id == org_id
    )).first()

    if not requester_membership or requester_membership.role != OrgRole.ADMIN:
        raise HTTPException(status_code=403, detail="Apenas administradores podem rebaixar membros.")

    # Busca o usuário alvo
    target_membership = session.exec(select(MemberOrganization).where(
        MemberOrganization.user_id == alvo_id,
        MemberOrganization.organization_id == org_id
    )).first()

    if not target_membership or not target_membership.status:
        raise HTTPException(status_code=404, detail="Usuário alvo não é um membro ativo desta organização.")

    if target_membership.role == OrgRole.MEMBER:
        return {"mensagem": "O usuário já é um membro comum."}

    # Rebaixa
    target_membership.role = OrgRole.MEMBER
    session.add(target_membership)
    session.commit()

    return {"mensagem": f"Usuário {alvo_id} rebaixado a MEMBER com sucesso."}

# Transferir Propriedade da Organização
@router.patch("/{org_id}/transferir-propriedade/{novo_dono_id}", status_code=status.HTTP_200_OK)
def transfer_ownership(
    org_id: int, 
    novo_dono_id: int, 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    org = session.get(Organization, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organização não encontrada.")

    # Apenas o ATUAL criador/dono pode transferir a propriedade
    if current_user.id != org.creator_id:
        raise HTTPException(status_code=403, detail="Apenas o criador original pode transferir a propriedade da organização.")

    if novo_dono_id == current_user.id:
        raise HTTPException(status_code=400, detail="Você já é o dono desta organização.")

    # O novo dono PRECISA ser um membro ativo e já ser um ADMIN 
    stmt = select(MemberOrganization).where(
        MemberOrganization.user_id == novo_dono_id,
        MemberOrganization.organization_id == org_id
    )
    target_membership = session.exec(stmt).first()

    if not target_membership or not target_membership.status:
        raise HTTPException(status_code=404, detail="O usuário alvo não é um membro ativo desta organização.")
        
    if target_membership.role != OrgRole.ADMIN:
        raise HTTPException(status_code=400, detail="O novo dono precisa ser promovido a ADMIN antes de receber a propriedade.")

    # Transfere a propriedade no banco
    org.creator_id = novo_dono_id
    session.add(org)
    session.commit()

    return {"mensagem": f"Propriedade da organização transferida com sucesso para o usuário {novo_dono_id}."}