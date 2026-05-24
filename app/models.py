from typing import List, Optional
from datetime import datetime
from enum import Enum
from sqlmodel import SQLModel, Field, Relationship

### --------- ENUMS -------------- ###
class CategoryType(str,Enum):
    PARTY = "party"
    SPORT = "sport"
    WORKSHOP = "workshop"
    LECTURE = "lecture"
    CONGRESS = "congress"
    SOCIAL = "social"
    RELIGION = "relegion"
    ACADEMIC = "academic"

class OrgRole(str,Enum):
    ADMIM = "admin"
    POSTER = "poster" ## acima do membro comum, pode postar eventos
    MEMBER = "member"
class UserRole(str,Enum):
    ADMIN = "admin"
    COMMUN =  "commun"
### --------- ENUMS -------------- ###
class Follower(SQLModel,table=True):
    __tablename__ = "followers"
    id_follower: int = Field(# Chave estrangeira de quem está seguindo (ex: o seu ID)
        foreign_key="user.id", 
        primary_key=True
    )
    id_following: int = Field(  # Chave estrangeira de quem está sendo seguido (ex: o ID de outro usuário)
        foreign_key="user.id", 
        primary_key=True
    )
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Likes(SQLModel,table=True):
    __tablename__ = "likes"
    id: Optional[int] = Field(default=None,primary_key = True)
    user_id: int = Field(foreign_key="user.id")
    event_id: int = Field(foreign_key="event.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Interests(SQLModel,table=True):
    __tablename__ = "interests"
    id: Optional[int] = Field(default=None,primary_key = True)
    user_id: int = Field(foreign_key="user.id")
    event_id: int = Field(foreign_key="event.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MemberOrganization(SQLModel, table=True):
    __tablename__ = "member_organization"
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    organization_id: int = Field(foreign_key="organization.id", primary_key=True)
    role: OrgRole = Field(default=OrgRole.MEMBER)
    status: bool = Field(default=False)     # Booleano de aprovação (com nome atualizado para 'status')
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class User(SQLModel,table = True):
    __tablename__ = "user" 
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str
    password: str #hash da senha
    bio: Optional[str] = Field(default=None) # bio opcional
    role: UserRole = Field(default=UserRole.COMMUN) ## role do usuário se é admin ou é comum 
    picture_profile: Optional[str] = Field(default="static/defaults/user.jpg") ## preciso mudar, para colocar a pasta especifica 
    events_created: List["Event"] = Relationship(back_populates="creator") ## toda vez q associar um evento a um usuário colocar o evento aqui
    # Quem este usuário está seguindo (Lista de outros usuários)
    following: List["User"] = Relationship(link_model=Follower,sa_relationship_kwargs={"primaryjoin": "User.id==Follower.id_follower","secondaryjoin": "User.id==Follower.id_following",})
    #Quem segue este usuário (Lista de seguidores dele)
    followers: List["User"] = Relationship(link_model=Follower,sa_relationship_kwargs={"primaryjoin": "User.id==Follower.id_following","secondaryjoin": "User.id==Follower.id_follower",})
    liked_events: List["Event"] = Relationship(link_model=Likes,back_populates="likers")  # Diz para o Python olhar o campo "likers" lá no Event, e se tiver meu id lá, bota o evento aqui
    interested_events: List["Event"] = Relationship(link_model=Interests,back_populates="likers")
    comments_made: List["Comment"] = Relationship(back_populates="author") # Lista de todos os comentários que este usuário já escreveu no app
    organizations: List["Organization"] = Relationship(link_model=MemberOrganization, back_populates="members")

class Organization(SQLModel, table=True):
    __tablename__ = "organization"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    members: List["User"] = Relationship(link_model=MemberOrganization, back_populates="organizations")
    description: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    events: List["Event"] = Relationship(back_populates="organization")  # Relacionamento: Uma organização pode ter vários eventos atrelados, facilita a busca, já q n precisamos bugas chave estrangeira em Event

class Event(SQLModel, table=True):
    __tablename__ = "event"
    id: Optional[int] = Field(default=None, primary_key=True)
    category_id: int = Field(foreign_key="category.id") #categoria do evento
    user_id: int = Field(foreign_key="user.id") # chave estrangeira de quem criou o evento
    organization_id: Optional[int] = Field(default=None, foreign_key="organization.id", nullable=True)  # CHAVE ESTRANGEIRA: Organização dona (Opcional -> nullable=True)
    organization: Optional[Organization] = Relationship(back_populates="events") # toda vez que criar um evento com organização id, a organização vai ficar aqui
    banner: Optional[str] = Field(default="static/defaults/user.jpg") ## foto do banner
    title: str
    start_date: datetime
    duration: int  # em minutos
    likes: int = Field(default=0)
    local: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    creator: User = Relationship(back_populates="events_created")
    likers: List["User"] = Relationship(link_model=Likes, back_populates="liked_events")  # <-- Diz para o Python olhar o campo "liked_events" lá no User
    interested: List["Event"] = Relationship(link_model=Interests,back_populates="interested_events")
    comments: List["Comment"] = Relationship(back_populates="event")
    members: List["User"] = Relationship(link_model=MemberOrganization, back_populates="organizations")

class Category(SQLModel,table=True):
    __tablename__ = "category"
    id: Optional[int] = Field(default=None, primary_key=True)
    type: CategoryType
    created_at: datetime = Field(default_factory=datetime.utcnow)
    events: List["Event"] = Relationship(back_populates="organization") # Relacionamento: Uma categoria pode ter vários eventos atrelados

class Comment(SQLModel,table=True):
    __tablename__ = "comments"
    id: Optional[int] = Field(default=None,primary_key = True)
    user_id: int = Field(foreign_key="user.id")
    event_id: int = Field(foreign_key="event.id")
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    author: "User" = Relationship(back_populates="comments_made")
    event: "Event" = Relationship(back_populates="comments")
