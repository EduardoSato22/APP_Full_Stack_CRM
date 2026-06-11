# ADR-0004: MapStruct vs Mapeamento Manual de DTOs

**Status:** Aceito

**Data:** 2026-06-10

## Contexto

O sistema precisa converter entre entidades JPA e DTOs de resposta/request em todos os
controllers. Inicialmente os DTOs tinham métodos estáticos `fromEntity()` e os services
faziam mapeamento manual campo a campo.

## Decisão

Adotamos **MapStruct** (`mapstruct:1.5.5.Final`) para geração de código de mapeamento em
tempo de compilação, com Lombok configurado **antes** do MapStruct no `annotationProcessorPaths`.

Cada domínio tem um mapper dedicado: `CustomerMapper`, `ProductMapper`, `DealMapper`, `ActivityMapper`.

## Justificativa

- **Type safety:** erros de mapeamento são detectados em compile-time, não em runtime
- **Performance:** código gerado é tão eficiente quanto mapeamento manual (sem reflection)
- **Manutenibilidade:** ao adicionar campos às entidades, o compilador avisa sobre campos
  não mapeados (`unmappedTargetPolicy = ReportingPolicy.IGNORE` quando intencional)
- **Portfólio:** demonstra conhecimento de ferramentas de produção amplamente usadas

## Alternativas Consideradas

- **ModelMapper:** usa reflection em runtime, mais lento e menos type-safe. Rejeita campos
  com nomes diferentes silenciosamente.
- **Mapeamento manual (static `fromEntity()`):** sem dependências extras, mas verboso.
  Com ~10 entidades e múltiplos DTOs, o código de mapeamento seria > 500 linhas de boilerplate.
- **Jackson `ObjectMapper`:** funcional para JSON, mas péssimo para mapeamentos complexos
  com relações (lazy loading JPA pode causar N+1).

## Consequências

### Positivas
- Boilerplate de mapeamento eliminado (~300 linhas removidas)
- `@MappingTarget` para updates parciais (PUT/PATCH) sem recriar entidades
- `@Mapping(target="x", ignore=true)` documenta explicitamente campos calculados ou imutáveis

### Negativas / Trade-offs
- Configuração inicial é mais complexa: Lombok deve vir antes do MapStruct no APT
  (caso contrário MapStruct não encontra getters/setters gerados pelo Lombok)
- Debugging de mapeamentos requer olhar o código gerado em `target/generated-sources/`
- Curva de aprendizado para mapeamentos complexos com relações bidirecionais

## Referências

- [MapStruct Reference Guide](https://mapstruct.org/documentation/stable/reference/html/)
- [MapStruct + Lombok: Known Issues](https://mapstruct.org/faq/#can-i-use-mapstruct-together-with-project-lombok)
