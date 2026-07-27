import pytest

def test_access_with_invalid_api_key(client):
    """Garante que tentar acessar a API com a chave do front-end errada gera Erro 401."""
    
    # Sobrescreve a chave correta injetada no conftest por uma maliciosa
    client.headers.update({"apiKey": "TENTATIVA_DE_INVASAO_123"})
    
    # Tenta bater em uma rota pública
    response = client.get("/eventos/")
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Acesso negado. API Key inválida ou ausente."


def test_access_without_header_api_key(client):
    """Garante que a ausência total do header apiKey bloqueia a requisição (Erro 401)."""
    
    # Removemos o header padrão apenas para o escopo desta requisição
    del client.headers["apiKey"]
    
    # Tenta bater em uma rota pública
    response = client.get("/eventos/")
    
    assert response.status_code == 401
    assert response.json()["detail"] == "Acesso negado. API Key inválida ou ausente."