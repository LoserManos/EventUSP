# EventUSP - Task Management API

Uma API  para a plataforma EventUSP. O projeto utiliza FastAPI para o backend, SQLModel para a persistência de dados.

## Tecnologias Utilizadas

* FastAPI: Framework web de alta performance para Python.
* SQLModel: Biblioteca para interação com bancos de dados SQL utilizando modelos Python.
* Docker: Containerização do ambiente para garantir consistência entre diferentes máquinas de desenvolvimento.

## Requisitos Previos

* Docker instalado e configurado.
* Docker Compose.

## Instalacao e Execucao

Para rodar o projeto em seu ambiente local, siga os passos abaixo:

1. Clone o repositorio:
   ```bash
   git clone <url-do-repositorio>
   cd EventUSP-back-end
2. Subir o container
    ```bash
    docker-compose up --build
3. Acesso a aplicação
    http://localhost:8000
4. Documentação do projeto
    https://github.com/LoserManos/EventUSP