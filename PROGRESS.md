# RetailFlow 2.0 — Progress Tracker

> Última atualização: 2026-06-10
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

## FASE 3 — QUICK WINS

### 3.1 Identidade e README
- [ ] Reescrever `README.md` como portfólio sênior
- [ ] Adicionar badges: build, coverage, Java, Spring Boot, React, Docker
- [ ] Renomear pacote `com.taskflow` → `com.retailflow`
- [ ] Renomear `app.name=taskflow-api` → `app.name=retailflow-api`

### 3.2 Seed de Demonstração
- [ ] Criar `DemoDataLoader` (`@Component` + `CommandLineRunner`)
- [ ] Popular: 100 clientes, 50 produtos, 30 deals, 20 atividades (dados reais pt-BR)
- [ ] Criar usuários demo: admin / manager / sales
- [ ] Garantir idempotência (só roda se banco vazio)

### 3.3 Login para Recrutadores
- [ ] Seção "Entrar como Demonstrador" na tela de login
- [ ] 3 botões (Admin, Gerente, Vendedor) que preenchem e submetem automaticamente

### 3.4 Flyway (Migrations)
- [ ] Adicionar dependência `flyway-core` no pom.xml
- [ ] Criar `V1__create_schema.sql`
- [ ] Criar `V2__seed_demo.sql`
- [ ] Trocar `ddl-auto=update` → `validate`

### 3.5 Security Headers
- [ ] Configurar headers no `SecurityConfig`: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy

### 3.6 Soft Delete Declarativo
- [ ] `@SQLDelete` + `@SQLRestriction` em: Customer, Product, Deal, Activity, User
- [ ] Remover cheques manuais `deleted_at IS NULL`

### 3.7 Problem Details RFC 7807
- [ ] Atualizar `GlobalExceptionHandler` para `application/problem+json`
- [ ] Campos: `type`, `title`, `status`, `detail`, `instance`, `timestamp`

### 3.8 Correlation ID
- [ ] Criar `CorrelationIdFilter` (injeta `X-Correlation-ID` no MDC)
- [ ] Propagar header na resposta

### 3.9 Drag-and-Drop Kanban
- [ ] Finalizar `@dnd-kit` no frontend
- [ ] Ao soltar card: chamar `PUT /api/deals/{id}/stage`

### 3.10 Dark Mode Toggle
- [ ] Toggle no header (ícone sol/lua)
- [ ] Persistir em `localStorage`

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
