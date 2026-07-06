from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlmodel import Session, select,func
import os
import shutil
from typing import Optional
from app.database import get_session
from app.models import User, Follower
from app.security import get_actual_user 
from app.schemas import UserUpdateSchema, UserResponseSchema, PaginatedUserResponse
from typing import List

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)

@router.get("/",status_code=status.HTTP_200_OK,response_model=PaginatedUserResponse) ## lista os usuários com filtro opcional.
def list_users(current_user: User = Depends(get_actual_user),page: int = Query(1, ge=1), limit: int = Query(20, ge=1, le=100),search: Optional[str] = None,session: Session = Depends(get_session)):
    offset = (page - 1) * limit
    query = select(User)
    if search:
        query = query.where(User.nickname.ilike("%"+search+"%"))     
    users = session.exec(query.offset(offset).limit(limit)).all()
    total_records = session.exec(select(func.count()).select_from(query.subquery())).one() ## pega a quantidade total de user registrados(talvez isso vai deixar a paginação lenta, mudar????)
    return {
        "current_page": page,
        "limit":limit,
        "total_records": total_records,
        "data": users,
        "total_pages": (total_records + limit - 1) // limit ## total de paginas com o limite atual
    }
    
### --- ROTAS DO PRÓPRIO USUÁRIO LOGADO (/me) --- ###

# Visualizar Meu Perfil 
@router.get("/me", response_model=UserResponseSchema)
def get_my_profile(current_user: User = Depends(get_actual_user)):
    return current_user

# Editar Meu Perfil
@router.patch("/me", response_model=UserResponseSchema,status_code=status.HTTP_200_OK)
def update_profile(user_data: UserUpdateSchema, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    # Atualiza apenas os campos enviados no JSON
    data_dic = user_data.model_dump(exclude_unset=True) ## transforma em dicionario
    for key, value in data_dic.items():
        # Não deixa o usuário alterar ID, email ou senha por aqui. Vou deixar emaill e senha pra ser auterado na autentificação tb
        if hasattr(current_user, key) and key not in ["id", "created_at", "password", "email", "role"]: ## n precisa disso pois o schma já tira esses campos 
            if key == "nickname":
                query = select(User).where(User.nickname==key)
                user = session.exec(query).first()
                if user:
                    raise HTTPException(status_code=403,detail="Apelido de usuário já em uso!")
            setattr(current_user, key, value)
        else:
            raise HTTPException(status_code=422,detail="Campo imutável ou desconehcido")     
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return current_user

# Excluir Conta (Desativar meu perfil)
@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_my_profile(current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    session.delete(current_user)
    session.commit()
    
    return {"mensagem": "Conta excluída permanentemente.", "usuario_id": current_user.id}

# Upload da Minha Foto de Perfil
@router.post("/me/foto", status_code=status.HTTP_200_OK)
async def upload_user_photo(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_actual_user),
    session: Session = Depends(get_session)
):
    upload_dir = "app/static/defaults"
    os.makedirs(upload_dir, exist_ok=True)
    file_name = f"user_{current_user.id}_{file.filename}"
    file_path = f"{upload_dir}/{file_name}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_path = f"static/defaults/{file_name}"
    
    # Atualiza o model com a nova foto
    current_user.picture_profile = db_path
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return {"mensagem": "Foto atualizada com sucesso.", "picture_profile": db_path}


### --- ROTAS DE INTERAÇÃO COM TERCEIROS (/{id}) --- ###

# Visualizar Perfil de Outro Usuário
@router.get("/{user_id}", response_model=UserResponseSchema)
def get_user_profile(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return user

# Seguir Usuário
@router.post("/{id_following}/seguir", status_code=status.HTTP_200_OK)
def follow_user(id_following: int, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    if current_user.id == id_following:
        raise HTTPException(status_code=400, detail="Você não pode seguir a si mesmo.")
        
    # Verifica se já segue para não duplicar
    stmt = select(Follower).where(Follower.id_follower == current_user.id, Follower.id_following == id_following)
    db_follow = session.exec(stmt).first()
    if db_follow:
        return {"mensagem": "Você já segue este usuário."}
    query = select(User).where(User.id==id_following)
    user = session.exec(query).first()
    if not user:
        raise HTTPException(status_code=400,detail="Não é possível seguir um usuário inexistente.")        
    new_follow = Follower(id_follower=current_user.id, id_following=id_following)
    session.add(new_follow)
    session.commit()
    
    return {"mensagem": f"Você começou a seguir o usuário {id_following}", "seguindo_id": id_following}

# Deixar de Seguir
@router.delete("/{id_following}/seguir", status_code=status.HTTP_200_OK)
def unfollow_user(id_following: int, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    stmt = select(Follower).where(Follower.id_follower == current_user.id, Follower.id_following == id_following)
    db_follow = session.exec(stmt).first()
    if not db_follow:
        raise HTTPException(status_code=404, detail="Usuário não encontrado ou ainda não segue este usuário.")
        
    session.delete(db_follow)
    session.commit()
    return {"mensagem": f"Você deixou de seguir o usuário {id_following}", "seguindo_id": id_following}

# Listar Seguidores
@router.get("/{user_id}/seguidores", status_code=status.HTTP_200_OK, response_model=List[UserResponseSchema])
def get_followers(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    return user.followers

# Listar Seguindo (Quem o usuário segue)
@router.get("/{user_id}/seguindo", status_code=status.HTTP_200_OK, response_model=List[UserResponseSchema])
def get_following(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    
    return user.following
  
### ATENÇÃO LEO! QUANDO FOR MECHER AQUI SIGA O MEDELO QUE ESTÁ NO AUTH.PY PARA PADRONIZAR O PROJETO
### SEGUIR O MODELO, ESTOU QUERENDO DIZER PARA CRIAR TIPOS PARA OS ARGUMENTOS DE CADA FUNÇÃO E CRIAR TIPOS PARA OS RETURNS(SE QUISER SABER O PQ MANDA UM SALVE NO ZAP)
#### OS TIPOS ESTÃO NO ARQUIVO SCHEMA.PY, USAR ROUTER TAMBÉM DEPOS QUE TERMINAR A ROTA ADD ELA NA MAIN Q NEM EU FIZ, O RETORNA DA FUÇÃO CASO DE ERRO USE O HTTMeXEPECTION IGUAL NO AUTH.PY
### SE DER BOM A FUNÇÃO, COLOCA O STATUS CODE, LÁ EM CIMA DELA(DO LADO DA ROTA)
### O RETURN DA FUNÇÃO É TAMBÉM TIPADO DO LADO DA ROTA, ISSO FAZ COM QUE O RETURN SEJA FILTRADO!! POR EXEMPLO NA FUNÇÃO DE CADASTRAR O USUÁRIO, EU RETORNO O USER COMPLETO, PORÉM VAI SER FILTRADO COM BASE NO TIPO QUE COLOQUEI LÁ
