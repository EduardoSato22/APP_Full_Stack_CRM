# RETAILFLOW 2.0 - PORTFOLIO EDITION

Você é um Arquiteto de Software Sênior, Especialista em Java Spring Boot, React, UX/UI Design, Product Design, Engenharia de Software e Desenvolvimento de Produtos SaaS.

Sua missão é transformar o projeto existente RetailFlow CRM em uma aplicação que pareça um produto SaaS profissional pronto para produção e que funcione como uma vitrine técnica para recrutadores Java/Spring Boot.

---

# METODOLOGIA OBRIGATÓRIA

Utilize obrigatoriamente:

* SPD (Specification Driven Development)
* SSD (.specs)
* Clean Architecture
* SOLID
* Clean Code
* Atomic Design
* Feature Driven Development

---

# FASE 1 - PESQUISA (RESEARCH)

Antes de alterar qualquer código:

Analise todo o projeto atual.

Mapeie:

## Backend

* Estrutura Spring Boot
* Controllers
* Services
* Repositories
* Entities
* DTOs
* Security
* JWT
* Configurações
* Banco de Dados

## Frontend

* Estrutura React
* Rotas
* Componentes
* Material UI
* Design atual
* Fluxos de navegação

Crie:

.specs/research.md

Documentando:

* Problemas encontrados
* Melhorias possíveis
* Débitos técnicos
* Melhorias arquiteturais
* Melhorias UX
* Melhorias UI
* Melhorias de performance
* Melhorias de segurança

---

# FASE 2 - PLANEJAMENTO

Criar:

.specs/roadmap.md

Separando:

## Quick Wins

Mudanças rápidas

## Medium Improvements

Melhorias intermediárias

## Enterprise Features

Funcionalidades de nível corporativo

---

# OBJETIVO PRINCIPAL

Quando um recrutador acessar o projeto ele deve pensar:

"Esse projeto parece um sistema real de mercado."

Não deve parecer trabalho acadêmico.

---

# REPOSICIONAMENTO DO PRODUTO

Transformar o CRM atual em:

# RetailFlow CRM & Inventory Management

Sistema empresarial de:

* Gestão de clientes
* Gestão de produtos
* Controle de estoque
* Dashboard de vendas
* Relatórios
* Gestão de usuários

---

# NOVO DESIGN

Substituir completamente o visual atual.

Inspirar-se em:

* Hubspot CRM
* Salesforce
* Monday.com
* Pipedrive
* Stripe Dashboard
* Linear
* Vercel Dashboard

Visual:

* Moderno
* Premium
* Minimalista
* Dark Mode
* Light Mode
* Totalmente responsivo

---

# LANDING PAGE

Criar uma Landing Page profissional.

Seções:

Hero

* Nome do produto
* Descrição
* Call To Action

Features

* CRM
* Estoque
* Produtos
* Dashboard

Tecnologias

* Java 17
* Spring Boot
* Spring Security
* JWT
* PostgreSQL
* React
* TypeScript
* Docker

Arquitetura

Mostrar visualmente:

Frontend
↓
API
↓
Banco

Rodapé profissional

SEO e Metadados

* title e meta description otimizados
* Open Graph tags (og:title, og:description, og:image) para preview em redes sociais
* Twitter Card tags
* Canonical URL
* Favicon e web manifest

---

# LOGIN PARA RECRUTADORES

Adicionar área:

"Entrar como Demonstrador"

Na tela de login.

Criar botões de acesso rápido:

Administrador

Email:
[admin@retailflow.demo](mailto:admin@retailflow.demo)

Senha:
Admin123

Vendedor

Email:
[sales@retailflow.demo](mailto:sales@retailflow.demo)

Senha:
Sales123

Gerente

Email:
[manager@retailflow.demo](mailto:manager@retailflow.demo)

Senha:
Manager123

Ao clicar:

* preencher automaticamente login
* permitir entrada instantânea

Objetivo:

Evitar que recrutadores abandonem o projeto.

---

# DASHBOARD PROFISSIONAL

Substituir dashboard atual.

Adicionar:

## KPIs (com fórmula explícita)

Total de Clientes ativos (status = ACTIVE)

Total de Deals em andamento (stage != WON, stage != LOST)

Taxa de Conversão = Deals WON / Total Deals criados no período × 100

Receita do Mês = soma de Deal.value onde stage=WON e closedAt no mês atual

Ticket Médio = Receita / Quantidade de Deals WON

Atividades Pendentes (status = PENDING ou IN_PROGRESS, dueDate <= hoje)

## Gráficos

Receita por mês (últimos 12 meses) — dados reais do banco

Funil de vendas por stage (contagem + valor agregado)

Top 5 produtos mais vendidos (por quantidade em Deals)

Distribuição de clientes por status (pizza)

Atividades por tipo na semana (Call, Email, Meeting, Task)

Estoque crítico (produtos abaixo do mínimo)

Usar:

* Recharts

---

# MÓDULO DE ESTOQUE

Adicionar:

Quantidade disponível

Entrada de estoque

Saída de estoque

Estoque mínimo

Alerta de estoque baixo

Badge visual

---

# MÓDULO DE VENDAS

Criar entidade:

Sale

Campos:

* id
* customer
* products
* total
* date
* status

Dashboard deve consumir dados reais.

---

# PERFIL DO DESENVOLVEDOR

Adicionar menu:

"Sobre o Desenvolvedor"

Exibir:

Nome:
Eduardo Henrique Sato

Formação:
Análise e Desenvolvimento de Sistemas

Especialidades:

* Java
* Spring Boot
* React
* PostgreSQL
* Docker

Links:

* GitHub
* LinkedIn

Criar layout elegante.

---

# DEMONSTRAÇÃO PARA RECRUTADORES

Criar:

Seed de demonstração

Popular banco automaticamente com:

100 clientes

50 produtos

30 vendas

Dados realistas

Assim o sistema sempre parecerá ativo.

---

# MELHORIAS BACKEND

Implementar:

## DTO Pattern

Padronizar respostas

Usar MapStruct para mapeamento automático (eliminar mapping manual)

## Global Exception Handler

@ControllerAdvice

Problem Details RFC 7807 (application/problem+json)

## Validation

Bean Validation

## Pagination

Todos os GET

## Sorting

## Filtering

JPA Specifications para filtros dinâmicos (evitar proliferação de métodos no Repository)

## Search

## OpenAPI

Swagger profissional

API versioning: `/api/v1/`

## Logs

SLF4J

Logs estruturados JSON (Logback + Logstash Encoder)

Correlation ID por request (MDC)

## Actuator

Spring Boot Actuator

Health Checks

Micrometer + Prometheus

## Auditoria

createdAt

updatedAt

@SQLDelete + @SQLRestriction para soft delete declarativo (substituir cheques manuais de deleted_at)

## Cache

Redis + @Cacheable nas queries de listagem

## Rate Limiting

Bucket4j nas rotas de autenticação e endpoints públicos

## Spring Application Events

Domain events para desacoplar notificações, auditoria e integrações

## HikariCP

Tuning do pool: maximumPoolSize, connectionTimeout, idleTimeout

---

# SEGURANÇA

Melhorar:

Spring Security

JWT

Refresh token rotation + detecção de reuso (invalidar família inteira ao detectar reuso)

Account lockout após N tentativas falhas

Roles:

ROLE_ADMIN

ROLE_MANAGER

ROLE_SALES

Proteção de rotas

Security Headers via Spring Security:

* Content-Security-Policy
* Strict-Transport-Security (HSTS)
* X-Frame-Options: DENY
* X-Content-Type-Options: nosniff
* Referrer-Policy

OAuth2 / Social Login (opcional):

* Google
* GitHub

2FA opcional (TOTP / Authenticator)

CodeQL + SonarCloud no CI para análise estática de segurança

OWASP Dependency Check no pipeline

---

# TESTES

Criar:

## Backend

JUnit

Mockito

TestContainers (banco real nos testes de integração)

Contract Testing: Spring Cloud Contract ou Pact (garantir contrato API frontend/backend)

Mutation Testing: PIT (Pitest) para medir qualidade dos testes

Load Testing: k6 (simular 50-200 usuários simultâneos, exportar relatório)

Cobertura mínima:

70%

## Frontend

Vitest

Testing Library

E2E: Playwright ou Cypress (fluxo de login → criação de cliente → venda)

---

# EXPERIÊNCIA DO USUÁRIO

Adicionar:

Loading States

Skeletons

Empty States

Success Toasts

Error Toasts

Confirmações de exclusão

Busca instantânea

Paginação visual

Filtros avançados

---

# PERFORMANCE

Implementar:

## Frontend

Lazy Loading (React.lazy + Suspense por rota)

Code Splitting

Memoization (useMemo, useCallback, React.memo)

TanStack Query (substituir useEffect + useState para dados do servidor)

## Backend

Redis: cache de listagens e dashboard (TTL 60s)

HikariCP: tuning do pool de conexões

N+1 Query Detection: log de queries lentas com Hibernate statistics

Database indexes: rever índices nas colunas de busca e filtro

---

# QUALIDADE DE CÓDIGO

Executar:

* ESLint
* Prettier
* Sonar recommendations

---

# DOCUMENTAÇÃO

Atualizar README.

Adicionar:

Arquitetura

Screenshots

Funcionalidades

Tecnologias

Fluxos

Deploy

Decisões arquiteturais

---

# DEVOPS E CI/CD

Criar pipeline GitHub Actions:

## Workflow: CI (push/PR)

* Checkout + setup JDK 17 e Node 20
* Backend: `mvn verify` (build + testes)
* Frontend: `npm ci && npm run build`
* Lint: ESLint + Prettier check
* Análise estática: SonarCloud
* Dependências: Dependabot (atualizações automáticas de deps)

## Workflow: CD (merge em main)

* Build Docker e push para GitHub Container Registry (GHCR)
* Deploy automático no Render/Railway via webhook

## Docker

Multi-stage build (build stage + runtime stage)

Imagem final: distroless ou eclipse-temurin:17-jre-alpine

Usuário não-root no container

HEALTHCHECK no Dockerfile

## Segurança de dependências

Dependabot para atualizar dependências automaticamente

OWASP Dependency Check no pipeline (backend)

Trivy para scan de vulnerabilidades na imagem Docker

---

# OBSERVABILIDADE

Implementar stack de observabilidade:

## Logs

Logback com Logstash Encoder (JSON estruturado)

Correlation ID por request via MDC

Separar log de acesso, log de erro, log de auditoria

## Métricas

Micrometer + Prometheus

Endpoints: /actuator/prometheus

Grafana: dashboards de JVM, HTTP requests, banco de dados

## Tracing

OpenTelemetry ou Micrometer Tracing + Zipkin

Trace ID propagado em todos os logs

## Error Tracking

Sentry (backend e frontend)

Alertas por email/Slack em exceções não tratadas

---

# MIGRATIONS DE BANCO

Substituir `ddl-auto=create/update` por:

Flyway (migrations versionadas em `db/migration/V*.sql`)

Convenção: V1__create_schema.sql, V2__seed_demo.sql

Benefício: histórico auditável, rollback controlado, compatível com deploy zero-downtime

---

# ARQUITETURA FRONTEND (REFATORAÇÃO)

O `App.tsx` atual tem 1.100+ linhas — refatorar para:

## Estrutura de pastas (Feature Folders)

```
src/
  features/
    auth/
    customers/
    deals/
    products/
    activities/
    dashboard/
  shared/
    components/
    hooks/
    utils/
  lib/
    api/
    queryClient/
```

## Atomic Design

atoms/ → Button, Badge, Avatar, Input, Spinner

molecules/ → SearchBar, FilterBar, KpiCard, StatChip

organisms/ → CustomerTable, DealKanban, ActivityList

templates/ → AppLayout, AuthLayout

pages/ → uma por rota

## State Management

Zustand para estado global de UI (tema, sidebar, notificações)

TanStack Query para estado de servidor (substituir useEffect + fetch manual)

React Hook Form + Zod para validação de formulários (schema-first)

## Geração de Cliente TypeScript

orval ou openapi-typescript lê o Swagger e gera tipos + hooks automaticamente

Garante contrato frontend/backend sempre sincronizado

## Error Boundaries

ErrorBoundary por feature para isolar crashes

Fallback de erro amigável por seção

## Storybook

Documentação visual dos componentes

Stories para cada atom e molecule

---

# REAL-TIME E COMUNICAÇÃO

## Notificações em Tempo Real

WebSocket com STOMP sobre SockJS (Spring WebSocket)

Entidade Notification já existe — conectar ao frontend

Notificar: deal ganho, atividade vencida, estoque crítico

Badge no sino atualiza sem reload

## Email Transacional

Spring Mail + template Thymeleaf ou Freemarker

Cenários:

* Boas-vindas ao registrar
* Recuperação de senha
* Alerta de atividade vencida
* Resumo semanal de pipeline

---

# UPLOAD DE ARQUIVOS

Implementar upload de imagens:

## Backend

Endpoint: POST /api/upload (multipart/form-data)

Armazenamento local (dev) → MinIO Docker Compose

Armazenamento nuvem (prod) → AWS S3 ou Cloudinary

Retorna URL pública da imagem

Validação: tipo MIME, tamanho máximo 5MB

## Frontend

Componente ImageUpload com preview e drag-and-drop

Substituir campo de URL por upload direto nos formulários de Cliente e Produto

---

# RELATÓRIOS E EXPORTS

Adicionar exportação de dados:

PDF

* Apache PDFBox ou OpenPDF
* Relatório de clientes, deals e atividades
* Cabeçalho com logo e data

Excel

* Apache POI
* Planilha formatada com filtros habilitados

CSV

* Jackson CSV ou OpenCSV
* Download direto pela UI

## Frontend

Botões de export em cada listagem (Customers, Products, Deals)

Loading state durante geração

---

# INTERNACIONALIZAÇÃO

Preparar para múltiplos idiomas:

## Backend

Messages.properties (pt-BR e en)

Mensagens de validação e erro localizadas

Accept-Language header para selecionar idioma

## Frontend

i18next + react-i18next

Arquivos de tradução: pt-BR.json, en.json

Toggle de idioma na barra superior

---

# LGPD E COMPLIANCE

Implementar requisitos mínimos de LGPD:

Exportação de dados pessoais

* Endpoint: GET /api/me/data-export
* Retorna JSON com todos os dados do usuário
* Frontend: botão em Configurações da Conta

Direito ao esquecimento

* DELETE /api/me — anonimiza dados pessoais (não exclui registros)
* Substitui nome, email, telefone por valores anonimizados

Tela de Audit Log

* Visualização dos logs de auditoria do usuário (entidade AuditLog já existe)
* Filtro por data, tipo de ação e entidade

Cookie Consent

* Banner de consentimento na Landing Page
* Salvar preferência em localStorage

---

# DOCUMENTAÇÃO DE ARQUITETURA

Criar documentação técnica viva:

## ADRs (Architecture Decision Records)

Pasta: `.specs/adr/`

Template: contexto → decisão → consequências

Exemplos a documentar:

* Escolha de JWT stateless vs sessions
* Flyway vs Liquibase
* Monolítico vs microserviços (e por quê monolítico é certo aqui)
* MapStruct vs manual mapping

## Diagramas C4

Nível 1: Context (o sistema e atores externos)

Nível 2: Container (frontend, backend, banco, cache, fila)

Nível 3: Component (internos do backend)

Ferramenta: Mermaid (renderiza direto no GitHub) ou PlantUML

---

# AUTOMAÇÃO DE QUALIDADE

## Conventional Commits

Formato: `feat(customers): add bulk delete endpoint`

commitlint para validar mensagem no CI

## Husky + lint-staged

pre-commit: ESLint + Prettier no frontend

pre-push: `mvn verify` no backend

## CHANGELOG Automático

semantic-release ou standard-version

Gera CHANGELOG.md automaticamente a partir dos commits

---

# RESULTADO FINAL

O projeto deve parecer:

* Produto SaaS real
* Sistema corporativo
* Portfólio premium
* Projeto de desenvolvedor pleno/sênior Java Spring

Toda implementação deve ser feita preservando compatibilidade com o código existente e documentando cada alteração dentro da pasta .specs.
