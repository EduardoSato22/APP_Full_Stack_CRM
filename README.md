# RetailFlow CRM & Inventory Management

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

Sistema empresarial completo de **CRM, gestão de produtos e pipeline de vendas** — construído como vitrine técnica de desenvolvimento pleno/sênior Java Spring Boot.

> Acesse a demo ao vivo → **[retailflow-front.vercel.app](https://retailflow-front.vercel.app)**

---

## Demo rápida

Na tela de login, clique em um dos botões de acesso rápido:

| Perfil | Email | Senha |
|--------|-------|-------|
| Administrador | `admin@retailflow.demo` | `Admin123` |
| Gerente | `manager@retailflow.demo` | `Manager123` |
| Vendedor | `sales@retailflow.demo` | `Sales123` |

---

## Funcionalidades

### CRM de Clientes
- Cadastro completo com empresa, cargo, endereço, tags e notas
- Pipeline de status: Lead → Prospect → Active → Churned
- Fontes de aquisição (Organic, Referral, ADS, Cold Outreach, Event)
- Histórico de receita por cliente

### Pipeline de Vendas (Kanban)
- Board drag-and-drop com 6 estágios (Prospecção → Ganho/Perdido)
- Cálculo automático de probabilidade por estágio
- Associação de produtos ao deal

### Gestão de Produtos & Estoque
- Catálogo com categorias, SKU, custo e margem automática
- Controle de estoque com alertas visuais

### Dashboard Analítico
- KPIs: clientes ativos, pipeline total, receita do mês, taxa de conversão
- Gráfico de receita por mês (12 meses)
- Funil de vendas por estágio
- Distribuição de clientes por status (pizza)

### Atividades & Notificações
- Tipos: Call, Email, Meeting, Task, Note, WhatsApp
- Prioridades: Low, Medium, High, Urgent
- Notificações em tempo real (badge no sino)

---

## Stack Técnica

### Backend
| Tecnologia | Uso |
|-----------|-----|
| Java 17 + Spring Boot 3.2 | Core da aplicação |
| Spring Security + JWT | Autenticação stateless |
| Spring Data JPA + Hibernate | ORM e queries |
| Flyway | Migrations versionadas de banco |
| PostgreSQL / H2 | Produção / desenvolvimento local |
| Springdoc OpenAPI 2 | Swagger UI automático |
| Lombok | Redução de boilerplate |

**Padrões implementados:**
- RFC 7807 Problem Details (`application/problem+json`) no exception handler
- Correlation ID por request via MDC (`X-Correlation-ID` no header)
- Soft Delete declarativo com `@SQLDelete` + `@SQLRestriction`
- Security Headers: CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy
- Seed idempotente (`DemoDataLoader`) com dados realistas em pt-BR

### Frontend
| Tecnologia | Uso |
|-----------|-----|
| React 18 + TypeScript 5 | UI e tipagem |
| Vite 7 | Build tool |
| Material UI 5 | Design system |
| React Router DOM 6 | Navegação SPA |
| React Hook Form | Formulários |
| @dnd-kit | Drag-and-drop Kanban |
| Recharts | Gráficos do dashboard |

**Features de UX:**
- Dark Mode com toggle no header (persistido em localStorage)
- Acesso rápido para recrutadores na tela de login
- Drag-and-drop com feedback visual e atualização otimista

---

## Arquitetura

```
retailflow/
├── backend/                        # API REST — Java / Spring Boot
│   ├── src/main/java/com/retailflow/
│   │   ├── config/                 # DemoDataLoader, OpenAPI
│   │   ├── controller/             # REST endpoints
│   │   ├── dto/                    # Request / Response DTOs
│   │   ├── exception/              # GlobalExceptionHandler (RFC 7807)
│   │   ├── filter/                 # CorrelationIdFilter
│   │   ├── model/                  # Entidades JPA
│   │   ├── repository/             # Spring Data JPA
│   │   ├── security/               # JWT, SecurityConfig
│   │   └── service/                # Lógica de negócio
│   └── src/main/resources/
│       ├── db/migration/           # Flyway V1 (schema) + V2 (ref. seed)
│       └── application*.properties
├── frontend/                       # SPA — React / TypeScript
│   └── src/
│       └── App.tsx                 # Aplicação completa (~1200 linhas)
└── docker-compose.yml
```

**Fluxo de dados:**

```
Browser (React SPA)
      ↕  REST / JSON
Spring Boot API  (:8080)
      ↕  JPA / Hibernate
PostgreSQL  (:5432)
```

---

## Executar localmente

### Pré-requisitos
- Java 17+
- Node 20+
- Docker (opcional, para PostgreSQL local)

### Backend (H2 in-memory)

```bash
cd backend
# crie um .env com JWT_SECRET=qualquer-string-longa
echo "JWT_SECRET=minha-chave-secreta-muito-segura-123" > .env
./mvnw spring-boot:run -Dspring.profiles.active=local
# API disponível em http://localhost:8080
# Swagger UI: http://localhost:8080/swagger-ui.html
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# App em http://localhost:5173
```

### Com Docker Compose (PostgreSQL)

```bash
docker-compose up -d
# Backend sobe com perfil de produção apontando para o Postgres do compose
```

---

## Variáveis de ambiente (backend)

| Variável | Descrição |
|----------|-----------|
| `JWT_SECRET` | Chave secreta HMAC para tokens JWT (mín. 32 chars) |
| `DB_URL` | JDBC URL do PostgreSQL |
| `DB_USER` | Usuário do banco |
| `DB_PASS` | Senha do banco |

---

## API Documentation

Swagger UI disponível em `/swagger-ui.html` com todos os endpoints documentados.

Principais grupos:
- `POST /api/auth/login` — autenticação JWT
- `GET/POST /api/customers` — CRUD de clientes
- `GET/POST /api/deals` — CRUD de deals
- `PUT /api/deals/{id}/stage` — mudança de stage (usado pelo kanban DnD)
- `GET /api/dashboard/summary` — KPIs do dashboard
- `GET /api/deals/kanban` — board por stage

---

## Desenvolvedor

**Eduardo Henrique Sato**
Análise e Desenvolvimento de Sistemas — Unilavras

Especialidades: Java · Spring Boot · React · TypeScript · PostgreSQL · Docker

[![GitHub](https://img.shields.io/badge/GitHub-esato-181717?logo=github)](https://github.com/esato)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Eduardo%20Sato-0A66C2?logo=linkedin)](https://linkedin.com/in/eduardosato)

---

## Roadmap

- [ ] **Fase 4**: MapStruct, JPA Specifications, Redis Cache, Rate Limiting, Testes com Testcontainers, TanStack Query, Dashboard com dados reais
- [ ] **Fase 5**: WebSocket real-time, Relatórios PDF/Excel, OAuth2 Google/GitHub, Observabilidade (Prometheus + Grafana), CI/CD GitHub Actions

Ver progresso detalhado em [PROGRESS.md](./PROGRESS.md).
