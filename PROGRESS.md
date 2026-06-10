# RetailFlow 2.0 — Progress Tracker

> Última atualização: 2026-06-10 (bloqueadores Flyway baseline + Security Headers local corrigidos)
> Branch: main

---

## STATUS GERAL

| Fase | Nome | Status |
|------|------|--------|
| Fase 1 | Research | ✅ Concluída |
| Fase 2 | Planejamento (Roadmap) | ✅ Concluída |
| Fase 3 | Quick Wins | 🔄 Em andamento |
| Fase 4 | Medium Improvements | ⏳ Pendente |
| Fase 5 | Enterprise Features | ⏳ Pendente |

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

- [ ] 4.1 MapStruct
- [ ] 4.2 JPA Specifications
- [ ] 4.3 Redis Cache
- [ ] 4.4 Rate Limiting (Bucket4j)
- [ ] 4.5 Testes Backend (JUnit + Testcontainers)
- [ ] 4.6 Refatoração Frontend (Feature Folders)
- [ ] 4.7 TanStack Query
- [ ] 4.8 React Hook Form + Zod
- [ ] 4.9 Dashboard com Dados Reais
- [ ] 4.10 Upload de Arquivos
- [ ] 4.11 GitHub Actions CI
- [ ] 4.12 Logs Estruturados

---

## FASE 5 — ENTERPRISE FEATURES (detalhes em .specs/roadmap.md)

- [ ] 5.1 WebSocket (Notificações Real-Time)
- [ ] 5.2 Email Transacional
- [ ] 5.3 Relatórios e Exports (PDF, Excel, CSV)
- [ ] 5.4 Spring Cloud Contract / Pact
- [ ] 5.5 Testes E2E (Playwright)
- [ ] 5.6 Observabilidade Completa (Prometheus + Grafana + Sentry)
- [ ] 5.7 OAuth2 Social Login (Google + GitHub)
- [ ] 5.8 Módulo de Vendas (Sale Entity)
- [ ] 5.9 LGPD e Compliance
- [ ] 5.10 Perfil do Desenvolvedor
- [ ] 5.11 Landing Page Profissional
- [ ] 5.12 ADRs e Diagramas C4
- [ ] 5.13 CI/CD Completo

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
