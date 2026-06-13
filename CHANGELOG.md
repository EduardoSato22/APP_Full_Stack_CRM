## [1.0.10](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.9...v1.0.10) (2026-06-13)

### Bug Fixes

* **security:** adiciona /error ao permitAll e corrige pool HikariCP ([e5a0ba7](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/e5a0ba7a701d1a40b07eb7f107389e7069868e89))

## [1.0.9](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.8...v1.0.9) (2026-06-13)

### Bug Fixes

* **e2e:** navega via page.goto() no lugar de clicar itens de nav ([077fa26](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/077fa263fc01b555fc85be2fd82a47175909c0e2))

## [1.0.8](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.7...v1.0.8) (2026-06-13)

### Bug Fixes

* **e2e:** corrige testes E2E usando production build e espera estável do AppShell ([afbee4b](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/afbee4b07a5eaacb53690d1bf50a1d4f48e625fb))
* **frontend:** remove keepMounted do Drawer e adiciona polyfill global para SockJS ([d008846](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/d008846f910aabe0e507b81f02b357b5a8fc5827))

## [1.0.7](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.6...v1.0.7) (2026-06-12)

### Bug Fixes

* **ci:** corrige OAuth2 em testes, E2E com mock de API e remove tooltip ([2dade24](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/2dade242a0b014ee7aa50732904d22ada6a342ad))

## [1.0.6](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.5...v1.0.6) (2026-06-12)

### Bug Fixes

* **ci:** corrige E2E sem servidor, Redis no contexto de teste e Trivy instável ([a82ed58](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/a82ed5843e7fefde230e68de805292a58181c92c))

## [1.0.5](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.4...v1.0.5) (2026-06-12)

### Bug Fixes

* **ci:** corrige erros de compilação TS/Java e atualiza actions Node.js 24 ([5d91f87](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/5d91f8777414996a68b05c27c59662f2ab77d319))

## [1.0.4](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.3...v1.0.4) (2026-06-12)

### Bug Fixes

* **ci:** atualiza actions para Node.js 24 e corrige permissões do Trivy ([f4cc117](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/f4cc11766b7e7e17ecdc683bed2c7eb07b5a06ab))

## [1.0.3](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.2...v1.0.3) (2026-06-12)

### Bug Fixes

* **ci:** corrige referência de imagem no Trivy scan do CD pipeline ([a5fd96a](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/a5fd96acf4a3cbe80ee446ac70eef891a862513d))

## [1.0.2](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.1...v1.0.2) (2026-06-12)

### Bug Fixes

* **security:** captura JwtException no filtro para evitar 500 em token expirado ([b821420](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/b8214208e375899d8da6f5feab730e7e05e8dcbb))

## [1.0.1](https://github.com/EduardoSato22/APP_Full_Stack_CRM/compare/v1.0.0...v1.0.1) (2026-06-11)

### Bug Fixes

* **security:** corrige CORS bloqueando preflight ao retornar 401 em vez de redirect para /login ([ca41cae](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/ca41cae5360a92a5f3847162491108cf014c6aa1))

## 1.0.0 (2026-06-11)

### Features

* **4.1-4.2:** MapStruct mappers + JPA Specifications ([4864798](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/486479890c2aaa081ab70d68140792820b323cb6))
* **4.11:** GitHub Actions CI ([ae4e0f3](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/ae4e0f359f6a178778522f4a8dbd576e05a654c6))
* **4.3/4.4/4.12:** Redis cache, rate limiting e logs estruturados ([2b9c554](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/2b9c554b6eb7c54b22e00d0b1fb8f5bf1d84f184))
* **4.5:** testes backend — Mockito, MockMvc e Testcontainers ([31e9bd5](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/31e9bd541f0cbd325433bd39468ecb456ce2f91b))
* **4.6/4.7/4.8:** Feature Folders, TanStack Query e React Hook Form + Zod ([e3842d6](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/e3842d6619732b02fc715b0b0c9c40cd9da908c2))
* **4.9/4.10:** Dashboard com dados reais e upload de imagens ([d0c9e1a](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/d0c9e1a996a5e8a4064d6d7e4cf66ca53854c81c))
* **5.10/5.11:** perfil do desenvolvedor e landing page profissional ([f935285](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/f935285a6e7c62f872b452a72ee2ce74d76e08f8))
* **5.13:** CI/CD completo — CD pipeline, Trivy, OWASP, Dependabot, semantic-release e commitlint ([2cd7587](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/2cd7587953f3d30f1d9022fbff002d63d5de7eca))
* **5.1:** WebSocket com STOMP/SockJS para notificações real-time ([949698b](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/949698b34a07d1ae8c1bce33c7217051313e9c73))
* **5.2:** email transacional com Thymeleaf e @Async ([600cb6d](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/600cb6d4048cbb61f9c11455eddb10569f2790f0))
* **5.3:** exports PDF, Excel e CSV para clientes, produtos e deals ([5ba3893](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/5ba38936de4748c72c5a3a9eedcb236c2c9a464c))
* **5.5:** testes E2E com Playwright ([84065f0](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/84065f0b744adfc6134aac242c01ef94eb1e6f37))
* **5.6:** observabilidade com Prometheus, Grafana e Micrometer ([9289bc5](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/9289bc5fa586818c0b5aff9b08ea3a32258d3dbb))
* **5.7:** OAuth2 social login Google e GitHub com JWT próprio ([6b0f293](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/6b0f2934032de14bed443f44a9e5c040d50c28e4))
* **5.8:** módulo de vendas com Sale entity, SaleItem, repositório, serviço e página frontend ([4a7d628](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/4a7d6288062edd3003148fc113dd3b61a74010d5))
* **5.9:** LGPD — exportação de dados, anonimização, audit log e cookie consent ([da69183](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/da6918389559e3e595a55732aa690ec1e418de8d))
* Fase 3 - Quick Wins completos ([8656c35](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/8656c3527f7249e4e1c5384885b5cbb1f5ddf043))

### Bug Fixes

* **ci:** corrige falhas nos testes e no logback-spring.xml ([207a2d7](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/207a2d751b1ab991b6379c2538afed32dd4ccd8d))
* **fase3:** corrige Security Headers local e adiciona Flyway baseline ([f4b4761](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/f4b47615a636700ef770a2a96de378855a1c5f98))
* **tests:** corrige falhas no baseline antes da Fase 5 ([e78224a](https://github.com/EduardoSato22/APP_Full_Stack_CRM/commit/e78224a642ce6556cf92f707134faba0ebef4317))
