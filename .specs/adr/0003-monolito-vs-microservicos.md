# ADR-0003: Monolito Modular vs Microsserviços

**Status:** Aceito

**Data:** 2026-06-10

## Contexto

O RetailFlow CRM é um projeto de portfólio com funcionalidades de CRM, gestão de produtos,
pipeline de deals, notificações, vendas e observabilidade. Precisamos decidir a topologia
de deployment.

## Decisão

Adotamos arquitetura **monolito modular** (um único Spring Boot + um único React SPA),
organizado internamente por feature folders (`com.retailflow.{feature}` no backend,
`src/features/{feature}` no frontend).

## Justificativa

- **Complexidade operacional:** microsserviços requerem service discovery, distributed tracing,
  API gateway, contratos de interface e infraestrutura muito mais complexa para demonstrar.
- **Escopo de portfólio:** o objetivo é mostrar qualidade de código, boas práticas e amplitude
  técnica — não gerenciamento de infraestrutura distribuída.
- **Evolução:** se necessário, o monolito modular pode ser extraído em serviços menores com
  baixo risco, pois os módulos já têm fronteiras claras.
- **Custo zero:** um único Render/Railway instance para backend + uma Vercel para frontend.

## Alternativas Consideradas

- **Microsserviços com Spring Cloud:** auth-service, customer-service, deal-service etc.
  Rejeitado: overhead operacional imenso sem benefício claro em escala de portfólio.
  Demonstraria infraestrutura mais do que qualidade de código.
- **Serverless (AWS Lambda + API Gateway):** interessante para casos de uso específicos,
  mas cold start incompatível com WebSocket e padrões de autenticação stateful do OAuth2.
- **NestJS (Node.js) no backend:** eliminaria a dualidade de linguagem JS/TS, mas Spring Boot
  é o padrão de mercado para backends enterprise Java e é o objetivo do portfólio.

## Consequências

### Positivas
- Deploy simples: um container Docker por serviço (backend + frontend + postgres + redis)
- Transações ACID entre módulos sem 2PC distribuído
- Refatoração e navegação de código mais simples
- Um único pipeline de CI/CD

### Negativas / Trade-offs
- Escala vertical (CPU/RAM) em vez de horizontal por serviço
- Deploy de qualquer feature requer redeploy do monolito inteiro
- Não demonstra padrões de comunicação inter-serviços (Kafka, gRPC)

## Referências

- [Modular Monolith: A Primer — Kamil Grzybek](https://www.kamilgrzybek.com/design/modular-monolith-primer/)
- [Microservices — Martin Fowler](https://martinfowler.com/articles/microservices.html)
