# RetailFlow CRM

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema empresarial completo de **CRM, pipeline de negócios e gestão de vendas** — demonstração técnica de desenvolvimento pleno/sênior Java + React.

> **Demo ao vivo → [retailflow-front.vercel.app](https://retailflow-front.vercel.app)**

---

## Acesso rápido

Na tela de login, clique em um dos botões de acesso rápido para entrar instantaneamente:

| Perfil | Email | Senha | Permissões |
|--------|-------|-------|------------|
| Administrador | `admin@retailflow.demo` | `Admin123` | Acesso total |
| Gerente | `manager@retailflow.demo` | `Manager123` | Leitura + edição |
| Vendedor | `sales@retailflow.demo` | `Sales123` | Somente os próprios registros |

Login social disponível via **Google** e **GitHub** (OAuth2).

---

## Funcionalidades

### Dashboard Analítico
- KPIs em tempo real: clientes ativos, pipeline total, receita do mês, taxa de conversão
- Gráfico de receita mensal (12 meses) com Recharts
- Funil de vendas por estágio e distribuição de clientes por status
- Cache por usuário via Redis — invalidação seletiva a cada mutação

### CRM de Clientes
- Cadastro completo: empresa, cargo, endereço, tags, notas, foto de perfil
- Pipeline de status: Lead → Prospect → Ativo → Inativo/Churned
- Fontes de aquisição: Orgânico, Indicação, ADS, Cold Outreach, Evento
- Histórico de receita e filtros avançados (status, fonte, busca por nome/email)

### Pipeline de Negócios — Kanban
- Board drag-and-drop (dnd-kit) com 6 estágios: Prospecção, Qualificado, Proposta, Negociação, Ganho, Perdido
- Atualização otimista com rollback automático em caso de erro (TanStack Query)
- Cálculo automático de probabilidade por estágio
- Associação de produtos ao deal, valor e motivo de perda

### Gestão de Produtos
- Catálogo com categorias, SKU, custo, preço de venda e margem automática
- Controle de estoque com alertas visuais por quantidade
- Fotos de produto com URL externa

### Vendas
- Registro de venda com múltiplos itens e cálculo automático de subtotal/total
- Ciclo de vida: Pendente → Confirmado → Enviado → Entregue / Cancelado / Devolvido
- Scoping por usuário: vendedores veem apenas suas próprias vendas (prevenção de IDOR)

### Atividades
- Tipos: Ligação, Email, Reunião, Tarefa, Nota, WhatsApp
- Prioridades: Baixa, Média, Alta, Urgente
- Vencidas e próximas destacadas; associação a cliente ou deal

### Notificações em Tempo Real
- WebSocket STOMP + SockJS: push server → browser sem polling
- Badge dinâmico no ícone de sino; marcar como lida individualmente ou em bloco

### Relatórios & Exportação
- Exportação de clientes e vendas em PDF, Excel (.xlsx) e CSV

---

## Stack Técnica

### Backend — Java / Spring Boot

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| Java + Spring Boot | 17 / 3.2 | Core da aplicação, IoC, auto-configuration |
| Spring Security | 6 | JWT stateless + OAuth2 social login (Google, GitHub) |
| Spring Data JPA + Hibernate | 6 | ORM, lazy loading, `@EntityGraph` para N+1 |
| Spring Data Redis + Lettuce | — | Cache de dashboard com evição por usuário |
| Spring WebSocket + STOMP | — | Notificações push em tempo real |
| Flyway | 10 | Migrations versionadas V1–V8 (schema + dados demo) |
| MapStruct | 1.5 | Mapeamento DTO ↔ entidade sem reflexão em runtime |
| Micrometer + Prometheus | — | Métricas de latência, histogramas, tags por app |
| Springdoc OpenAPI 2 | — | Swagger UI gerado automaticamente |
| PostgreSQL | 16 | Banco principal em produção (Supabase) |
| Lombok | — | Redução de boilerplate (builders, loggers, getters) |
| Bucket4j | — | Rate limiting por IP/usuário na camada de filter |

**Padrões e decisões de design:**

- **RFC 7807 Problem Details** — `GlobalExceptionHandler` retorna `application/problem+json` com campo `detail`; hierarquia tipada: `ResourceNotFoundException` (404), `BusinessRuleException` (400)
- **`@Transactional(readOnly = true)`** em todos os métodos de leitura — obrigatório com `spring.jpa.open-in-view=false`; elimina `LazyInitializationException`
- **`@EntityGraph`** nos repositórios — carrega associações `@ManyToOne` em uma única query; evita N+1 em listas paginadas
- **Soft Delete declarativo** — `@SQLDelete` + `@SQLRestriction` em todas as entidades; dados nunca são excluídos fisicamente
- **Cache por usuário** — `@Cacheable(key="#root.target.currentUserName()")` garante que a evição de um usuário não invalida o cache de outros
- **Prevenção de IDOR** — `findOrThrow()` verifica ownership antes de retornar qualquer recurso; `Role.USER` só acessa os próprios registros
- **Correlation ID** — `CorrelationIdFilter` propaga `X-Correlation-ID` via MDC para rastreamento de requests nos logs
- **Security headers** — CSP, HSTS (31536000s), `X-Frame-Options DENY`, `X-Content-Type-Options nosniff`, Referrer-Policy (produção)

### Frontend — React / TypeScript

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React + TypeScript | 18 / 5 | UI e tipagem estática |
| Vite | 7 | Build tool com HMR e tree-shaking |
| Material UI | 5 | Design system, temas claro/escuro |
| TanStack Query | 5 | Server state, cache, invalidação, optimistic updates |
| React Hook Form + Zod | — | Formulários e validação de schema |
| @dnd-kit | — | Drag-and-drop do Kanban (acessível, sem dependências extras) |
| Recharts | — | Gráficos do dashboard |
| React Router DOM | 6 | Navegação SPA |
| SockJS + STOMP.js | — | Cliente WebSocket para notificações |

**Padrões de frontend:**

- **Optimistic updates com rollback** — `onMutate` faz snapshot, `onError` restaura, `onSettled` invalida; sem flash de UI em caso de erro de rede
- **`useApi` hook** — wrapper de `fetch` que lê `body.detail ?? body.message` (RFC 7807) e lança `Error` tipado para o TanStack Query
- **`AuthContext`** — JWT armazenado em memória (não em `localStorage`); refresh via cookie httpOnly
- **Dark mode persistido** — toggle no header; preferência salva em `localStorage` e aplicada no `MuiThemeProvider`

---

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (React SPA)                       │
│              Material UI · TanStack Query · dnd-kit          │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS REST + JSON
                       │ WebSocket STOMP (notificações)
┌──────────────────────▼──────────────────────────────────────┐
│              Spring Boot API  (:8080)                        │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐ │
│  │  Controller │  │   Service    │  │   Repository       │ │
│  │  + OpenAPI  │→ │ @Transact.   │→ │  JPA + EntityGraph │ │
│  └─────────────┘  │  MapStruct   │  └────────────────────┘ │
│                   │  Bucket4j    │                           │
│  ┌─────────────┐  └──────┬───────┘         │               │
│  │  Security   │         │                 ▼               │
│  │  JWT+OAuth2 │  ┌──────▼───────┐  ┌──────────────┐      │
│  │  + filters  │  │  Redis Cache │  │  PostgreSQL  │      │
│  └─────────────┘  │  (dashboard) │  │  + Flyway    │      │
│                   └──────────────┘  └──────────────┘      │
│  ┌─────────────┐                                            │
│  │  WebSocket  │  ┌──────────────────┐                     │
│  │  STOMP hub  │  │  Micrometer      │                     │
│  └─────────────┘  │  + Prometheus    │                     │
│                   └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### Estrutura de diretórios

```
retailflow/
├── backend/
│   ├── src/main/java/com/retailflow/
│   │   ├── config/            # OpenAPI, WebSocket broker, DemoDataLoader
│   │   ├── controller/        # REST endpoints com @SecurityRequirement
│   │   ├── dto/               # Records de Request/Response
│   │   ├── exception/         # GlobalExceptionHandler, BusinessRuleException, ResourceNotFoundException
│   │   ├── filter/            # RateLimitFilter, CorrelationIdFilter
│   │   ├── mapper/            # MapStruct mappers
│   │   ├── model/             # Entidades JPA + enums
│   │   ├── repository/        # JpaRepository + JpaSpecificationExecutor
│   │   ├── security/          # JwtService, JwtAuthenticationFilter, OAuth2SuccessHandler
│   │   └── service/           # Lógica de negócio com cache e transações
│   └── src/main/resources/
│       ├── db/migration/      # Flyway V1 (schema) → V8 (indexes)
│       ├── application.properties
│       └── application-production.properties
├── frontend/
│   └── src/
│       ├── contexts/          # AuthContext, ThemeContext
│       ├── constants/         # API base URL, formatadores
│       └── features/          # Módulos por domínio (dashboard, customers, deals…)
└── docker-compose.yml
```

---

## Executar localmente

### Pré-requisitos

- Java 17+
- Node 20+
- Docker (para PostgreSQL e Redis locais)

### Backend

```bash
cd backend

# Sobe PostgreSQL e Redis via Docker
docker-compose up -d postgres redis

# Crie o arquivo de variáveis locais
cp .env.example .env
# edite .env com JWT_SECRET e credenciais do banco

./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# API:     http://localhost:8080
# Swagger: http://localhost:8080/swagger-ui.html
# Métricas: http://localhost:8080/actuator/prometheus
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App em http://localhost:5173
```

---

## Variáveis de ambiente

### Backend (obrigatórias em produção)

| Variável | Descrição |
|----------|-----------|
| `JWT_SECRET` | Chave HMAC-256 para tokens (mín. 32 chars) |
| `DB_URL` | JDBC URL PostgreSQL (`jdbc:postgresql://host/db`) |
| `DB_USER` | Usuário do banco |
| `DB_PASS` | Senha do banco |
| `REDIS_HOST` | Host do Redis (default: `localhost`) |
| `REDIS_PORT` | Porta do Redis (default: `6379`) |
| `GOOGLE_CLIENT_ID` | OAuth2 Google client ID |
| `GOOGLE_CLIENT_SECRET` | OAuth2 Google client secret |
| `GITHUB_CLIENT_ID` | OAuth2 GitHub client ID |
| `GITHUB_CLIENT_SECRET` | OAuth2 GitHub client secret |
| `FRONTEND_URL` | URL do frontend para redirect OAuth2 |
| `CORS_ORIGINS` | URLs permitidas pelo CORS (separadas por vírgula) |

### Frontend

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API (`https://sua-api.render.com/api`) |

---

## API

Swagger UI disponível em `/swagger-ui.html` com todos os endpoints documentados e autenticação bearerAuth configurada.

Principais endpoints:

```
POST   /api/auth/login             Autenticação JWT
POST   /api/auth/register          Registro de usuário

GET    /api/dashboard/summary      KPIs do dashboard (cacheado por usuário)

GET    /api/customers              Listagem paginada com filtros
POST   /api/customers              Criar cliente
PUT    /api/customers/{id}         Atualizar cliente
PATCH  /api/customers/{id}/status  Atualizar status

GET    /api/deals                  Listagem paginada
POST   /api/deals                  Criar deal
PATCH  /api/deals/{id}/stage       Mover no kanban (DnD)
GET    /api/deals/kanban           Board agrupado por stage

GET    /api/products               Catálogo paginado
GET    /api/sales                  Vendas (scoped por usuário para Role.USER)
POST   /api/sales                  Registrar venda com itens

GET    /api/activities             Atividades com filtro de status/data
GET    /api/activities/overdue     Vencidas
GET    /api/activities/upcoming    Próximas 7 dias

GET    /api/notifications          Notificações não lidas
PATCH  /api/notifications/{id}/read  Marcar como lida
```

---

## Deploy

| Componente | Plataforma | URL |
|-----------|-----------|-----|
| Backend (Spring Boot) | Render | `app-full-stack-crm-psjd.onrender.com` |
| Frontend (React) | Vercel | `retailflow-front.vercel.app` |
| Banco de dados | Supabase (PostgreSQL 16) | — |
| Cache | Render Redis | — |

---

## Desenvolvedor

**Eduardo Henrique Sato**
Análise e Desenvolvimento de Sistemas

Especialidades: Java · Spring Boot · React · TypeScript · PostgreSQL · Redis · Docker

[![Portfólio](https://img.shields.io/badge/Portf%C3%B3lio-portfolio--sato--steel.vercel.app-0F172A?logo=vercel&logoColor=white)](https://portfolio-sato-steel.vercel.app/)
[![Email](https://img.shields.io/badge/Email-esato%40verdecampo.com.br-EA4335?logo=gmail&logoColor=white)](mailto:esato@verdecampo.com.br)

### Outros projetos

| Projeto | Stack | Link |
|---------|-------|------|
| Doceria Delicatto | React + Node + PostgreSQL + Mercado Pago | [doceriadelicatto.com.br](https://www.doceriadelicatto.com.br/) |
| LR Móveis Planejados | Next.js 15 + TypeScript + Tailwind | [lr-moveis-planejados.vercel.app](https://lr-moveis-planejados.vercel.app/) |
