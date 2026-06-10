# FASE 1 — RESEARCH

> Mapeamento completo do estado atual do projeto RetailFlow CRM.
> Data: 2026-06-10

---

## 1. ESTRUTURA BACKEND

**Stack:** Java 17 · Spring Boot 3.2.0 · Spring Security · JWT · Spring Data JPA · PostgreSQL / H2 · Maven

**Pacote base:** `com.taskflow`

### Camadas

| Camada | Pacote | Conteúdo |
|--------|--------|----------|
| Controller | `controller/` | 8 controllers REST |
| Service | `service/` | 8 services de negócio |
| Repository | `repository/` | 9 repositories (JPA + JPQL) |
| Model | `model/` | 10 entidades JPA |
| DTO | `dto/` | 15 DTOs (request/response) |
| Security | `security/` | JwtService, JwtAuthenticationFilter, SecurityConfig |
| Exception | `exception/` | GlobalExceptionHandler |
| Config | `config/` | OpenApiConfig |

### Entidades

- **User** — autenticação, roles (ADMIN, MANAGER, USER), soft delete, lastLoginAt
- **Customer** — CRM completo: status (LEAD→CHURNED), source, tags, endereço, totalRevenue, auditoria
- **Deal** — pipeline de vendas: 6 stages, probabilidade automática, ManyToMany com Products
- **Product** — catálogo: SKU, estoque, preço de custo, margem, estoque mínimo, categorias
- **Activity** — tarefas/followups: 6 tipos, 4 prioridades, 4 status, vinculada a Customer/Deal
- **Notification** — sistema de notificações: 5 tipos, lida/não-lida, timestamps
- **AuditLog** — rastreamento de mudanças: entidade, ação, valores antigo/novo, IP
- **RefreshToken** — refresh com expiração e revogação
- **ProductCategory** — categorização de produtos
- **Role (enum)** — ADMIN, MANAGER, USER

### Controllers e Endpoints (40+ endpoints)

| Controller | Base Path | Principais Operações |
|------------|-----------|----------------------|
| AuthController | `/api/auth` | register, login, refresh, logout |
| CustomerController | `/api/customers` | CRUD, status update, soft delete, search+filter+pagination |
| ProductController | `/api/products` | CRUD, stock adjust, low-stock list, soft delete |
| DealController | `/api/deals` | CRUD, kanban, stage change, soft delete |
| ActivityController | `/api/activities` | CRUD, overdue, upcoming, complete |
| DashboardController | `/api/dashboard` | summary KPIs |
| NotificationController | `/api/notifications` | list, count, mark-read, mark-all-read |
| UserManagementController | `/api/users` | list, change role, toggle active, soft delete |
| HealthController | `/health` | health check |

### Segurança

- JWT HS256 · expiração 15 min · refresh 7 dias
- BCrypt força 12
- Sessão stateless
- CORS configurado para Vercel + localhost
- Rotas públicas: `/api/auth/**`, `/swagger-ui/**`, `/v3/api-docs/**`, `/health`

### Banco de Dados

- Perfil `local`: H2 in-memory
- Perfil `production`: PostgreSQL
- DDL auto (Hibernate gera schema) — **sem migrations versionadas**
- Dados de exemplo: `data.sql` apenas no perfil local

---

## 2. ESTRUTURA FRONTEND

**Stack:** React 18 · TypeScript · Vite 7 · Material UI 5 · React Router 6 · Axios · Recharts · React Hook Form

### Problema crítico: monolito

`App.tsx` tem **1.123 linhas** com todas as páginas, componentes, lógica de estado e chamadas API inline. Sem decomposição em componentes reutilizáveis.

### Páginas implementadas

| Página | Recurso | Funcionalidades |
|--------|---------|-----------------|
| LoginPage | Autenticação | Login/registro, AuthContext, localStorage |
| DashboardPage | Analytics | KPI cards, gráfico de receita (área), distribuição de deals (pizza), Recharts |
| CustomersPage | CRM | Grid de cards, CRUD, search, filter por status |
| ProductsPage | Catálogo | Grid de cards, CRUD, imagem, badge low-stock, preço formatado |
| DealsPage | Pipeline | Kanban 6 colunas, deal cards com probabilidade, create dialog |
| ActivitiesPage | Tarefas | Lista, tipos com ícones, prioridade colorida, filter, complete action |

### Rotas

```
/           → Dashboard
/customers  → Clientes
/products   → Produtos
/deals      → Pipeline Kanban
/activities → Atividades
```

### Estado

- `AuthContext` para autenticação global (localStorage)
- `useState` local em cada "página" (função inline)
- Sem gerenciamento de estado externo (Redux/Zustand)
- Sem cache de servidor (React Query/TanStack Query)

### Chamadas API

- Hook `useApi()` customizado com Axios
- Bearer token injetado automaticamente
- Logout automático no 401

### Funcionalidades implementadas porém incompletas

- Drag-and-drop Kanban: `@dnd-kit` importado mas **não funcional**
- Dark mode: tema preparado mas **sem toggle**
- Demo user: UI pronta mas **sem seed de dados de demonstração**

---

## 3. DOCKER / INFRA

- `docker-compose.yml`: postgres + backend + frontend
- Backend: Dockerfile com build Maven multi-stage
- Rede bridge `taskflow-network`
- Volume `postgres_data`
- Sem CI/CD (nenhum workflow GitHub Actions)

---

## 4. PROBLEMAS ENCONTRADOS

### Backend

| # | Problema | Impacto |
|---|---------|---------|
| B1 | `ddl-auto=create/update` — sem migrations versionadas (Flyway/Liquibase) | Alto: destruição de dados em deploy, sem histórico de schema |
| B2 | Token JWT expira em 15min sem renovação automática no cliente | Médio: UX ruim, logout inesperado |
| B3 | Soft delete implementado com cheques manuais `deleted_at IS NULL` em cada query | Médio: propenso a vazamento de dados deletados |
| B4 | Mapeamento DTO→Entity manual e repetitivo (sem MapStruct) | Baixo: manutenção onerosa |
| B5 | Único teste: `contextLoads()` — cobertura ~0% | Alto: zero confiança em refatorações |
| B6 | Sem Redis: queries de dashboard recalculadas a cada request | Médio: performance degradada com volume |
| B7 | Sem rate limiting nas rotas de auth | Alto: vulnerável a brute force |
| B8 | Sem security headers (CSP, HSTS, X-Frame-Options) | Alto: vulnerabilidades web básicas |
| B9 | Refresh token sem rotation ou detecção de reuso | Alto: token comprometido = sessão válida indefinida |
| B10 | Sem logs estruturados / correlation ID | Médio: debugging em produção difícil |
| B11 | Sem Spring Actuator configurado para produção | Médio: sem health checks adequados |
| B12 | Filtragem role-based incompleta (MANAGER vê tudo, não só sua equipe) | Médio: vazamento de dados entre equipes |

### Frontend

| # | Problema | Impacto |
|---|---------|---------|
| F1 | `App.tsx` monolítico (1.123 linhas) — anti-pattern crítico | Alto: impossível testar, escalar ou colaborar |
| F2 | Sem decomposição em componentes (Atomic Design não aplicado) | Alto: código duplicado em cada "página" |
| F3 | Drag-and-drop Kanban importado mas não implementado | Médio: feature visível quebrada |
| F4 | Sem testes (nenhum arquivo `.test.` ou `.spec.`) | Alto: zero confiança em mudanças |
| F5 | useEffect + useState para dados remotos (sem TanStack Query) | Médio: sem cache, sem revalidação, race conditions |
| F6 | Dark mode preparado mas não ativável | Baixo: feature prometida não entregue |
| F7 | Sem lazy loading / code splitting por rota | Médio: bundle único, TTI alto |
| F8 | Sem Error Boundaries | Médio: erro em um componente derruba toda a app |
| F9 | Tipos TypeScript gerados manualmente (dessincronizados do backend) | Médio: contratos quebram silenciosamente |
| F10 | README ainda diz "projeto acadêmico" (vs. pitch de portfólio sênior) | Alto: primeiro texto que recrutador lê |

### Infra / Processo

| # | Problema | Impacto |
|---|---------|---------|
| I1 | Sem CI/CD (nenhum GitHub Actions) | Alto: sem validação automática em PRs |
| I2 | Docker sem multi-stage otimizado / usuário non-root | Médio: imagem grande e com risco de segurança |
| I3 | Sem Dependabot / scan de vulnerabilidades de dependências | Médio: deps desatualizadas passam despercebidas |
| I4 | Nome do pacote base é `com.taskflow` (projeto se chama RetailFlow) | Baixo: inconsistência de branding |

---

## 5. DÉBITOS TÉCNICOS

1. Pacote base `com.taskflow` — renomear para `com.retailflow`
2. README descreve projeto como acadêmico — reescrever como portfólio sênior
3. `ddl-auto` → Flyway
4. Soft delete manual → `@SQLDelete` + `@SQLRestriction`
5. Mapping manual → MapStruct
6. `App.tsx` monolítico → feature folders + Atomic Design
7. Estados com `useState+useEffect` → TanStack Query
8. Sem seed de demonstração funcional
9. Swagger sem exemplos de request/response nas anotações

---

## 6. MELHORIAS ARQUITETURAIS

- JPA Specifications para filtros dinâmicos (evitar 20+ métodos no repository)
- Spring Application Events para desacoplar fluxos (auditoria, notificações)
- Problem Details RFC 7807 nas respostas de erro
- API versioning `/api/v1/`
- Redis para cache de dashboard e listagens
- Flyway para migrations versionadas
- MapStruct para mapeamento automático DTO↔Entity
- `@SQLDelete` + `@SQLRestriction` para soft delete declarativo

---

## 7. MELHORIAS UX

- Loading skeletons por seção (não só spinner global)
- Empty states com ilustração e call-to-action
- Toast de sucesso/erro padronizado
- Confirmação de exclusão com modal (já parcialmente implementado)
- Busca instantânea com debounce
- Paginação visual com número de registros
- Drag-and-drop funcional no Kanban
- Dark mode com toggle persistido
- Filtros avançados com chips de filtros ativos
- Notificações real-time (badge atualizado sem reload)

---

## 8. MELHORIAS UI

- Reposicionar como produto SaaS premium (não acadêmico)
- Sidebar responsiva com collapse
- Header com breadcrumb + notificações + avatar
- Landing page profissional (Hero, Features, Tecnologias, Arquitetura)
- Login com acesso rápido para recrutadores (demo roles)
- Tela "Sobre o Desenvolvedor" com perfil e links
- Paleta de cores premium (dark azul/índigo já definida — aplicar consistentemente)
- Microinterações e transições suaves (Framer Motion opcional)

---

## 9. MELHORIAS DE PERFORMANCE

**Backend:**
- Redis + `@Cacheable` para dashboard e listagens frequentes
- HikariCP tuning (pool size, timeout)
- Índices nas colunas de busca (email, status, deleted_at)
- Detecção de N+1 (Hibernate statistics em dev)

**Frontend:**
- React.lazy + Suspense por rota
- useMemo/useCallback nos componentes pesados
- TanStack Query (cache + revalidação automática)
- Bundle splitting com Vite

---

## 10. MELHORIAS DE SEGURANÇA

- Flyway para controle de schema (evitar `ddl-auto=create`)
- Security headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy)
- Refresh token rotation + reuse detection
- Account lockout após 5 tentativas
- Rate limiting com Bucket4j nas rotas de auth
- OWASP Dependency Check no CI
- Trivy scan na imagem Docker
- CodeQL + SonarCloud análise estática
- LGPD: export de dados, anonimização, audit log visível

---

## 11. FUNCIONALIDADES PREVISTAS NAS ENTIDADES MAS SEM UI

A modelagem do backend prevê funcionalidades que não têm frontend:

| Entidade | Funcionalidade | Status |
|----------|---------------|--------|
| AuditLog | Visualização de histórico de mudanças | Sem UI |
| Notification | Notificações real-time | Sem WebSocket |
| RefreshToken | Renovação automática | Token expira silenciosamente |
| User.avatar | Upload de foto de perfil | Apenas URL manual |
| Product.imageUrl | Upload de imagem | Apenas URL manual |
| Deal.products | ManyToMany com produtos | Sem UI para vincular |
| Activity.deal | Vincular atividade a deal | Campo existe, sem UI |

---

## PRÓXIMA ETAPA

→ Criar `.specs/roadmap.md` (FASE 2 — PLANEJAMENTO)
