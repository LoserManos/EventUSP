from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlmodel import Session, select, desc, asc, func
from typing import Optional
import os
import shutil

from app.database import get_session
from app.schemas import EventCreateSchema, EventUpdateSchema, EventResponseSchema, CommentCreateSchema, PaginatedEventResponse
from app.models import Event, User, Likes, Interests, Follower, Comment
from app.security import get_actual_user

router = APIRouter(
    prefix="/eventos",
    tags=["Eventos"]
)

### --- 1. CRIAÇÃO E LISTAGEM (FEED) --- ###

# Criar Novo Evento
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_event(event_data: EventCreateSchema, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    # O organizador é automaticamente o usuário logado
    new_event = Event(**event_data.model_dump(), user_id=current_user.id)
    session.add(new_event)
    session.commit()
    session.refresh(new_event)
    
    return {"mensagem": "Evento criado com sucesso!", "evento_id": new_event.id}

# Listar Eventos (Feed Geral)
@router.get("/", status_code=status.HTTP_200_OK, response_model=PaginatedEventResponse)
def list_events(
    pagina: int = Query(1, ge=1), 
    limite: int = Query(20, ge=1, le=100),
    busca: Optional[str] = None,
    category_id: Optional[int] = None,
    session: Session = Depends(get_session),
    most_recent: Optional[bool] = False,
    most_likes: Optional[bool]  = False,
    closest: Optional[bool] = False
):
    offset = (pagina - 1) * limite
    query = select(Event)
    
    if busca:
        query = query.where(Event.title.contains(busca))
    if category_id:
        query = query.where(Event.category_id == category_id)
    if most_recent:
        query.order_by(desc(Event.created_at))
    elif most_likes:
        query.order_by(asc(Event.likes))
    elif closest: ## por evento mais próximo(em módulo) da data atual
        query.order_by(asc(abs(func.now()-Event.start_date)))
        
    total_eventos = len(session.exec(query).all())
    eventos = session.exec(query.offset(offset).limit(limite)).all()
    
    return {
        "pagina_atual": pagina,
        "total_eventos": total_eventos,
        "dados": eventos
    }

# Listar Eventos de Quem Você Segue (Feed Personalizado)
@router.get("/seguindo", status_code=status.HTTP_200_OK)
def list_following_events(
    pagina: int = Query(1, ge=1), 
    limite: int = Query(20, ge=1, le=100), 
    current_user: User = Depends(get_actual_user), 
    session: Session = Depends(get_session)
):
    offset = (pagina - 1) * limite
    
    stmt_seguindo = select(Follower.id_following).where(Follower.id_follower == current_user.id)
    query = select(Event).where(Event.user_id.in_(stmt_seguindo))
    eventos = session.exec(query.offset(offset).limit(limite)).all()

    return {"pagina_atual": pagina, "dados": eventos}


### --- 2. DETALHES, EDIÇÃO E DELEÇÃO --- ###

# Ver Detalhes do Evento
@router.get("/{evento_id}", status_code=status.HTTP_200_OK, response_model=EventResponseSchema)
def get_event_details(evento_id: int, session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
    
    return event

# Editar Evento
@router.patch("/{evento_id}", status_code=status.HTTP_200_OK, response_model=EventResponseSchema)
def update_event(evento_id: int, event_data: EventUpdateSchema, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    if event.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar este evento.")
    
    for key, value in event_data.model_dump(exclude_unset=True).items():
        if hasattr(event, key) and key not in ["id", "user_id", "created_at", "likes"]:
            setattr(event, key, value)
            
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

# Cancelar / Excluir Evento
@router.delete("/{evento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(evento_id: int, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    if event.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para excluir este evento.")
        
    # Deleção Direta
    session.delete(event)
    session.commit()
    return


### --- 3. INTERAÇÕES E ENGAJAMENTO --- ###

# Curtir Evento
@router.post("/{evento_id}/curtir", status_code=status.HTTP_200_OK)
def like_event(evento_id: int, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    stmt = select(Likes).where(Likes.user_id == current_user.id, Likes.event_id == evento_id)
    curtida_existente = session.exec(stmt).first()
    
    if curtida_existente:
        session.delete(curtida_existente)
        event.likes -= 1
        mensagem = "Curtida removida."
    else:
        nova_curtida = Likes(user_id=current_user.id, event_id=evento_id)
        session.add(nova_curtida)
        event.likes += 1
        mensagem = "Evento curtido com sucesso."
        
    session.add(event)
    session.commit()
    return {"mensagem": mensagem}

# Demonstrar Interesse (Vagas)
@router.post("/{evento_id}/interesse", status_code=status.HTTP_200_OK)
def interest_event(evento_id: int, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    stmt = select(Interests).where(Interests.user_id == current_user.id, Interests.event_id == evento_id)
    interesse_existente = session.exec(stmt).first()
    
    if interesse_existente:
        session.delete(interesse_existente)
        session.commit()
        return {"mensagem": "Interesse removido. Vaga liberada."}
        
    # Como 'limite_pessoas' não foi implementado ainda, registrei o interesse diretamente
    novo_interesse = Interests(user_id=current_user.id, event_id=evento_id)
    session.add(novo_interesse)
    session.commit()
    return {"mensagem": "Interesse registrado com sucesso!"}

# Comentar em um Evento
@router.post("/{evento_id}/comentarios", status_code=status.HTTP_201_CREATED)
def add_comment(evento_id: int, comment_data: CommentCreateSchema, current_user: User = Depends(get_actual_user), session: Session = Depends(get_session)):
    new_comment = Comment(content=comment_data.content, user_id=current_user.id, event_id=evento_id)
    session.add(new_comment)
    session.commit()
    return {"mensagem": "Comentário adicionado."}


### --- 4. GESTÃO DE IMAGENS DO EVENTO --- ###

# Adicionar Foto ao Evento
@router.post("/{evento_id}/fotos", status_code=status.HTTP_201_CREATED)
async def upload_event_photo(
    evento_id: int, 
    file: UploadFile = File(...), 
    current_user: User = Depends(get_actual_user),
    session: Session = Depends(get_session)
):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
    if event.user_id != current_user.id:
       raise HTTPException(status_code=403, detail="Apenas o organizador pode adicionar fotos.")

    upload_dir = "app/static/defaults"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_name = f"event_{evento_id}_{file.filename}"
    file_path = f"{upload_dir}/{file_name}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_path = f"static/defaults/{file_name}"
    
    # Atualiza a coluna banner (como a tabela event_picture ainda não existe no models.py)
    event.banner = db_path
    session.add(event)
    session.commit()
    
    return {"mensagem": "Foto do evento (banner) adicionada com sucesso.", "url": db_path}
### ATENÇÃO LEO! QUANDO FOR MECHER AQUI SIGA O MEDELO QUE ESTÁ NO AUTH.PY PARA PADRONIZAR O PROJETO
### SEGUIR O MODELO, ESTOU QUERENDO DIZER PARA CRIAR TIPOS PARA OS ARGUMENTOS DE CADA FUNÇÃO E CRIAR TIPOS PARA OS RETURNS(SE QUISER SABER O PQ MANDA UM SALVE NO ZAP)
#### OS TIPOS ESTÃO NO ARQUIVO SCHEMA.PY, USAR ROUTER TAMBÉM DEPOS QUE TERMINAR A ROTA ADD ELA NA MAIN Q NEM EU FIZ, O RETORNA DA FUÇÃO CASO DE ERRO USE O HTTMeXEPECTION IGUAL NO AUTH.PY
### SE DER BOM A FUNÇÃO, COLOCA O STATUS CODE, LÁ EM CIMA DELA(DO LADO DA ROTA)
### O RETURN DA FUNÇÃO É TAMBÉM TIPADO DO LADO DA ROTA, ISSO FAZ COM QUE O RETURN SEJA FILTRADO!! POR EXEMPLO NA FUNÇÃO DE CADASTRAR O USUÁRIO, EU RETORNO O USER COMPLETO, PORÉM VAI SER FILTRADO COM BASE NO TIPO QUE COLOQUEI LÁ
