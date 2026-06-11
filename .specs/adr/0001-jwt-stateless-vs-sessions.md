# ADR-0001: JWT Stateless vs Sessões de Servidor

**Status:** Aceito

**Data:** 2026-06-10

## Contexto

O RetailFlow CRM precisa de autenticação para proteger as APIs REST. O sistema será deployado
em ambientes que podem ter múltiplas instâncias (ex: Render, Railway), o que torna sessões de
servidor com estado problemáticas sem um session store compartilhado.

## Decisão

Utilizamos JWT (JSON Web Tokens) stateless para autenticação de API. O access token tem TTL de
15 minutos (`jwt.expiration=900000`) e o refresh token é persistido no banco com TTL de 7 dias.

## Justificativa

- **Horizontal scaling:** múltiplas instâncias do backend não precisam compartilhar estado de sessão
- **Compatibilidade:** tokens JWT funcionam nativamente com React SPA e mobile clients
- **Padrão de mercado:** amplamente adotado para APIs REST modernas

## Alternativas Consideradas

- **Spring Session + Redis:** funcional, mas adiciona dependência obrigatória de Redis para algo
  que pode ser resolvido com JWT. Redis já é usado para cache — misturar responsabilidades aumenta
  o acoplamento.
- **Sessões HTTP padrão:** não escalam horizontalmente sem sticky sessions ou session store
  compartilhado. Incompatível com o modelo SPA.
- **Opaque tokens + token introspection:** mais seguro (tokens podem ser revogados imediatamente),
  mas requer chamada extra ao servidor a cada request.

## Consequências

### Positivas
- API completamente stateless para requests autenticados via JWT
- Escala horizontalmente sem configuração adicional
- Refresh token no banco permite revogar sessões (logout real)

### Negativas / Trade-offs
- Access token não pode ser invalidado antes do TTL (15min) sem blacklist em Redis
- Refresh token requer uma tabela extra (`refresh_tokens`) e lógica de revogação
- OAuth2 Social Login requer `SessionCreationPolicy.IF_REQUIRED` (sessão para guardar o CSRF state do OAuth2 dance)

## Referências

- [RFC 7519 — JSON Web Token](https://www.rfc-editor.org/rfc/rfc7519)
- [OWASP JWT Security Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
