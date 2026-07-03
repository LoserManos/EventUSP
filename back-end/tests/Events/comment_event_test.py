import pytest
from sqlmodel import Session, select
from app.models import Event

def test_comentar_com_espacos_vazios(client):
    """Garante que a API bloqueia comentários que contenham apenas espaços em branco."""
    
    # 1. Criar usuário, logar e criar um evento alvo
    user_body = {"name": "Comentarista", "email": "comenta@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_body = {
        "title": "Roda de Conversa",
        "start_date": "2027-05-10T14:00:00",
        "duration": 60,
        "local": "Pátio",
        "category_id": 4
    }
    evento_id = client.post("/eventos/", json=evento_body, headers=headers).json()["evento_id"]

    # 2. Tentar enviar comentário só com espaços e tabulações
    response = client.post(f"/eventos/{evento_id}/comentarios", json={"content": "   \n \t   "}, headers=headers)

    # 3. O Pydantic deve barrar na porta
    assert response.status_code == 422
    assert "content" in response.text