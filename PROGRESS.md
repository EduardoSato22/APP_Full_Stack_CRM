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

### 4.3 Redis Cache
- [ ] `spring-boot-starter-data-redis` + Redis no `docker-compose.yml`
- [ ] `@Cacheable` em `DashboardService.getSummary()` e listagens
- [ ] `@CacheEvict` em criação/atualização/exclusão

### 4.4 Rate Limiting (Bucket4j)
- [ ] `bucket4j-spring-boot-starter`
- [ ] `/api/auth/login` → 10 req/min por IP
- [ ] 429 Too Many Requests com `Retry-After` header

### 4.5 Testes Backend ✅ Concluído (2026-06-10)
- [x] CustomerServiceTest (8 casos, Mockito)
- [x] AuthServiceTest (7 casos, Mockito)
- [x] CustomerControllerTest (@SpringBootTest + MockMvc + @WithMockUser)
- [x] CustomerRepositoryIT (Testcontainers PostgreSQL 15, 7 casos)
- [x] JaCoCo 0.8.11 com threshold 40% (haltOnFailure=false)

### 4.6 Refatoração Frontend (Feature Folders)
- [ ] `src/features/{auth,customers,deals,products,activities,dashboard}/`
- [ ] Extrair páginas do App.tsx monolítico (~1100 linhas)
- [ ] `src/shared/components/` e `src/lib/api/`

### 4.7 TanStack Query
- [ ] `@tanstack/react-query` instalado
- [ ] Substituir `useEffect + useState` por `useQuery` / `useMutation`
- [ ] `invalidateQueries` após mutations

### 4.8 React Hook Form + Zod
- [ ] `zod` + `@hookform/resolvers`
- [ ] Schemas Zod para Customer, Product, Deal, Activity

### 4.9 Dashboard com Dados Reais
- [ ] `GET /api/dashboard/revenue-trend` e `GET /api/dashboard/pipeline-funnel`
- [ ] Frontend conecta gráficos a dados reais

### 4.10 Upload de Arquivos
- [ ] `POST /api/upload` multipart
- [ ] Componente `ImageUpload` com preview

### 4.11 GitHub Actions CI
- [ ] `.github/workflows/ci.yml`: JDK 17 + Node 20 + `mvn verify` + `npm ci`
- [ ] Badge de build no README

### 4.12 Logs Estruturados
- [ ] `logstash-logback-encoder`
- [ ] `logback-spring.xml` JSON para produção, console para dev

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
