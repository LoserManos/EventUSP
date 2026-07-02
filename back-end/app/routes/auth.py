from app.security import generate_hash_password, verify_password, create_access_token, get_actual_user
from fastapi import FastAPI, Depends, HTTPException, status,APIRouter
from sqlmodel import Session, select
from app.database import get_session
from app.models import User
from app.schemas import LoginRequest, TokenResponse,SignupRequest,SignupResponse

# criando o router
router = APIRouter(tags=["Autenticação"])

@router.post("/auth/login",status_code=status.HTTP_200_OK,response_model=TokenResponse)
def login(login_data: LoginRequest,session = Depends(get_session)):
    query = select(User).where(User.email==login_data.email)
    user = session.exec(query).first()
    if not user or not verify_password(login_data.password,user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="E-mail ou senha incorretos")
    token = create_access_token({"sub":str(user.id)})
    return {"access_token":token,"token_type":"bearer","id_user":user.id}
 
@router.post("/auth/signup",status_code=status.HTTP_201_CREATED,response_model=SignupResponse)
def signup(signup_data:SignupRequest,session = Depends(get_session)):
    if(len(signup_data.name)==0 or len(signup_data.nickname==0) or len(signup_data.password)==0 or len(signup_data.email)==0):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Nenhum campo obrigatório pode ser vazio.")
    query = select(User).where(User.email==signup_data.email)
    user = session.exec(query).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Este e-mail já está cadastrado no sistema.")
    query= select(User).where(User.nickname == signup_data.nickname)
    user = session.exec(query).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Este nome de usuário já está cadastrado no sistema.")    
    criptd_passord = generate_hash_password(signup_data.password)
    new_user = User(name=signup_data.name,email=signup_data.email,password = criptd_passord,bio = signup_data.bio)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user
