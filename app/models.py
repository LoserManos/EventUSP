from typing import List, Optional
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship



class User(SQLModel,table = True):
    __tablename__ = "user" 
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    foto_perfil: Optional[str] ## preciso mudar, para colocar a pasta especifica 
    events_created: List["Event"] = Relationship(back_populates="creator") ## toda vez q associar um evento a um usuário colocar o evento aqui



class Event(SQLModel, table=True):
    __tablename__ = "event"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    start_date: datetime
    duration: int  # em minutos
    likes: int = Field(default=0)
    local: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: int = Field(foreign_key="user.id") # chave estrangeira de quem criou o evento
    creator: User = Relationship(back_populates="events_created")
    
    # CHAVE ESTRANGEIRA: Organização dona (Opcional -> nullable=True)
    #organization_id: Optional[int] = Field(default=None, foreign_key="organization.id", nullable=True)
    #organization: Optional[Organization] = Relationship(back_populates="events")
    
    # Se você já tiver a tabela de categorias, adicione a FK correspondente:
    # category_id: int = Field(foreign_key="category.id")