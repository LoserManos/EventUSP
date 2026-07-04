from pydantic import BaseModel, EmailStr, Field, field_validator, ConfigDict
from datetime import datetime
from typing import Optional, List

class LoginRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

    @field_validator('name', 'password')
    @classmethod
    def validar_strings_vazias(cls, value: str):
        texto_limpo = value.strip()
        if not texto_limpo:
            raise ValueError('O campo não pode estar vazio ou conter apenas espaços em branco.')
        return texto_limpo
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    bio: Optional[str] = None

    @field_validator('name', 'password')
    @classmethod
    def validar_strings_vazias(cls, value: str):
        texto_limpo = value.strip()
        if not texto_limpo:
            raise ValueError('O campo não pode estar vazio ou conter apenas espaços em branco.')
        return texto_limpo
class SignupResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    bio: Optional[str]
    created_at: datetime
    class Config: # Isso aqui avisa ao Pydantic que ele pode ler dados direto de um objeto do banco (SQLModel)
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    id_user: int

class UserResponseSchema(BaseModel):
    """Molde de saída: O que é devolvido quando se pede o perfil de um utilizador."""
    id: int
    name: str
    email: EmailStr
    bio: Optional[str] = None
    role: str
    picture_profile: Optional[str] = None
    class Config:
        from_attributes = True

class UserUpdateSchema(BaseModel):
    """Molde de entrada: O que o utilizador pode enviar para editar o próprio perfil."""
    name: Optional[str] = None
    bio: Optional[str] = None
    # Não inclui 'email' ou 'password' aqui por segurança (são tratados na autenticação).

    @field_validator('name', 'bio')
    @classmethod
    def validar_strings_vazias(cls, value: Optional[str]):
        if value is not None:
            texto_limpo = value.strip()
            if not texto_limpo:
                raise ValueError('O campo não pode conter apenas espaços em branco.')
            return texto_limpo
        return value

class EventCreateSchema(BaseModel):
    """Molde de entrada: Dados estritamente necessários para criar um evento."""
    title: str
    start_date: datetime
    duration: int = Field(gt=0, description="A duração deve ser maior que zero minutos")
    local: str
    category_id: int
    organization_id: Optional[int] = None

    @field_validator('start_date')
    @classmethod
    def validar_data_futura(cls, valor_data: datetime):
        if valor_data.replace(tzinfo=None) < datetime.now().replace(tzinfo=None):
            raise ValueError('A data do evento não pode estar no passado.')
        return valor_data
    
    @field_validator('title', 'local')
    @classmethod
    def validar_strings_vazias(cls, value: str):
        texto_limpo = value.strip() # Remove espaços do começo e do fim
        if not texto_limpo:
            raise ValueError('Este campo não pode estar vazio ou conter apenas espaços em branco.')
        return texto_limpo # Retorna o texto limpo para ser salvo no banco

class EventUpdateSchema(BaseModel):
    """Molde de entrada: Todos os campos são opcionais para permitir edições parciais."""
    title: Optional[str] = None
    start_date: Optional[datetime] = None
    duration: Optional[int] = Field(default=None, gt=0, description="A duração deve ser maior que zero minutos")
    local: Optional[str] = None
    category_id: Optional[int] = None
    organization_id: Optional[int] = None

    @field_validator('title', 'local')
    @classmethod
    def validar_strings_vazias(cls, value: Optional[str]):
        if value is not None:
            texto_limpo = value.strip()
            if not texto_limpo:
                raise ValueError('Este campo não pode estar vazio ou conter apenas espaços em branco.')
            return texto_limpo
        return value

    @field_validator('start_date')
    @classmethod
    def validar_data_futura(cls, valor_data: Optional[datetime]):
        if valor_data is not None:
            if valor_data.replace(tzinfo=None) < datetime.now().replace(tzinfo=None):
                raise ValueError('A data do evento não pode estar no passado.')
        return valor_data

    model_config = ConfigDict(from_attributes=True)

class EventResponseSchema(BaseModel):
    """Molde de saída: Como o evento será devolvido na listagem (Feed) e detalhes."""
    id: int
    title: str
    start_date: datetime
    duration: int
    local: str
    likes: int
    category_id: int
    user_id: int
    organization_id: Optional[int] = None
    banner: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

class CommentCreateSchema(BaseModel):
    """Molde de entrada: Dados para criar um novo comentário."""
    content: str

    @field_validator('content')
    @classmethod
    def validar_conteudo_vazio(cls, value: str):
        texto_limpo = value.strip()
        if not texto_limpo:
            raise ValueError('O comentário não pode estar vazio.')
        return texto_limpo

class PaginatedEventResponse(BaseModel):
    pagina_atual: int
    total_eventos: Optional[int] = None
    dados: List[EventResponseSchema]

class PaginatedUserResponse(BaseModel):
    current_page: int
    limit: int
    total_records: int 
    total_pages: int
    data: List[UserResponseSchema]