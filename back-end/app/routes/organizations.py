from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlmodel import Session, select
import os
import shutil

from app.database import get_session
from app.models import User, Organization, MemberOrganization, OrgRole
from app.security import get_actual_user

router = APIRouter(
    prefix="/organizacoes",
    tags=["Organizações"]
)

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