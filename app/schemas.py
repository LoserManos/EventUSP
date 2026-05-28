from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class LoginRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
class SingupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    bio: Optional[str]
class SingupResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    bio: Optional[str]
    created_at: datetime
    class Config: # Isso aqui avisa ao Pydantic que ele pode ler dados direto de um objeto do banco (SQLModel)
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    id_user: int