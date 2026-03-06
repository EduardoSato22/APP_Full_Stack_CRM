# RetailFlow · CRM de Clientes e Catálogo de Produtos

![Java](https://img.shields.io/badge/Java-17-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-green) ![React](https://img.shields.io/badge/React-18-blue) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)

RetailFlow é um CRM acadêmico completo criado para a disciplina **Frameworks Web II (Unilavras)**. O backend (Spring Boot) expõe uma API segura com JWT e JPA, enquanto o frontend (React + Vite) entrega uma experiência responsiva para gerenciar clientes e produtos.

---

## Principais Recursos
- CRUD completo de clientes e produtos, com relacionamento por usuário
- Autenticação e autorização por JWT e Spring Security
- Documentação viva via Swagger/OpenAPI
- Deploy pensado para Render (backend) e Vercel (frontend)
- Scripts e infraestrutura preparados para testes locais com Postgres ou H2

---

## Arquitetura
- **Backend**: Java 17, Spring Boot, Spring Data JPA, Spring Security, JWT, PostgreSQL/H2, Maven, springdoc-openapi
- **Frontend**: React 18, TypeScript, Vite, React Router DOM, Material UI, Axios

```
retailflow/
├── backend/    # API REST (Java/Spring)
├── frontend/   # Single Page Application (React)
├── docker-compose.yml
└── README.md
```

---

## Requisitos de Ambiente
- Java 17+
- Maven 3.6+
- Node.js 18+ (ou pnpm/yarn equivalente)
- Docker + Docker Compose (opcional, mas recomendado)

---

## Variáveis de Ambiente e Proteção de Segredos
Nenhuma credencial é versionada no repositório. Antes de executar o projeto, crie um arquivo `.env` na raiz e defina somente valores não sensíveis ou placeholders. Exemplo:

```env
# Banco
POSTGRES_DB=taskflowdb
POSTGRES_USER=taskflow
POSTGRES_PASSWORD=defina_sua_senha_forte
POSTGRES_PORT=5432

# Aplicação
SPRING_PROFILES_ACTIVE=production
JWT_SECRET=troque_por_um_token_hexadecimal
BACKEND_PORT=8080
FRONTEND_PORT=5173
VITE_API_URL=http://backend:8080/api
```

Diretrizes:
- Não compartilhe `.env` (adicione ao `.gitignore`).
- Gere o `JWT_SECRET` com pelo menos 32 bytes.
- Para desenvolvimento manual, configure `frontend/.env.local` com `VITE_API_URL=http://localhost:8080/api`.

---

## Execução Local

### Opção A · Stack completa com Docker
```bash
docker compose up --build
```
- Backend: `http://localhost:${BACKEND_PORT:-8080}`
- Frontend: `http://localhost:${FRONTEND_PORT:-5173}`
- PostgreSQL: mapeado para `localhost:${POSTGRES_PORT:-5432}`

### Opção B · Execução manual para testes rápidos
1. **Backend (perfil local com H2):**
   ```bash
   cd backend
   mvn spring-boot:run "-Dspring-boot.run.profiles=local"
   ```
   Porta padrão: `http://localhost:8080`

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Porta padrão: `http://localhost:5173`

> O arquivo `backend/src/main/resources/data.sql` popula dados de exemplo apenas no perfil local; mantenha-o desabilitado em produção se não desejar dados padrão.

---

## Documentação e Endpoints
- Swagger UI local: `http://localhost:8080/swagger-ui.html`
- Swagger UI produção: `https://<seu-backend>/swagger-ui.html`
- Coleção de testes da disciplina: `frontend/docs/TESTES_API.md`

Endpoints principais:
- `POST /api/auth/register` · `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/customers`
- `GET/POST/PUT/DELETE /api/products`
Todas as rotas protegidas exigem `Authorization: Bearer <token>`.

---

## Deploy e Produção
1. **Backend (Render, Railway, etc.)**
   - Configure as mesmas variáveis do `.env` no provedor (não copie o arquivo).
   - Ajuste `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` e `SPRING_DATASOURCE_PASSWORD` para o Postgres de produção.
   - Atualize `CORS_ALLOWED_ORIGINS` (caso utilize essa property) com o domínio do frontend.

2. **Frontend (Vercel, Netlify…)**
   - Defina `VITE_API_URL` para o domínio público do backend.
   - Execute `npm run build` durante o deploy.

3. **Docker Compose em produção**
   - Use um `.env` dedicado no servidor.
   - Provisione volumes persistentes para `postgres_data`.
   - Utilize um proxy reverso/HTTPS (Caddy, Nginx, Traefik) para expor o frontend/back-end publicamente.

---

## Testes e Qualidade
- Backend: `cd backend && mvn test`
- Frontend (build check): `cd frontend && npm run build`

Recomenda-se executar os testes após qualquer alteração de modelo ou contrato de API.

---

## Segurança e Boas Práticas
- Senhas armazenadas com BCrypt.
- Tokens JWT possuem expiração configurável (24h por padrão).
- Perfis `local`, `production` e variáveis externas evitam hardcode de credenciais.
- Nunca faça commit de chaves, senhas ou tokens. Em produção, prefira secret managers (Render Secrets, AWS SSM, etc.).

---

## Troubleshooting
- **Porta em uso**: ajuste `BACKEND_PORT`/`FRONTEND_PORT` no `.env`.
- **Frontend não acessa a API**: confirme `VITE_API_URL` e as regras de CORS.
- **Falha no banco**: valide `POSTGRES_*` e se o volume `postgres_data` possui permissões corretas.
- **Erro de autenticação**: gere um novo token via `/api/auth/login` e verifique expiração.

---

Projeto desenvolvido para fins acadêmicos. Para dúvidas adicionais, consulte a documentação do Swagger ou o guia `frontend/docs/TESTES_API.md`. Última atualização: novembro/2025.

