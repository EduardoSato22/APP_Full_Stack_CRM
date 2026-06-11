# ADR-0002: Flyway para Gerenciamento de Migrations

**Status:** Aceito

**Data:** 2026-06-10

## Contexto

O projeto iniciou com `hibernate.ddl-auto=create/update`, que recria ou atualiza o schema
automaticamente. Em produção, esta abordagem é perigosa: pode apagar dados ou falhar silenciosamente
em alterações complexas (ex: renomear colunas).

## Decisão

Utilizamos Flyway para gerenciar todas as migrations de banco de dados. Scripts SQL versionados
em `src/main/resources/db/migration/` com nomenclatura `V{n}__{descricao}.sql`.

Configuração:
- Local (H2): Flyway **desabilitado**, H2 usa `ddl-auto=update` para agilidade no desenvolvimento
- Produção (PostgreSQL): Flyway **habilitado**, `ddl-auto=validate`, `baseline-on-migrate=true`

## Justificativa

- **Rastreabilidade:** cada alteração de schema é um arquivo versionado no git
- **Reproducibilidade:** qualquer ambiente pode ser recriado exatamente do zero
- **Segurança:** em produção nunca perdemos dados por `ddl-auto=create`
- **Onboarding:** novos desenvolvedores executam `mvn spring-boot:run` e o schema é criado automaticamente

## Alternativas Consideradas

- **Liquibase:** equivalente em funcionalidade, mas XML/YAML como formato padrão é menos legível
  que SQL puro. Flyway é mais simples para projetos SQL-only.
- **Hibernate `ddl-auto=update` em produção:** conveniente, mas sem garantias de atomicidade,
  sem rollback e sem rastreabilidade. Rejeitado por risco em produção.
- **Migrations manuais:** propensa a erros humanos e sem controle de versão integrado.

## Consequências

### Positivas
- Deploy reproduzível em qualquer ambiente
- Histórico completo de alterações de schema no git
- `baseline-on-migrate` permite adotar Flyway em banco existente sem recriar do zero

### Negativas / Trade-offs
- Desenvolvedores precisam criar arquivos de migration para mudanças de schema (não é automático)
- H2 local não executa Flyway — possíveis incompatibilidades de SQL entre H2 e PostgreSQL
  (mitigado com `NON_KEYWORDS=VALUE` e evitando features específicas de cada DB)

## Referências

- [Flyway Documentation](https://documentation.red-gate.com/flyway)
- [Spring Boot + Flyway Integration](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
