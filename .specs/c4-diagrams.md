# RetailFlow CRM — Diagramas C4

> Diagramas de arquitetura em Mermaid (renderiza no GitHub)

---

## Nível 1 — Diagrama de Contexto (System Context)

```mermaid
C4Context
    title RetailFlow CRM — Contexto do Sistema

    Person(recrutador, "Recrutador/Avaliador", "Acessa o sistema para avaliar o portfólio técnico")
    Person(usuario, "Usuário CRM", "Gerencia clientes, deals, produtos e vendas")

    System(retailflow, "RetailFlow CRM", "Sistema de gestão de relacionamento com clientes. Full-stack Spring Boot + React.")

    System_Ext(google, "Google OAuth2", "Autenticação social via Google")
    System_Ext(github, "GitHub OAuth2", "Autenticação social via GitHub")
    System_Ext(mailtrap, "Mailtrap / SMTP", "Envio de e-mails transacionais (boas-vindas, atividades)")
    System_Ext(render, "Render / Railway", "Plataforma de deploy do backend")
    System_Ext(vercel, "Vercel", "Deploy do frontend React")

    Rel(recrutador, retailflow, "Acessa via browser", "HTTPS")
    Rel(usuario, retailflow, "Gerencia CRM", "HTTPS + WebSocket")
    Rel(retailflow, google, "Login social", "OAuth2 PKCE")
    Rel(retailflow, github, "Login social", "OAuth2 PKCE")
    Rel(retailflow, mailtrap, "Envia emails", "SMTP/TLS")
    Rel(retailflow, render, "Deploy backend", "Docker")
    Rel(retailflow, vercel, "Deploy frontend", "Static")
```

---

## Nível 2 — Diagrama de Contêineres (Container)

```mermaid
C4Container
    title RetailFlow CRM — Contêineres

    Person(usuario, "Usuário", "Browser")

    Container_Boundary(frontend_bound, "Frontend") {
        Container(spa, "React SPA", "React 18, TypeScript, Vite", "Interface do usuário. TanStack Query, Material UI, dnd-kit, Recharts.")
    }

    Container_Boundary(backend_bound, "Backend") {
        Container(api, "Spring Boot API", "Java 17, Spring Boot 3.2", "API REST + WebSocket STOMP. JWT Auth, OAuth2, Rate Limiting, Actuator/Prometheus.")
    }

    Container_Boundary(data_bound, "Dados") {
        ContainerDb(postgres, "PostgreSQL 15", "PostgreSQL", "Dados relacionais: usuários, clientes, deals, produtos, vendas, audit logs. Flyway migrations.")
        ContainerDb(redis, "Redis 7", "Redis", "Cache de dashboard (TTL 5min). Potencial session store.")
    }

    Container_Boundary(obs_bound, "Observabilidade") {
        Container(prometheus, "Prometheus", "prom/prometheus:2.51", "Coleta métricas do /actuator/prometheus a cada 15s")
        Container(grafana, "Grafana", "grafana/grafana:10.4", "Dashboards: requests/s, p99 latência, HikariCP, JVM heap")
    }

    Rel(usuario, spa, "Usa", "HTTPS")
    Rel(spa, api, "Chama endpoints REST", "HTTPS / JSON")
    Rel(spa, api, "Notificações real-time", "WebSocket / STOMP")
    Rel(api, postgres, "Lê/escreve", "JDBC / JPA")
    Rel(api, redis, "Cache", "Lettuce / Redis Protocol")
    Rel(prometheus, api, "Coleta métricas", "HTTP /actuator/prometheus")
    Rel(grafana, prometheus, "Consulta", "PromQL")
```

---

## Nível 3 — Diagrama de Componentes (Backend)

```mermaid
C4Component
    title RetailFlow CRM — Componentes do Backend Spring Boot

    Container_Boundary(api, "Spring Boot API") {
        Component(security, "Security Layer", "Spring Security, JwtAuthFilter, LoginRateLimitFilter", "JWT stateless auth, OAuth2 social login, rate limiting 10req/min")
        Component(controllers, "REST Controllers", "@RestController", "AuthController, CustomerController, DealController, ProductController, ActivityController, SaleController, ExportController, AuditLogController")
        Component(services, "Services", "@Service", "AuthService, CustomerService, DealService, ProductService, ActivityService, SaleService, NotificationService, EmailService, ExportService, DashboardService, AuditLogService")
        Component(mappers, "MapStruct Mappers", "@Mapper", "CustomerMapper, ProductMapper, DealMapper, ActivityMapper — conversão entity↔DTO em compile-time")
        Component(repos, "Repositories", "JpaRepository + JpaSpecificationExecutor", "CustomerRepository, DealRepository, ProductRepository, SaleRepository, AuditLogRepository + Specifications")
        Component(ws, "WebSocket", "WebSocketConfig, SimpMessagingTemplate", "STOMP over SockJS, tópico /topic/notifications/{userId}")
        Component(email, "Email Async", "EmailService @Async, Thymeleaf", "Templates HTML: welcome, activity-due. Não bloqueia o request.")
        Component(export, "Export", "ExportService", "CSV (puro Java), Excel (POI XSSF), PDF (PDFBox tabela)")
    }

    ContainerDb(db, "PostgreSQL + Redis", "")

    Rel(security, controllers, "Protege", "FilterChain")
    Rel(controllers, services, "Delega lógica")
    Rel(services, mappers, "Mapeia entidades")
    Rel(services, repos, "Persiste/consulta")
    Rel(services, ws, "Publica eventos")
    Rel(services, email, "Dispara e-mails @Async")
    Rel(services, export, "Gera arquivos")
    Rel(repos, db, "JDBC/JPA + Redis")
```
