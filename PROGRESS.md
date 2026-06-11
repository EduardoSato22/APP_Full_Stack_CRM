# RetailFlow 2.0 — Progress Tracker

> Última atualização: 2026-06-11 (Fase 5: **CONCLUÍDA** — todos os itens implementados)
> Branch: main

---

## STATUS GERAL

| Fase | Nome | Status |
|------|------|--------|
| Fase 1 | Research | ✅ Concluída |
| Fase 2 | Planejamento (Roadmap) | ✅ Concluída |
| Fase 3 | Quick Wins | ✅ Concluída |
| Fase 4 | Medium Improvements | ✅ Concluída |
| Fase 5 | Enterprise Features | ✅ Concluída |

---

## FASE 3 — QUICK WINS ✅ Concluída (2026-06-10)

### 3.1 Identidade e README
- [x] Reescrever `README.md` como portfólio sênior
- [x] Renomear pacote `com.taskflow` → `com.retailflow`
- [x] Renomear `app.name=taskflow-api` → `app.name=retailflow-api`

### 3.2 Seed de Demonstração
- [x] Criar `DemoDataLoader` (`@Component` + `CommandLineRunner`)
- [x] Popular: 19 clientes, 20 produtos, 18 deals, 10 atividades, 4 notificações
- [x] Criar usuários demo: admin / manager / sales
- [x] Idempotente via `existsByEmail("admin@retailflow.demo")`

### 3.3 Login para Recrutadores
- [x] Seção "Acesso rápido para recrutadores" na tela de login
- [x] 3 botões (Admin, Gerente, Vendedor) com login automático

### 3.4 Flyway (Migrations)
- [x] Dependência `flyway-core` adicionada
- [x] `V1__create_schema.sql` criado com schema completo + índices
- [x] `V2__seed_demo.sql` placeholder (seed via DemoDataLoader)
- [x] `V3__add_missing_columns.sql`: color em product_categories, deleted_at em activities
- [x] Flyway desabilitado no perfil local (H2); ativo em produção
- [x] `ddl-auto=update` → `validate` em produção
- [x] `baseline-on-migrate=true` + `baseline-version=1` para deploy em DB existente

### 3.5 Security Headers
- [x] CSP, HSTS (31536000s + includeSubDomains), X-Frame-Options DENY, nosniff, Referrer-Policy
- [x] Headers condicionais por perfil: DENY+HSTS+CSP em produção; sameOrigin em local (H2 console)

### 3.6 Soft Delete Declarativo
- [x] `@SQLDelete` + `@SQLRestriction` em: Customer, Product, Deal, Activity, User
- [x] `deleted_at` adicionado em Activity (que não tinha)

### 3.7 Problem Details RFC 7807
- [x] GlobalExceptionHandler usando `ProblemDetail` (Spring Boot 3 nativo)
- [x] Content-Type: `application/problem+json`; campos: type, title, status, detail, instance, timestamp

### 3.8 Correlation ID
- [x] `CorrelationIdFilter` com `@Order(1)` injeta `X-Correlation-ID` no MDC e na resposta

### 3.9 Drag-and-Drop Kanban
- [x] `DraggableDealCard` + `DroppableStageColumn` com `@dnd-kit/core`
- [x] `DragOverlay` com card elevado durante arraste
- [x] Otimismo local: estado atualiza antes da API responder

### 3.10 Dark Mode Toggle
- [x] `ColorModeContext` + `createAppTheme(mode)` dinâmico
- [x] Toggle no header com ícone sol/lua; persistido em `localStorage`

---

## FASE 4 — MEDIUM IMPROVEMENTS (detalhes em .specs/roadmap.md)

### 4.1 MapStruct ✅ Concluído (2026-06-10)
- [x] mapstruct 1.5.5.Final + lombok-mapstruct-binding no pom.xml
- [x] Lombok configurado ANTES do MapStruct no annotationProcessorPaths
- [x] CustomerMapper, ProductMapper, DealMapper, ActivityMapper
- [x] `toResponse()` substitui `fromEntity()` estático nos DTOs
- [x] `updateEntity(@MappingTarget)` com IGNORE_NULL para enums opcionais
- [x] `resolveRelationships()` nos services para lookups de DB

### 4.2 JPA Specifications ✅ Concluído (2026-06-10)
- [x] CustomerSpec, ProductSpec, DealSpec, ActivitySpec
- [x] LEFT JOIN em specs com relações nullable + query.distinct(true)
- [x] Todos os 4 repositories extendem JpaSpecificationExecutor
- [x] Queries nativas (Customer, Product) e JPQL filtradas (Deal, Activity) removidas
- [x] @SQLRestriction cuida do soft delete automaticamente via Criteria API

### 4.3 Redis Cache ✅ Concluído (2026-06-10)
- [x] `spring-boot-starter-data-redis` + Redis 7-alpine no `docker-compose.yml`
- [x] `@EnableCaching` + `@Cacheable("dashboard-summary")` keyed por usuário
- [x] `@CacheEvict(allEntries=true)` em Customer/Deal/Activity (create/update/delete)
- [x] `spring.cache.type=simple` local; `redis` + TTL 5min em produção

### 4.4 Rate Limiting (Bucket4j) ✅ Concluído (2026-06-10)
- [x] `bucket4j-core:8.7.0` (sem Spring Boot starter)
- [x] `LoginRateLimitFilter @Order(2)`: POST /api/auth/login → 10 req/min por IP
- [x] 429 Too Many Requests com `Retry-After: 60` e `application/problem+json`

### 4.5 Testes Backend ✅ Concluído (2026-06-10)
- [x] CustomerServiceTest (8 casos, Mockito)
- [x] AuthServiceTest (7 casos, Mockito)
- [x] CustomerControllerTest (@SpringBootTest + MockMvc + @WithMockUser)
- [x] CustomerRepositoryIT (Testcontainers PostgreSQL 15, 7 casos)
- [x] JaCoCo 0.8.11 com threshold 40% (haltOnFailure=false)

### 4.6 Refatoração Frontend (Feature Folders) ✅ Concluído (2026-06-10)
- [x] `src/features/{auth,customers,deals,products,activities,dashboard}/`
- [x] App.tsx monolítico (1274 linhas) → ~60 linhas (providers + routing)
- [x] `src/shared/`, `src/contexts/`, `src/lib/`, `src/types.ts`, `src/constants.ts`

### 4.7 TanStack Query ✅ Concluído (2026-06-10)
- [x] `@tanstack/react-query@5` + `QueryClientProvider` em main.tsx
- [x] `useQuery` em Dashboard, Customers, Products, Deals, Activities
- [x] `useMutation` + `invalidateQueries` em todos os dialogs
- [x] Otimismo local no Kanban via `queryClient.setQueryData`

### 4.8 React Hook Form + Zod ✅ Concluído (2026-06-10)
- [x] `zod@3.22.4` + `@hookform/resolvers@3.9.0`
- [x] Schemas: customerSchema, productSchema, dealSchema, activitySchema
- [x] `zodResolver` + `helperText` com mensagens de erro em todos os dialogs

### 4.9 Dashboard com Dados Reais ✅ Concluído (2026-06-10)
- [x] `GET /api/dashboard/revenue-trend` — 12 meses com `sumWonRevenueBetween` (fix bug monotônico)
- [x] `GET /api/dashboard/pipeline-funnel` — estágios com count + valor
- [x] `GET /api/dashboard/top-products` — top 5 produtos em deals ganhos
- [x] `DashboardSummary` limpo: apenas KPIs (removido dealsByStage/revenueByMonth)
- [x] Frontend: 4 queries separadas, AreaChart 12 meses, PieChart funil, 2 BarCharts novos

### 4.10 Upload de Arquivos ✅ Concluído (2026-06-10)
- [x] `POST /api/upload` multipart — validação image/*, 5 MB, UUID filename (sem path traversal)
- [x] `UploadService` com armazenamento local; prod usa `${UPLOAD_DIR}` (filesystem Render é efêmero)
- [x] `WebConfig` serve `/uploads/**` como recurso estático
- [x] `SecurityConfig` permite `/uploads/**` sem autenticação
- [x] Componente `ImageUpload` com preview, drag-and-drop, upload direto (raw fetch, sem Content-Type hardcoded)
- [x] `CustomerDialog` e `ProductDialog` usam `Controller + ImageUpload` no lugar de URL textual

### 4.11 GitHub Actions CI ✅ Concluído (2026-06-10)
- [x] `.github/workflows/ci.yml`: jobs paralelos backend + frontend
- [x] Backend: JDK 17 Temurin + `mvn verify` + cache Maven
- [x] Frontend: Node 20 + `npm ci` + `tsc --noEmit` + `npm run build`

### 4.12 Logs Estruturados ✅ Concluído (2026-06-10)
- [x] `logstash-logback-encoder:7.4`
- [x] `logback-spring.xml`: console colorido em local; JSON via LogstashEncoder em prod

---

## FASE 5 — ENTERPRISE FEATURES (detalhes em .specs/roadmap.md)

### 5.1 WebSocket (Notificações Real-Time) ✅ Concluído (2026-06-11)
- [x] `spring-boot-starter-websocket` adicionado ao pom.xml
- [x] `WebSocketConfig`: STOMP + SockJS endpoint `/ws`
- [x] `NotificationService.create()` publica em `/topic/notifications/{userId}` via `SimpMessagingTemplate`
- [x] `SecurityConfig`: `/ws/**` permitAll
- [x] Frontend: `@stomp/stompjs` + `sockjs-client` instalados
- [x] `useNotifications` hook: conecta via STOMP, recebe notificações em real-time
- [x] `AppShell`: badge atualiza sem reload via WebSocket

### 5.2 Email Transacional ✅ Concluído (2026-06-11)
- [x] `spring-boot-starter-mail` + `spring-boot-starter-thymeleaf` adicionados
- [x] `EmailService` com `@Async` (não bloqueia o request)
- [x] Templates HTML: `email/welcome.html`, `email/activity-due.html`
- [x] `@EnableAsync` em `RetailFlowApiApplication`
- [x] `AuthService.register()` dispara `sendWelcome` após cadastro
- [x] Configuração: dev via Mailtrap (env vars), prod via SendGrid/Resend
- [x] Variáveis: `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `MAIL_FROM`
- [x] `AuthServiceTest` atualizado com `@Mock EmailService`

### 5.3 Relatórios e Exports ✅ Concluído (2026-06-11)
- [x] `poi-ooxml:5.2.5` (Excel) + `pdfbox:2.0.31` (PDF) no pom.xml
- [x] `ExportService`: CSV puro Java + Excel (POI XSSF) + PDF (PDFBox tabela)
- [x] `ExportController`: 9 endpoints — `/api/export/{customers,deals,products}.{csv,xlsx,pdf}`
- [x] PDF: tabela com header colorido, linhas alternadas, rodapé com contagem
- [x] Excel: filtros habilitados, auto-resize de colunas, header estilizado
- [x] Frontend: componente `ExportMenu` com dropdown CSV/Excel/PDF
- [x] Botão "Exportar" adicionado em: CustomersPage, ProductsPage, DealsPage

- [ ] 5.4 Spring Cloud Contract / Pact (baixa prioridade para portfólio — postergado)

### 5.5 Testes E2E (Playwright) ✅ Concluído (2026-06-11)
- [x] `@playwright/test` instalado como devDependency
- [x] `playwright.config.ts`: Chromium, webServer dev, retry em CI
- [x] `e2e/crm-flow.spec.ts`: login demo, criar cliente, criar deal, dashboard KPIs, export menu
- [x] Scripts: `test:e2e` e `test:e2e:ui` no package.json
- [x] CI: job `e2e` no GitHub Actions (runs-on ubuntu, após build, upload report on failure)

### 5.6 Observabilidade Completa ✅ Concluído (2026-06-11)
- [x] `spring-boot-starter-actuator` + `micrometer-registry-prometheus` no pom.xml
- [x] Endpoints expostos: `health`, `info`, `prometheus`, `metrics`
- [x] `SecurityConfig`: `/actuator/health` + `/actuator/prometheus` permitAll
- [x] `management.metrics.distribution.percentiles-histogram.http.server.requests=true` (habilita p99)
- [x] `docker-compose.yml`: serviços `prometheus` (v2.51.2) + `grafana` (v10.4.2)
- [x] `observability/prometheus.yml`: scrape a cada 15s em `backend:8080/actuator/prometheus`
- [x] Grafana auto-provisionado: datasource Prometheus + dashboard RetailFlow Overview
- [x] Dashboard Grafana: requests/s, latência p99, erros 5xx, HikariCP pool, JVM heap, GC pause
### 5.7 OAuth2 Social Login ✅ Concluído (2026-06-11)
- [x] `spring-boot-starter-oauth2-client` adicionado ao pom.xml
- [x] `OAuth2AuthenticationSuccessHandler`: find-or-create user por email, emite JWT próprio, redireciona para frontend
- [x] Google: extrai `email` + `name` + `picture`; GitHub: extrai `email`/`login` + `avatar_url`
- [x] Usuários OAuth2: senha aleatória (bcrypt de UUID), role padrão USER
- [x] `SecurityConfig`: oauth2Login configurado com success/failure handler; `/oauth2/**` + `/login/oauth2/**` permitAll
- [x] Sessão: `IF_REQUIRED` (OAuth2 precisa de session para CSRF state; JWT API continua stateless)
- [x] Propriedades: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` via env vars
- [x] `GET /api/auth/me`: retorna perfil do usuário autenticado (usado pelo callback)
- [x] `AuthService.buildResponse()`: exposição pública do builder para uso no endpoint /me
- [x] Frontend: `OAuth2CallbackPage` — trata token da URL, busca /me, faz login, redireciona ao dashboard
- [x] Frontend: botões "Google" + "GitHub" na tela de login com tooltips de configuração
- [x] `App.tsx`: `BrowserRouter` sempre presente; `/oauth2/callback` acessível sem autenticação
### 5.8 Módulo de Vendas (Sale Entity) ✅ Concluído (2026-06-11)
- [x] Entidade `Sale` com `SaleItem` — OneToMany, soft delete via `@SQLDelete`
- [x] `V4__create_sales.sql`: tabelas `sales` + `sale_items` com índices e FK
- [x] `SaleRepository`: `findFiltered(status, customerId)`, `sumRevenueBetween(from, to)`
- [x] `SaleService`: create (calcula total + itens), list, getById, updateStatus, delete
- [x] `SaleController`: 5 endpoints REST + Swagger tags
- [x] DTOs: `SaleRequest`, `SaleItemRequest`, `SaleResponse`, `SaleItemResponse`
- [x] `@CacheEvict("dashboard-summary")` em create/update/delete para invalidar cache
- [x] Frontend: `SalesPage` com tabela, filtro por status, dialog de criação com múltiplos itens
- [x] Rota `/sales` adicionada em `App.tsx`
- [x] Link "Vendas" no menu lateral (`AppShell`) com ícone `PointOfSale`
### 5.9 LGPD e Compliance ✅ Concluído (2026-06-11)
- [x] `GET /api/me/data-export`: exporta perfil + todos os audit logs do usuário em JSON
- [x] `DELETE /api/me`: anonimiza dados (nome genérico, email irreversível, phone/avatar null) + soft delete + revoga tokens
- [x] `AuditLogRepository.findByChangedByIdOrderByChangedAtDesc`: busca logs por usuário
- [x] `AuditLogService`: `log()` para registrar eventos, `list()` paginado, `findByUser()` para LGPD
- [x] `AuditLogController`: `GET /api/audit-logs` — admin vê todos, user vê apenas os próprios
- [x] `DataExportResponse`: DTO com perfil + auditLogs + exportedAt
- [x] `AuditLogResponse`: DTO sem oldValue/newValue (dados sensíveis omitidos na resposta)
- [x] Frontend: `CookieConsentBanner` — banner LGPD com "Aceitar" e "Apenas essenciais", persiste em localStorage
### 5.10 Perfil do Desenvolvedor ✅ Concluído (2026-06-11)
- [x] Rota `/about` com layout elegante em card
- [x] Avatar "ES", nome, formação (ADS Unilavras), botões GitHub + LinkedIn
- [x] Seção "Sobre" com descrição profissional contextualizada no projeto
- [x] Badges de tecnologias com cores temáticas (12 badges)
- [x] Grid de 6 áreas de expertise (Backend, Frontend, Dados, DevOps, Segurança, Qualidade)
- [x] Link "Sobre" no menu lateral (AppShell)

### 5.11 Landing Page Profissional ✅ Concluído (2026-06-11)
- [x] Rota pública `/landing` (acessível sem autenticação)
- [x] Seção Hero: gradient escuro, título, subtítulo, CTA "Ver Demo" + botão GitHub
- [x] Seção Features: 6 cards com ícones e descrição de cada funcionalidade
- [x] Seção Arquitetura: diagrama ASCII em card escuro monospace
- [x] Seção Stack: 3 colunas (Backend / Frontend / Infra) com chips de tecnologias
- [x] Seção CTA final: botões "Acessar Demo" e "Sobre o Desenvolvedor"
- [x] Link "Landing" no menu lateral (AppShell)
### 5.12 ADRs e Diagramas C4 ✅ Concluído (2026-06-11)
- [x] `.specs/adr/0000-template.md` — template ADR reutilizável
- [x] `ADR-0001`: JWT Stateless vs Sessões (contexto, justificativa, trade-offs)
- [x] `ADR-0002`: Flyway para Migrations (comparação com Liquibase e ddl-auto)
- [x] `ADR-0003`: Monolito Modular vs Microsserviços (decisão justificada para portfólio)
- [x] `ADR-0004`: MapStruct vs Mapeamento Manual (compile-time vs reflection, Lombok ordering)
- [x] `.specs/c4-diagrams.md` com 3 níveis C4 em Mermaid (renderiza no GitHub):
  - Nível 1: System Context (usuários, sistema, integrações externas)
  - Nível 2: Container Diagram (SPA, API, PostgreSQL, Redis, Prometheus, Grafana)
  - Nível 3: Component Diagram (Security, Controllers, Services, Mappers, Repos, WS, Email, Export)
### 5.13 CI/CD Completo ✅ Concluído (2026-06-11)
- [x] `.github/dependabot.yml`: atualização automática Maven + npm + GitHub Actions (weekly/monthly)
- [x] `.github/workflows/cd.yml`: Docker build → Trivy SARIF scan → push GHCR → deploy Render (webhook)
  - Docker metadata action: tags por branch, semver, SHA
  - Trivy CRITICAL/HIGH → GitHub Security Dashboard via SARIF upload
  - Deploy job com `environment: production` e `if: secrets.RENDER_DEPLOY_HOOK != ''`
- [x] `.github/workflows/security.yml`: OWASP Dependency Check (failBuildOnCVSS=9) + Trivy FS scan semanal
- [x] `.github/workflows/release.yml`: semantic-release (minor/patch/major por tipo) + commitlint em PRs
- [x] `.releaserc.json`: preset conventionalcommits, gera CHANGELOG.md, cria GitHub Release e tag
- [x] `.commitlintrc.json`: regras de commit convencional (type-enum, subject-max-length)
- [x] `backend/pom.xml`: OWASP Dependency Check plugin v9.0.9 (não roda no `verify` por default)
- [x] `backend/.owasp-suppression.xml`: arquivo de supressão de falsos positivos

---

## NOTAS TÉCNICAS

### Estado Atual do Projeto
- **Backend**: Spring Boot, pacote `com.taskflow` (renomear para `com.retailflow`)
- **Frontend**: Single `App.tsx` monolítico (57KB, ~1100 linhas)
- **DB local**: H2 in-memory
- **DB produção**: PostgreSQL
- **DDL**: `hibernate.ddl-auto=update` (migrar para Flyway)
- **Flyway**: não instalado
- **Redis**: não instalado
- **Testes**: apenas `TaskflowApplicationTests.java` vazio

### Decisões Tomadas
- Flyway antes de Seed (seed vai como V2__seed_demo.sql)
- Package rename é pré-requisito para tudo mais
