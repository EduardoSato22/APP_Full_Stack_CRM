# FASE 2 — ROADMAP

> Planejamento de execução das melhorias do RetailFlow CRM.
> Baseado em: `.specs/research.md`
> Data: 2026-06-10

---

## CRITÉRIOS DE PRIORIZAÇÃO

- **Impacto no recrutador**: o que muda a percepção de "acadêmico" para "produção"
- **Pré-requisito**: o que desbloqueia outras melhorias
- **Esforço vs. retorno**: o que entrega muito resultado com pouco tempo

---

## FASE 3 — QUICK WINS
> Mudanças rápidas com alto impacto visual e técnico. Sem risco de quebra.

### 3.1 Identidade e README

- [ ] Reescrever `README.md` como portfólio sênior (remover "projeto acadêmico")
- [ ] Adicionar badges: build, coverage, Java, Spring Boot, React, Docker
- [ ] Adicionar screenshots das telas principais
- [ ] Renomear pacote base `com.taskflow` → `com.retailflow`

### 3.2 Seed de Demonstração

- [ ] Criar perfil Spring `demo` com `DataLoader` (`@Component` + `CommandLineRunner`)
- [ ] Popular: 100 clientes, 50 produtos, 30 deals, 20 atividades (dados realistas em pt-BR)
- [ ] Criar usuários demo: admin@retailflow.demo / manager@retailflow.demo / sales@retailflow.demo
- [ ] Garantir que seed só roda se banco vazio (`count() == 0`)

### 3.3 Login para Recrutadores

- [ ] Adicionar seção "Entrar como Demonstrador" na tela de login
- [ ] Três botões (Admin, Gerente, Vendedor) que preenchem e submetem automaticamente
- [ ] Texto explicativo sobre as roles e permissões

### 3.4 Flyway (Migrations)

- [ ] Adicionar dependência `flyway-core`
- [ ] Criar `V1__create_schema.sql` a partir do schema atual gerado pelo Hibernate
- [ ] Criar `V2__seed_demo.sql` com os dados de demonstração
- [ ] Remover `ddl-auto=create` — trocar para `validate`

### 3.5 Security Headers

- [ ] Configurar `SecurityConfig` com headers: CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy
- [ ] Verificar com https://securityheaders.com após deploy

### 3.6 Soft Delete Declarativo

- [ ] Adicionar `@SQLDelete` + `@SQLRestriction` nas entidades: Customer, Product, Deal, Activity, User
- [ ] Remover cheques manuais `deleted_at IS NULL` das queries JPQL/nativas

### 3.7 Problem Details RFC 7807

- [ ] Atualizar `GlobalExceptionHandler` para retornar `application/problem+json`
- [ ] Campos: `type`, `title`, `status`, `detail`, `instance`, `timestamp`

### 3.8 Correlation ID

- [ ] Criar filtro `CorrelationIdFilter` que injeta `X-Correlation-ID` no MDC
- [ ] Propagar header na resposta
- [ ] Incluir no padrão de log do Logback

### 3.9 Drag-and-Drop Kanban (Frontend)

- [ ] Finalizar implementação `@dnd-kit` já importado no projeto
- [ ] Ao soltar card: chamar `PUT /api/deals/{id}/stage`
- [ ] Animação de arraste e feedback visual

### 3.10 Dark Mode Toggle (Frontend)

- [ ] Adicionar toggle no header (ícone sol/lua)
- [ ] Persistir preferência em `localStorage`
- [ ] Tema já definido — apenas conectar ao toggle

---

## FASE 4 — MEDIUM IMPROVEMENTS
> Melhorias de médio esforço que elevam a qualidade técnica e funcional do sistema.

### 4.1 MapStruct

- [ ] Adicionar dependência `mapstruct` + `mapstruct-processor`
- [ ] Criar mappers: `CustomerMapper`, `ProductMapper`, `DealMapper`, `ActivityMapper`
- [ ] Substituir todos os mapeamentos manuais nos Services

### 4.2 JPA Specifications

- [ ] Criar `CustomerSpecification`, `ProductSpecification`, `DealSpecification`
- [ ] Substituir `findBy*` múltiplos por `findAll(Specification, Pageable)`
- [ ] Reduzir métodos nos repositories

### 4.3 Redis Cache

- [ ] Adicionar `spring-boot-starter-data-redis` + Redis no `docker-compose.yml`
- [ ] `@Cacheable` em: `DashboardService.getSummary()`, listagens com filtros fixos
- [ ] `@CacheEvict` nos métodos de criação/atualização/exclusão
- [ ] TTL: 60s dashboard, 300s listagens

### 4.4 Rate Limiting

- [ ] Adicionar `bucket4j-spring-boot-starter`
- [ ] Limitar: `/api/auth/login` → 10 req/min por IP · `/api/auth/register` → 5 req/min por IP
- [ ] Retornar `429 Too Many Requests` com `Retry-After` header

### 4.5 Testes Backend

- [ ] `CustomerServiceTest` com Mockito (CRUD, search, pagination)
- [ ] `AuthServiceTest` com Mockito (login, refresh, logout)
- [ ] `CustomerControllerTest` com MockMvc + @WebMvcTest
- [ ] `CustomerRepositoryIT` com Testcontainers (PostgreSQL real)
- [ ] Configurar JaCoCo com threshold 70%
- [ ] Adicionar `mvn verify` no CI

### 4.6 Refatoração Frontend — Feature Folders

- [ ] Criar estrutura `src/features/{auth,customers,deals,products,activities,dashboard}/`
- [ ] Extrair cada "página" do `App.tsx` para seu feature folder
- [ ] Criar `src/shared/components/` para componentes reutilizáveis
- [ ] Criar `src/lib/api/` para configuração Axios e hooks de API
- [ ] `App.tsx` deve ter apenas `<Router>` e `<Routes>`

### 4.7 TanStack Query

- [ ] Instalar `@tanstack/react-query`
- [ ] Criar `queryClient` centralizado
- [ ] Substituir `useEffect + useState` por `useQuery` / `useMutation` em todas as páginas
- [ ] Implementar `invalidateQueries` após mutations (lista atualiza automaticamente)

### 4.8 React Hook Form + Zod

- [ ] Adicionar `zod` e `@hookform/resolvers`
- [ ] Criar schemas Zod para: CustomerForm, ProductForm, DealForm, ActivityForm
- [ ] Substituir validações inline por resolvers Zod
- [ ] Mensagens de erro em pt-BR

### 4.9 Dashboard com Dados Reais

- [ ] Implementar no `DashboardService`: receita por mês (12 meses), top 5 produtos, funil por stage
- [ ] Criar endpoint `GET /api/dashboard/revenue-trend`
- [ ] Criar endpoint `GET /api/dashboard/pipeline-funnel`
- [ ] Frontend: conectar gráficos a dados reais (remover mocks)

### 4.10 Upload de Arquivos

- [ ] Endpoint `POST /api/upload` (multipart, max 5MB, tipos: image/*)
- [ ] Armazenamento: diretório local em dev, variável para S3/Cloudinary em prod
- [ ] Componente `ImageUpload` com preview e drag-and-drop
- [ ] Substituir campo "URL da foto" por upload nos formulários de Cliente e Produto

### 4.11 GitHub Actions CI

- [ ] `.github/workflows/ci.yml`: checkout → setup JDK 17 + Node 20 → `mvn verify` → `npm ci && npm run build`
- [ ] Badge de build no README
- [ ] Falha no teste bloqueia merge

### 4.12 Logs Estruturados

- [ ] Adicionar `logstash-logback-encoder`
- [ ] `logback-spring.xml` com appender JSON para produção e console para dev
- [ ] Campos: timestamp, level, correlationId, userId, service, message, exception

---

## FASE 5 — ENTERPRISE FEATURES
> Funcionalidades de nível corporativo que completam o posicionamento como sistema de mercado.

### 5.1 WebSocket — Notificações Real-Time

- [ ] Adicionar `spring-boot-starter-websocket`
- [ ] Configurar STOMP + SockJS (`/ws`)
- [ ] `NotificationService` publica eventos no tópico `/topic/notifications/{userId}`
- [ ] Frontend: `useNotifications` hook com conexão STOMP
- [ ] Badge no sino atualiza sem reload de página

### 5.2 Email Transacional

- [ ] Adicionar `spring-boot-starter-mail` + Thymeleaf
- [ ] Templates HTML: boas-vindas, reset de senha, atividade vencida
- [ ] Integração: Mailtrap (dev), SendGrid/Resend (prod) via variável de ambiente
- [ ] Filas com `@Async` para não bloquear request

### 5.3 Relatórios e Exports

- [ ] PDF: Apache PDFBox — relatório de clientes e deals (com logo e data)
- [ ] Excel: Apache POI — planilha formatada com filtros habilitados
- [ ] CSV: OpenCSV — download direto da listagem atual com filtros aplicados
- [ ] Frontend: botão "Exportar" nas páginas de Clientes, Produtos e Deals

### 5.4 Spring Cloud Contract / Pact

- [ ] Definir contratos para: AuthController, CustomerController
- [ ] Gerar stubs para testes do consumidor (frontend)
- [ ] Executar no CI como etapa de verificação de contrato

### 5.5 Testes E2E — Playwright

- [ ] Instalar Playwright no frontend
- [ ] Cenário: login como admin demo → criar cliente → criar deal → mover stage → exportar CSV
- [ ] Executar no CI (stage separado, após build)

### 5.6 Observabilidade Completa

- [ ] Micrometer + Prometheus: métricas de JVM, HTTP, HikariCP
- [ ] `docker-compose.yml`: adicionar serviços Prometheus + Grafana
- [ ] Dashboard Grafana: requests/s, latência p99, erros 5xx, pool de conexões
- [ ] OpenTelemetry Agent: trace distribuído, `traceId` nos logs
- [ ] Sentry: error tracking backend e frontend com alertas

### 5.7 OAuth2 Social Login

- [ ] `spring-boot-starter-oauth2-client`
- [ ] Provedores: Google + GitHub
- [ ] Fluxo: OAuth2 → backend emite JWT próprio → frontend igual ao fluxo atual
- [ ] Botões "Entrar com Google/GitHub" na tela de login

### 5.8 Módulo de Vendas (Sale Entity)

- [ ] Criar entidade `Sale` (customer, products, total, date, status)
- [ ] Repository, Service, Controller completos
- [ ] Integrar ao Dashboard como fonte de dados de receita
- [ ] Frontend: página `/sales` com histórico e filtros

### 5.9 LGPD e Compliance

- [ ] `GET /api/me/data-export` — JSON com todos os dados do usuário
- [ ] `DELETE /api/me` — anonimiza dados pessoais (mantém registros para integridade)
- [ ] Tela de Audit Log: visualização dos logs do próprio usuário com filtros
- [ ] Cookie consent no frontend (banner + localStorage)
- [ ] Documentar política de dados no README

### 5.10 Perfil do Desenvolvedor

- [ ] Rota `/about` com layout elegante
- [ ] Informações: Eduardo Henrique Sato, ADS Unilavras, especialidades, links GitHub/LinkedIn
- [ ] Link no menu lateral e na landing page
- [ ] Tecnologias exibidas como badges visuais

### 5.11 Landing Page Profissional

- [ ] Rota pública `/landing` (ou `/`)
- [ ] Seções: Hero (CTA), Features, Arquitetura (diagrama), Tecnologias, Demo, Sobre o Dev
- [ ] SEO: meta tags, Open Graph, Twitter Card, favicon
- [ ] Animações suaves de entrada (Framer Motion)
- [ ] Responsiva: mobile, tablet, desktop

### 5.12 ADRs e Diagramas C4

- [ ] Criar `.specs/adr/` com template ADR
- [ ] ADR-001: JWT stateless vs sessions
- [ ] ADR-002: Flyway para migrations
- [ ] ADR-003: Monolito vs microserviços
- [ ] ADR-004: MapStruct vs mapping manual
- [ ] Diagramas C4 Nível 1 e 2 em Mermaid (renderiza no GitHub)

### 5.13 CI/CD Completo

- [ ] `.github/workflows/cd.yml`: build Docker → push GHCR → deploy Render/Railway via webhook
- [ ] Dependabot: atualização automática de dependências (backend + frontend)
- [ ] Trivy scan na imagem Docker antes do push
- [ ] OWASP Dependency Check no CI (backend)
- [ ] SonarCloud na análise estática
- [ ] Conventional Commits + commitlint no CI
- [ ] CHANGELOG automático com semantic-release

---

## RESUMO DE PRIORIDADE

| Fase | Foco | Esforço | Impacto no Recrutador |
|------|------|---------|----------------------|
| 3 — Quick Wins | Fundação, branding, demo | Baixo | Muito Alto |
| 4 — Medium | Qualidade técnica, refatoração | Médio | Alto |
| 5 — Enterprise | Produção, observabilidade, features avançadas | Alto | Médio-Alto |

**Regra:** não iniciar Fase 4 sem concluir os itens 3.1, 3.2, 3.3 e 3.4 (identidade, seed, login demo e Flyway são pré-requisitos).
