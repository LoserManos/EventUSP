from app.security import generate_hash_password, verify_password, create_access_token, get_actual_user
from fastapi import FastAPI, Depends, HTTPException, status,APIRouter
from sqlmodel import Session, select
from app.database import get_session
from app.models import User
from app.schemas import LoginRequest, TokenResponse,SingupRequest,SingupResponse

# criando o router
router = APIRouter(tags=["Autenticação"])

@router.post("/auth/login",status_code=status.HTTP_200_OK,response_model=TokenResponse)
def login(login_data: LoginRequest,session = Depends(get_session)):
    query = select(User).where(login_data.email==login_data.email)
    user = session.exec(query).first()
    if not user or verify_password(login_data.password,user.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="E-mail ou senha incorretos")
    token = create_access_token({"sub":user.id})
    return {"acces_token":token,"detail":"bearer","id":user.id}
 
@router.post("/auth/singup",status_code=status.HTTP_201_CREATED,response_model=SingupResponse)
def singup(singup_data:SingupRequest,session = Depends(get_session)):
    query = select(User).where(singup_data.email==singup_data.email)
    user = session.exec(query).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Este e-mail já está cadastrado no sistema.")
    criptd_passord = generate_hash_password(singup_data.password)
    new_user = User(name=singup_data.name,email=singup_data.email,password = criptd_passord,bio = singup_data.bio)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user
