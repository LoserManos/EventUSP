import os
from datetime import datetime, timedelta
from typing import Optional
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from app.database import get_session
from app.models import User
# Configurações do Token --- ISSO DA QUI TUDO VAI PARA O .ENV MAIS PRA FRENTE, A secret key vai ser alterada também
SECRET_KEY = os.getenv("SECRET_KEY", "CHAVE SUPER SECRETAAAAA")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS= 30  # O token expira em 30 dias, mais pra frente usar técninca de refresh token
# Configurações do Token --- ISSO DA QUI TUDO VAI PARA O .ENV MAIS PRA FRENTE

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login") ## classe que lida com a lógica de extrair os tokens da requisição
# =====================================================================
# GERENCIAMENTO DE SENHAS
# =====================================================================
def generate_hash_password(password: str) -> str:
    """Transforma uma senha em texto limpo em um hash seguro e criptografado.

    Utiliza a biblioteca bcrypt para gerar um salt aleatório e aplicar o algoritmo
    de hashing na senha convertida em bytes. O resultado é decodificado de volta
    para string para ser armazenado com segurança no banco de dados.

    Args:
        password (str): A senha em texto puro digitada pelo usuário no cadastro.

    Returns:
        str: O hash da senha gerado, pronto para salvamento no banco de dados.
    """
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(password: str, password_hash: str) -> bool:
    """Compara uma senha digitada em texto puro com o hash salvo no banco de dados.

    Converte a senha digitada e o hash armazenado para bytes e utiliza o método
    seguro do bcrypt para validar se a senha informada corresponde ao hash.

    Args:
        password (str): A senha em texto puro informada pelo usuário no login.
        password_hash (str): O hash seguro recuperado do banco de dados do usuário.

    Returns:
        bool: True se a senha estiver correta e bater com o hash, False caso contrário.
    """
    return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8'))
# =====================================================================
# GERENCIAMENTO DE TOKENS (JWT)
# =====================================================================
def create_access_token(data: dict) -> str:
    """Gera uma chave digital JWT (JSON Web Token) de longa duração.

    Cria uma cópia dos dados fornecidos, calcula a data e hora exatas de expiração
    com base na constante configurada (em dias) e insere essa informação no payload
    através da chave 'exp'. Em seguida, codifica e assina digitalmente o token.

    Args:
        data (dict): Dicionário contendo os dados do payload (ex: {"sub": user.id}).

    Returns:
        str: O token JWT codificado e assinado, pronto para ser enviado ao Client.
    """
    data_coded = data.copy()
    time_expiration = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    data_coded.update({"exp": time_expiration})
    return jwt.encode(data_coded, SECRET_KEY, algorithm=ALGORITHM)
# =====================================================================
# DEPENDÊNCIAS DE PROTEÇÃO DE ROTAS
# =====================================================================
def get_actual_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> User:
    """Protege rotas exigindo autenticação via Token JWT enviado pelo Client.

    Esta função age como uma injeção de dependência do FastAPI. Ela intercepta a
    requisição, extrai o Bearer Token do cabeçalho HTTP, valida sua assinatura e
    data de validade, extrai o ID do usuário e busca o respectivo registro no banco.

    Args:
        token (str): O token JWT extraído automaticamente do Header pelo 'oauth2_scheme'.
        session (Session): Sessão ativa do banco de dados fornecida pelo 'get_session'.

    Raises:
        HTTPException (401 UNAUTHORIZED): Se o token for inválido, corrompido, 
            expirado, se não contiver o ID ('sub') ou se o usuário correspondente
            não existir mais no banco de dados.

    Returns:
        User: O objeto completo do modelo User representando o usuário autenticado.
    """
    # Cabeçalho personalizado padrão de internet para erro de autenticação
    exception_auth = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token inválido ou expirado. Faça login novamente.",headers={"WWW-Authenticate": "Bearer"},)
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])# Tenta decodificar o token recebido usando a chave secreta do servidor
        user_id: int = payload.get("sub")
        if user_id is None:   # Se o token for válido mas não tiver o ID lá dentro, barra o acesso
            raise exception_auth
    except jwt.PyJWTError:
        raise exception_auth
    user = session.get(User, user_id) # Busca o usuário dono do token no banco de dados usando o ID extraído
    if user is None: # Se o ID no token for válido, mas o usuário foi deletado do banco, barra o acesso
        raise exception_auth        
    return user     # Retorna o objeto do usuário pronto para ser consumido pela rota do FastAPI
