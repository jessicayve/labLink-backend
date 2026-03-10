# LabLink Backend

Backend do projeto **LabLink**, uma API REST para uma rede social simples, desenvolvida com Node.js, Express, TypeScript, SQLite, autenticação com JWT e criptografia de senha com bcrypt.

## Deploy

🔗 API: https://lablink-backend-739w.onrender.com

---

## Sobre o projeto

O backend do **LabLink** foi desenvolvido para fornecer a base de autenticação e gerenciamento de posts da aplicação.

A API permite:

- cadastro de usuários
- login com autenticação JWT
- criação de posts
- listagem de posts
- likes e dislikes
- contagem de comentários

O objetivo deste projeto é demonstrar conhecimentos em desenvolvimento **full stack**, construção de API REST, autenticação e organização de arquitetura backend.

---

## Tecnologias utilizadas

- Node.js
- Express
- TypeScript
- SQLite
- Knex
- JWT
- bcrypt

---

## Funcionalidades

- Signup de usuários
- Login com geração de token JWT
- Proteção de rotas autenticadas
- Criação de posts
- Listagem de posts
- Like e dislike em posts
- Estrutura organizada em camadas

---

## Estrutura do projeto

src
 ┣ business
 ┣ controller
 ┣ database
 ┣ dtos
 ┣ errors
 ┣ models
 ┣ router
 ┣ services
 ┣ types
 ┗ index.ts

---

## Como rodar o projeto localmente

1. Clone o repositório

git clone https://github.com/jessicayve/labLink-backend.git

2. Acesse a pasta do projeto

cd labLink-backend

3. Instale as dependências

npm install

4. Configure o arquivo `.env`

Exemplo:

PORT=3003  
DB_FILE_PATH=./lablink.db  
JWT_KEY=sua_chave_secreta  
JWT_EXPIRES_IN=1d  
BCRYPT_COST=12  

5. Rode o projeto em desenvolvimento

npm run dev

Ou para build e produção:

npm run build  
npm run start

---

## Endpoints principais

Usuários

Signup  
POST /users/signup

Login  
POST /users/login

Posts

Buscar posts  
GET /posts

Criar post  
POST /posts

Like ou dislike  
PUT /posts/:id/like

---

## Autenticação

As rotas protegidas utilizam token JWT enviado no header:

Authorization: SEU_TOKEN

---

## Observação importante

⚠️ **Este projeto não possui persistência de dados garantida no ambiente de deploy.**

Como a aplicação está hospedada em ambiente gratuito e utiliza SQLite, os dados podem não permanecer salvos de forma permanente no deploy.

Isso significa que cadastros, posts ou outras informações podem ser resetados, perdidos ou recriados em determinados momentos.

O projeto foi desenvolvido com foco em **aprendizado, prática de arquitetura backend e composição de portfólio**, e não como aplicação final de produção.

---

## Arquitetura

O projeto segue separação em camadas para facilitar manutenção e escalabilidade:

Controller  
Responsável por receber as requisições e enviar respostas.

Business  
Contém as regras de negócio da aplicação.

Database  
Faz a comunicação com o banco de dados.

Models / DTOs  
Organizam os dados e contratos utilizados na aplicação.

Services  
Responsáveis por autenticação, geração de id, hash de senha e criação de tokens.

---

## Melhorias futuras

- Persistência mais robusta com banco em produção
- CRUD completo de comentários
- Edição e exclusão de posts
- Perfil de usuário
- Paginação no feed
- Melhor tratamento de erros
- Testes automatizados

---

## Autora

Desenvolvido por **Jessica Yve**  
GitHub: https://github.com/jessicayve
