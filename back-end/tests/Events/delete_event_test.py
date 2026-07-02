import pytest
from sqlmodel import Session, select
from app.models import Event

def test_deletar_evento_com_sucesso(client):
    """Garante que o dono do evento consegue eliminá-lo e que ele desaparece do banco."""
    
    user_body = {"name": "Organizador Desistente", "email": "cancelar@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    evento_body = {
        "title": "Churrasco Cancelado",
        "start_date": "2027-11-20T12:00:00",
        "duration": 180,
        "local": "Canteiro do IME",
        "category_id": 1
    }
    resp_criacao = client.post("/eventos/", json=evento_body, headers=headers)
    evento_id = resp_criacao.json()["evento_id"]

    # O dono envia o pedido de exclusão
    response_delete = client.delete(f"/eventos/{evento_id}", headers=headers)

    # Deve retornar 204
    assert response_delete.status_code == 204

    # Tentar aceder aos detalhes do evento apagado
    response_get = client.get(f"/eventos/{evento_id}")
    assert response_get.status_code == 404  # Garante que ele foi deletado


def test_deletar_evento_de_outro_usuario(client):
    """Garante que um usuário não consegue apagar o evento de outra pessoa."""
    
    dono_body = {"name": "Dono Legitimo", "email": "dono_real@teste.com", "password": "123"}
    client.post("/auth/signup", json=dono_body)
    token_dono = client.post("/auth/login", json=dono_body).json()["access_token"]
    
    evento_body = {
        "title": "Palestra Magna Intocavel",
        "start_date": "2027-10-10T14:00:00",
        "duration": 60,
        "local": "Auditório Jacy Monteiro",
        "category_id": 4
    }
    evento_id = client.post("/eventos/", json=evento_body, headers={"Authorization": f"Bearer {token_dono}"}).json()["evento_id"]

    # Invasor tenta fazer login
    invasor_body = {"name": "Intruso", "email": "intruso@teste.com", "password": "123"}
    client.post("/auth/signup", json=invasor_body)
    token_invasor = client.post("/auth/login", json=invasor_body).json()["access_token"]
    headers_invasor = {"Authorization": f"Bearer {token_invasor}"}

    # Invasor tenta apagar o evento do dono legítimo
    response = client.delete(f"/eventos/{evento_id}", headers=headers_invasor)

    # Deve retornar 403 Forbidden
    assert response.status_code == 403
    assert response.json()["detail"] == "Você não tem permissão para excluir este evento."


def test_deletar_evento_inexistente(client):
    """Garante que tentar apagar um evento que não existe retorna Erro 404."""
    
    user_body = {"name": "Eliminador", "email": "delete_404@teste.com", "password": "123"}
    client.post("/auth/signup", json=user_body)
    token = client.post("/auth/login", json=user_body).json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Tentar apagar o ID 9999
    response = client.delete("/eventos/9999", headers=headers)
    
    assert response.status_code == 404


def test_deletar_evento_sem_autenticacao(client):
    """Garante que utilizadores não autenticados são bloqueados antes de qualquer checagem."""
    
    # Tentar apagar sem passar nenhuma credencial ou header
    response = client.delete("/eventos/1")
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"