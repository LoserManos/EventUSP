from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlmodel import Session, select
import os
import shutil

from app.database import get_session
from app.models import User

# Importando a função de autenticação que precisa ser criada no auth.py. Vou deixar aqui até vc implementar. Se fizer com outro nome, me avisa q eu importo com nome diferente
# O FastAPI vai rodar essa função antes de entrar na rota para garantir que o usuário está logado
from app.auth import get_current_user 

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)

### --- ROTAS DO PRÓPRIO USUÁRIO LOGADO (/me) --- ###

# Visualizar Meu Perfil 
@router.get("/me", response_model=User)
def get_my_profile(current_user: User = Depends(get_current_user)):
    return current_user

# Editar Meu Perfil
@router.patch("/me", response_model=User)
def update_profile(user_data: dict, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Atualiza apenas os campos enviados no JSON
    for key, value in user_data.items():
        # Não deixa o usuário alterar ID, email ou senha por aqui. Vou deixar emaill e senha pra ser auterado na autentificação tb
        if hasattr(current_user, key) and key not in ["id", "created_at", "password", "email"]:
            setattr(current_user, key, value)
            
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return current_user

# Excluir Conta (Desativar meu perfil)
@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_my_profile(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Assumindo que que vc vai colocar um campo 'is_active' no models.py dps. Se vc tem outros planos pra como fazer, me manda msg
    current_user.is_active = False 
    session.add(current_user)
    session.commit()
    
    return {"mensagem": "Conta desativada com sucesso.", "usuario_id": current_user.id, "ativo": False}

# Upload da Minha Foto de Perfil
@router.post("/me/foto", status_code=status.HTTP_200_OK)
async def upload_user_photo(
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    upload_dir = "uploads/usuarios"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = f"{upload_dir}/{current_user.id}_{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    avatar_url = f"https://api.eventusp.com/{file_path}"
    
    # Atualiza o model com a nova foto
    current_user.foto_perfil = avatar_url
    session.add(current_user)
    session.commit()
    session.refresh(current_user)
    
    return {"mensagem": "Foto atualizada com sucesso.", "avatar_url": avatar_url}


### --- ROTAS DE INTERAÇÃO COM TERCEIROS (/{id}) --- ###

# Visualizar Perfil de Outro Usuário
@router.get("/{user_id}", response_model=User)
def get_user_profile(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
    return user

# Seguir Usuário
@router.post("/{id_following}/seguir", status_code=status.HTTP_200_OK)
def follow_user(id_following: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    if current_user.id == id_following:
        raise HTTPException(status_code=400, detail="Você não pode seguir a si mesmo.")
        
    # Quando criar o modelo Follower, vou descomente as linhas abaixo
    # # Verifica se já segue para não duplicar
    # stmt = select(Follower).where(Follower.id_follower == current_user.id, Follower.id_following == id_following)
    # db_follow = session.exec(stmt).first()
    # if db_follow:
    #     return {"mensagem": "Você já segue este usuário."}
        
    # new_follow = Follower(id_follower=current_user.id, id_following=id_following)
    # session.add(new_follow)
    # session.commit()
    
    return {"mensagem": f"Você começou a seguir o usuário {id_following}", "seguindo_id": id_following}

# Deixar de Seguir
@router.delete("/{id_following}/seguir", status_code=status.HTTP_200_OK)
def unfollow_user(id_following: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # Quando criar o modelo Follower, vou descomente as linhas abaixo
    # stmt = select(Follower).where(Follower.id_follower == current_user.id, Follower.id_following == id_following)
    # db_follow = session.exec(stmt).first()
    # if not db_follow:
    #     raise HTTPException(status_code=404, detail="Você não segue este usuário.")
        
    # session.delete(db_follow)
    # session.commit()
    return {"mensagem": f"Você deixou de seguir o usuário {id_following}", "seguindo_id": id_following}
  
### ATENÇÃO LEO! QUANDO FOR MECHER AQUI SIGA O MEDELO QUE ESTÁ NO AUTH.PY PARA PADRONIZAR O PROJETO
### SEGUIR O MODELO, ESTOU QUERENDO DIZER PARA CRIAR TIPOS PARA OS ARGUMENTOS DE CADA FUNÇÃO E CRIAR TIPOS PARA OS RETURNS(SE QUISER SABER O PQ MANDA UM SALVE NO ZAP)
#### OS TIPOS ESTÃO NO ARQUIVO SCHEMA.PY, USAR ROUTER TAMBÉM DEPOS QUE TERMINAR A ROTA ADD ELA NA MAIN Q NEM EU FIZ, O RETORNA DA FUÇÃO CASO DE ERRO USE O HTTMeXEPECTION IGUAL NO AUTH.PY
### SE DER BOM A FUNÇÃO, COLOCA O STATUS CODE, LÁ EM CIMA DELA(DO LADO DA ROTA)
### O RETURN DA FUNÇÃO É TAMBÉM TIPADO DO LADO DA ROTA, ISSO FAZ COM QUE O RETURN SEJA FILTRADO!! POR EXEMPLO NA FUNÇÃO DE CADASTRAR O USUÁRIO, EU RETORNO O USER COMPLETO, PORÉM VAI SER FILTRADO COM BASE NO TIPO QUE COLOQUEI LÁ
