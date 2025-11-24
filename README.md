# RetailFlow - Sistema CRM de Clientes e Catálogo de Produtos

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green) ![React](https://img.shields.io/badge/React-18-blue) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

## 📋 Descrição do Projeto

**RetailFlow** é uma aplicação full stack desenvolvida para a disciplina **Frameworks Web II** da Unilavras. O sistema permite o gerenciamento completo de clientes e produtos, com autenticação segura via JWT e interface moderna construída com React e Material-UI.

### Funcionalidades Principais

- ✅ **CRUD completo de Clientes**: Cadastro, listagem, edição e remoção de clientes com foto
- ✅ **CRUD completo de Produtos**: Gerenciamento de produtos com descrição e preço
- ✅ **Autenticação JWT**: Sistema seguro de login e registro de usuários
- ✅ **Dashboard Interativo**: Visão geral com estatísticas e navegação intuitiva
- ✅ **Interface Responsiva**: Design moderno e adaptável a diferentes dispositivos


## 🚀 Tecnologias Utilizadas

### Backend
- **Java 17+**
- **Spring Boot 3.2.0**
- **Spring Data JPA** (persistência de dados)
- **Spring Security + JWT** (autenticação e autorização)
- **PostgreSQL** (Aiven) / **H2** (testes locais)
- **Lombok** (redução de boilerplate)
- **Maven** (gerenciamento de dependências)
- **springdoc-openapi** (documentação Swagger)

### Frontend
- **React 18.2**
- **TypeScript**
- **Vite** (build tool)
- **React Router DOM** (roteamento)
- **Material-UI (MUI) 5** (componentes de UI)
- **Axios** (requisições HTTP)
- **React Hook Form** (formulários)

## 📊 Modelagem do Banco de Dados

O sistema possui **3 entidades principais** com relacionamentos:

### Entidades

1. **User** (Usuário)
   - `id`, `name`, `email`, `password`, `created_at`

2. **Customer** (Cliente)
   - `id`, `first_name`, `last_name`, `email`, `age`, `photo_url`, `created_at`, `updated_at`, `user_id`
   - **Relacionamento**: Muitos-para-Um com `User`

3. **Product** (Produto)
   - `id`, `name`, `description`, `price`, `created_at`, `last_updated`, `user_id`
   - **Relacionamento**: Muitos-para-Um com `User`

### Diagrama de Relacionamento

```
User (1) ──< (N) Customer
User (1) ──< (N) Product
```

## 🔧 Como Executar o Projeto Localmente

### Pré-requisitos

- **Java 17** ou superior
- **Maven 3.6+**
- **Node.js 18+** e **npm**

### 1. Clonar o Repositório

```bash
git clone https://github.com/
cd retailflow
```

### 2. Configurar e Executar o Backend

```bash
cd backend

# O projeto usa H2 em memória para desenvolvimento local
# Nenhuma configuração adicional é necessária

# Executar a aplicação
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

O backend estará disponível em `http://localhost:8080`

**Variáveis de Ambiente (Opcional para produção):**

Se quiser usar PostgreSQL local ou configurar para produção, edite `src/main/resources/application-production.properties`:

```properties
spring.datasource.url=jdbc:postgresql://seu-host:porta/database
spring.datasource.username=seu-usuario
spring.datasource.password=sua-senha
```

### 3. Configurar e Executar o Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

**Variável de Ambiente (Opcional):**

Crie um arquivo `.env` na pasta `frontend` se quiser customizar a URL da API:

```env
VITE_API_URL=http://localhost:8080/api
```

### 4. Acessar a Aplicação

1. Abra o navegador em `http://localhost:5173`
2. Crie uma conta ou faça login com:
   - **Email**: `demo@retailflow.com`
   - **Senha**: `123456` (usuário demo criado automaticamente)

### 5. Acessar a Documentação Swagger

Após iniciar o backend, acesse:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **API Docs (JSON)**: `http://localhost:8080/api-docs`

## 📡 Endpoints da API

### Autenticação (Públicos)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Registrar novo usuário |
| `POST` | `/api/auth/login` | Fazer login e obter token JWT |

### Clientes (Protegidos - Requer JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/customers` | Listar todos os clientes do usuário |
| `POST` | `/api/customers` | Criar novo cliente |
| `GET` | `/api/customers/{id}` | Buscar cliente por ID |
| `PUT` | `/api/customers/{id}` | Atualizar cliente |
| `DELETE` | `/api/customers/{id}` | Remover cliente |

### Produtos (Protegidos - Requer JWT)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/api/products` | Listar todos os produtos do usuário |
| `POST` | `/api/products` | Criar novo produto |
| `GET` | `/api/products/{id}` | Buscar produto por ID |
| `PUT` | `/api/products/{id}` | Atualizar produto |
| `DELETE` | `/api/products/{id}` | Remover produto |

> **Nota**: Todos os endpoints protegidos exigem o header `Authorization: Bearer <token>`

## 🌐 Links de Deploy

### Frontend (Vercel)
🔗 **https://seu-frontend.vercel.app**


### Backend (Render)
🔗 **https://seu-backend.onrender.com**


### Documentação Swagger (Produção)
🔗 **https://seu-backend.onrender.com/swagger-ui.html**


## 📚 Documentação Adicional

- **Guia de Testes da API**: `frontend/docs/TESTES_API.md`
- **Swagger UI Local**: `http://localhost:8080/swagger-ui.html`

## ✅ Checklist de Requisitos

### Requisitos Essenciais (15 pontos)

#### Backend
- ✅ API RESTful com Spring Boot
- ✅ Spring Data JPA com PostgreSQL no Aiven (H2 para local)
- ✅ Mínimo 2 entidades relacionadas (User, Customer, Product)
- ✅ CRUD completo para Customer e Product

#### Frontend
- ✅ Consumo de API com Axios
- ✅ Roteamento com React Router DOM
- ✅ Componentização e uso de Hooks (useState, useEffect)
- ✅ Estilização com Material-UI
- ✅ Indicadores de loading e tratamento de erros

#### Deploy
- [x] Frontend publicado no Vercel
- [x] Backend publicado no Render
- [x] CORS configurado corretamente

### Bônus (+5 pontos)

- [x] Autenticação JWT implementada
- [x] Rotas protegidas com Spring Security
- [x] Endpoints `/auth/login` e `/auth/register`
- [x] Frontend com telas de Login/Registro
- [x] Token JWT enviado no header Authorization
- [x] Swagger/OpenAPI configurado
- [x] Todos os endpoints documentados
- [x] Swagger UI disponível no deploy

## 🗂 Estrutura do Projeto

```
retailflow/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskflow/
│   │   │   │   ├── config/          # Configurações (OpenAPI, Security)
│   │   │   │   ├── controller/      # Controllers REST
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # Entidades JPA
│   │   │   │   ├── repository/      # Repositories JPA
│   │   │   │   ├── security/        # JWT e Security Config
│   │   │   │   ├── service/         # Lógica de negócio
│   │   │   │   └── TaskFlowApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── application-local.properties
│   │   │       ├── application-production.properties
│   │   │       └── data.sql         # Script de dados iniciais
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── App.tsx                  # Componente principal
│   │   ├── main.tsx
│   │   └── index.css
│   ├── docs/
│   │   └── TESTES_API.md           # Guia de testes
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🔒 Segurança

- ✅ Senhas criptografadas com **BCrypt**
- ✅ Autenticação via **JWT** com expiração de 24 horas
- ✅ Rotas protegidas com **Spring Security**
- ✅ **CORS** configurado para permitir apenas origens autorizadas
- ✅ Validação de dados com **Bean Validation**
- ✅ Proteção contra SQL Injection (via JPA)

## 🧪 Testes

### Backend

```bash
cd backend
mvn test
```

### Frontend

```bash
cd frontend
npm run build  # Verifica se compila sem erros
```

## 📝 Notas de Desenvolvimento

- O projeto usa **H2 em memória** para desenvolvimento local (dados são perdidos ao reiniciar)
- Para produção, configure o **PostgreSQL no Aiven** editando `application-production.properties`
- O arquivo `data.sql` cria um usuário demo automaticamente ao iniciar em modo local
- Todas as requisições protegidas devem incluir o token JWT no header `Authorization`

## 🐛 Troubleshooting

### Backend não inicia

- Verifique se a porta 8080 está livre
- Confirme que o Java 17+ está instalado: `java -version`
- Verifique os logs no console para erros de configuração

### Frontend não conecta com o backend

- Confirme que o backend está rodando em `http://localhost:8080`
- Verifique a variável `VITE_API_URL` no `.env` ou no código
- Verifique o console do navegador para erros de CORS

### Erro de autenticação

- Verifique se o token JWT está sendo enviado no header
- Confirme que o token não expirou (24 horas)
- Faça login novamente para obter um novo token

## 📞 Suporte

Em caso de dúvidas ou problemas:

1. Verifique a documentação do Swagger: `http://localhost:8080/swagger-ui.html`
2. Consulte o guia de testes: `frontend/docs/TESTES_API.md`
3. Entre em contato com os integrantes do grupo

---

**Desenvolvido com ❤️ para a disciplina Frameworks Web II - Unilavras**

*Última atualização: Novembro 2025*

