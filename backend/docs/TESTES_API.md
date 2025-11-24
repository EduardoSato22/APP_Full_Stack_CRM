S# Guia de Testes da RetailFlow API

Este roteiro consolida os cenários cobrados nos PDFs da disciplina e no Desafio Final.

## 🔧 Preparação

- **Base local:** `http://localhost:8080/api`  
- **Token:** obtenha via `/auth/login` antes de acessar rotas protegidas.  
- **Header padrão:** `Authorization: Bearer {SEU_TOKEN}`

---

## 1️⃣ Autenticação

### Registrar usuário

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

Resposta esperada:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "userId": 1,
  "name": "João Silva",
  "email": "joao@email.com"
}
```

---

## 2️⃣ CRUD de Clientes

### Criar

```bash
curl -X POST http://localhost:8080/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "firstName": "Ana",
    "lastName": "Souza",
    "email": "ana@empresa.com",
    "age": 28,
    "photoUrl": "https://i.pravatar.cc/150?img=15"
  }'
```

### Listar

```bash
curl -X GET http://localhost:8080/api/customers \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Buscar por ID

```bash
curl -X GET http://localhost:8080/api/customers/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Atualizar

```bash
curl -X PUT http://localhost:8080/api/customers/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "firstName": "Ana Paula",
    "lastName": "Souza",
    "email": "ana@empresa.com",
    "age": 29,
    "photoUrl": "https://i.pravatar.cc/150?img=15"
  }'
```

### Remover

```bash
curl -X DELETE http://localhost:8080/api/customers/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 3️⃣ CRUD de Produtos

### Criar

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Notebook Pro 14",
    "description": "Tela retina, 16 GB RAM, 512 GB SSD",
    "price": 8999.90
  }'
```

### Listar

```bash
curl -X GET http://localhost:8080/api/products \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Buscar por ID

```bash
curl -X GET http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

### Atualizar

```bash
curl -X PUT http://localhost:8080/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Notebook Pro 14 2025",
    "description": "Nova geração com M4",
    "price": 9999.90
  }'
```

### Remover

```bash
curl -X DELETE http://localhost:8080/api/products/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

---

## 4️⃣ Segurança

- **Sem token:** `GET /api/customers` → `403 Forbidden`
- **Token inválido:** `GET /api/products` com `Authorization: Bearer token_fake` → `403 Forbidden`
- **Cross user:** tente acessar `/api/customers/{id}` criado por outro usuário → `RuntimeException` com mensagem *Acesso negado*.

---

## 5️⃣ Validações

- Cliente sem `firstName` → `400 Bad Request` com mensagem *Informe o nome*.
- Cliente com email duplicado para o mesmo usuário → *Já existe um cliente com este e-mail*.
- Produto com `price = 0` → *Preço deve ser maior que zero*.
- Registro com email existente → *Email já cadastrado*.

---

## 6️⃣ Checklist rápido

- [ ] Registrar e autenticar usuário  
- [ ] CRUD completo de clientes  
- [ ] CRUD completo de produtos  
- [ ] Bloqueio sem token/token inválido  
- [ ] Validações de campos e e-mail duplicado  
- [ ] Swagger disponível em `/swagger-ui.html`  
- [ ] Banco populado via `data.sql` conforme requisito do desafio  
- [ ] Frontend comunicando-se com os endpoints (veja `src/App.tsx`)

---

Boa sorte nos testes! 🚀