from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlmodel import Session, select
from typing import Optional
import os
import shutil

from app.database import get_session
#Aqui to importando os models q vc vai criar. Além disso, tb estou importando o get_current_user
from app.models import Event, User
from app.auth import get_current_user

router = APIRouter(
    prefix="/eventos",
    tags=["Eventos"]
)

### --- 1. CRIAÇÃO E LISTAGEM (FEED) --- ###

# Criar Novo Evento
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_event(event_data: dict, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # O organizador é automaticamente o usuário logado
    # new_event = Event(**event_data, user_id=current_user.id)
    # session.add(new_event)
    # session.commit()
    # session.refresh(new_event)
    
    return {"mensagem": "Evento criado com sucesso!"}

# Listar Eventos (Feed Geral)
@router.get("/", status_code=status.HTTP_200_OK)
def list_events(
    pagina: int = Query(1, ge=1), 
    limite: int = Query(20, ge=1, le=100),
    busca: Optional[str] = None,
    tag: Optional[str] = None,
    session: Session = Depends(get_session)
):
    offset = (pagina - 1) * limite
    query = select(Event)
    
    if busca:
        query = query.where(Event.title.contains(busca))
    if tag:
        # Assumindo uma coluna ou tabela de tags futuramente
        pass
        
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
    pagina: int = 1, limite: int = 20, 
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    offset = (pagina - 1) * limite
    # stmt_seguindo = select(Follower.id_following).where(Follower.id_follower == current_user.id)
    # query = select(Event).where(Event.user_id.in_(stmt_seguindo))
    # eventos = session.exec(query.offset(offset).limit(limite)).all()

    return [{"pagina_atual": pagina, "dados": []}]


### --- 2. DETALHES, EDIÇÃO E DELEÇÃO --- ###

# Ver Detalhes do Evento
@router.get("/{evento_id}", status_code=status.HTTP_200_OK)
def get_event_details(evento_id: int, session: Session = Depends(get_session)):
    # event = session.get(Event, evento_id)
    # if not event:
    #     raise HTTPException(status_code=404, detail="Evento não encontrado.")
    
    # Aqui o retorno vai compilar os dados do evento + arrays de fotos e comentários
    return {"id": evento_id, "titulo": "Detalhes em construção", "fotos": [], "comentarios": []}

# Editar Evento
@router.patch("/{evento_id}", status_code=status.HTTP_200_OK)
def update_event(evento_id: int, event_data: dict, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    # Validação  de segurança para não deixar um cara que não é o dono editar
    if event.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para editar este evento.")
    
    # Substituição do comentário: atualiza os dados permitidos dinamicamente
    for key, value in event_data.items():
        if hasattr(event, key) and key not in ["id", "user_id", "created_at"]:
            setattr(event, key, value)
            
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

# Cancelar / Excluir Evento
@router.delete("/{evento_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(evento_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    # Validação de segurança para não deixar um cara que não é o dono excluir o evento
    if event.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Você não tem permissão para excluir este evento.")
        
    session.delete(event)
    session.commit()
    return


### --- 3. INTERAÇÕES E ENGAJAMENTO --- ###

# Curtir Evento
@router.post("/{evento_id}/curtir", status_code=status.HTTP_200_OK)
def like_event(evento_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    # verifica se a curtida existe. Se sim, remove (Descurtir). Se não, adiciona.
    # stmt = select(Likes).where(Likes.user_id == current_user.id, Likes.event_id == evento_id)
    # curtida_existente = session.exec(stmt).first()
    
    # if curtida_existente:
    #     session.delete(curtida_existente)
    #     event.likes -= 1
    #     mensagem = "Curtida removida."
    # else:
    #     nova_curtida = Likes(user_id=current_user.id, event_id=evento_id)
    #     session.add(nova_curtida)
    #     event.likes += 1
    #     mensagem = "Evento curtido com sucesso."
        
    # session.add(event)
    # session.commit()
    return {"mensagem": mensagem}

# Demonstrar Interesse (Vagas)
@router.post("/{evento_id}/interesse", status_code=status.HTTP_200_OK)
def interest_event(evento_id: int, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    event = session.get(Event, evento_id)
    if not event:
        raise HTTPException(status_code=404, detail="Evento não encontrado.")
        
    # controle de vagas e alternância de interesse
    # stmt = select(Interests).where(Interests.user_id == current_user.id, Interests.event_id == evento_id)
    # interesse_existente = session.exec(stmt).first()
    
    # if interesse_existente:
    #     session.delete(interesse_existente)
    #     session.commit()
    #     return {"mensagem": "Interesse removido. Vaga liberada."}
        
    # # Se não existe interesse, valida se há vagas disponíveis
    # # stmt_contagem = select(Interests).where(Interests.event_id == evento_id)
    # # total_interessados = len(session.exec(stmt_contagem).all())
    # # if total_interessados >= event.limite_pessoas:
    # #     raise HTTPException(status_code=400, detail="Não há vagas disponíveis para este evento.")
        
    # novo_interesse = Interests(user_id=current_user.id, event_id=evento_id)
    # session.add(novo_interesse)
    # session.commit()
    return {"mensagem": "Interesse registrado com sucesso!"}

# Comentar em um Evento
@router.post("/{evento_id}/comentarios", status_code=status.HTTP_201_CREATED)
def add_comment(evento_id: int, comment_data: dict, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    # new_comment = Comment(texto=comment_data['texto'], user_id=current_user.id, event_id=evento_id)
    return {"mensagem": "Comentário adicionado."}


### --- 4. GESTÃO DE IMAGENS DO EVENTO --- ###

# Adicionar Foto ao Evento
@router.post("/{evento_id}/fotos", status_code=status.HTTP_201_CREATED)
async def upload_event_photo(
    evento_id: int, 
    file: UploadFile = File(...), 
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # event = session.get(Event, evento_id)
    # if event.user_id != current_user.id:
    #    raise HTTPException(status_code=403, detail="Apenas o organizador pode adicionar fotos.")

    upload_dir = f"uploads/eventos/{evento_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_path = f"{upload_dir}/{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    foto_url = f"https://api.eventusp.com/{file_path}"
    
    # Lógica: Salvar a `foto_url` na nova tabela `event_picture` vinculada ao evento_id
    
    return {"mensagem": "Foto adicionada com sucesso.", "url": foto_url}

# Listar Fotos do Evento
@router.get("/{evento_id}/fotos", status_code=status.HTTP_200_OK)
def list_event_photos(evento_id: int, session: Session = Depends(get_session)):
    # Lógica: buscar todas as URLs da tabela `event_picture` onde event_id == evento_id
    return [{"id_foto": 1, "url": "https://api.eventusp.com/uploads/eventos/exemplo.jpg"}]
### ATENÇÃO LEO! QUANDO FOR MECHER AQUI SIGA O MEDELO QUE ESTÁ NO AUTH.PY PARA PADRONIZAR O PROJETO
### SEGUIR O MODELO, ESTOU QUERENDO DIZER PARA CRIAR TIPOS PARA OS ARGUMENTOS DE CADA FUNÇÃO E CRIAR TIPOS PARA OS RETURNS(SE QUISER SABER O PQ MANDA UM SALVE NO ZAP)
#### OS TIPOS ESTÃO NO ARQUIVO SCHEMA.PY, USAR ROUTER TAMBÉM DEPOS QUE TERMINAR A ROTA ADD ELA NA MAIN Q NEM EU FIZ, O RETORNA DA FUÇÃO CASO DE ERRO USE O HTTMeXEPECTION IGUAL NO AUTH.PY
### SE DER BOM A FUNÇÃO, COLOCA O STATUS CODE, LÁ EM CIMA DELA(DO LADO DA ROTA)
### O RETURN DA FUNÇÃO É TAMBÉM TIPADO DO LADO DA ROTA, ISSO FAZ COM QUE O RETURN SEJA FILTRADO!! POR EXEMPLO NA FUNÇÃO DE CADASTRAR O USUÁRIO, EU RETORNO O USER COMPLETO, PORÉM VAI SER FILTRADO COM BASE NO TIPO QUE COLOQUEI LÁ
