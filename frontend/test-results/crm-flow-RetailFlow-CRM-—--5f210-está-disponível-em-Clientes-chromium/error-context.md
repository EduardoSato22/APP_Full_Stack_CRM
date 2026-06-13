# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: crm-flow.spec.ts >> RetailFlow CRM — Fluxo Principal >> botão exportar CSV está disponível em Clientes
- Location: e2e\crm-flow.spec.ts:84:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('text=Clientes')
    - locator resolved to <span class="MuiTypography-root MuiTypography-body1 MuiListItemText-primary css-jyfsso-MuiTypography-root">Clientes</span>
  - attempting click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';
  4  | 
  5  | const MOCK_USER = {
  6  |   userId: 1, name: 'Admin Demo', email: 'admin@retailflow.demo',
  7  |   role: 'ADMIN', token: 'ci-test-token',
  8  | };
  9  | 
  10 | const EMPTY_PAGE = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 };
  11 | 
  12 | test.describe('RetailFlow CRM — Fluxo Principal', () => {
  13 |   test.beforeEach(async ({ page }) => {
  14 |     await page.addInitScript(() => localStorage.setItem('cookie_consent', 'accepted'));
  15 |     await page.route(/\/api\/auth\/(login|register)/, route =>
  16 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) })
  17 |     );
  18 |     await page.route(/\/api\/dashboard\/(revenue-trend|pipeline-funnel|top-products)/, route =>
  19 |       route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  20 |     );
  21 |     await page.route(/\/api\//, route =>
  22 |       route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_PAGE) })
  23 |     );
  24 |     await page.goto(BASE);
  25 |     await page.waitForSelector('text=Acesso rápido', { timeout: 20000 });
  26 |   });
  27 | 
  28 |   test('login como admin demo via botão de acesso rápido', async ({ page }) => {
  29 |     await page.click('button:has-text("Administrador")');
  30 |     await expect(page).toHaveURL(/\/(dashboard|$)/, { timeout: 15000 });
  31 |     await expect(page.locator('text=Dashboard').first()).toBeVisible();
  32 |   });
  33 | 
  34 |   test('login manual com credenciais demo', async ({ page }) => {
  35 |     await page.fill('input[type="email"]', 'admin@retailflow.demo');
  36 |     await page.fill('input[type="password"]', 'admin123');
  37 |     await page.click('button[type="submit"]');
  38 |     await expect(page).toHaveURL(/\/(dashboard|$)/, { timeout: 15000 });
  39 |   });
  40 | 
  41 |   test('criar cliente → validar na listagem', async ({ page }) => {
  42 |     await page.click('button:has-text("Administrador")');
  43 |     await page.waitForURL(/\/(dashboard|$)/);
  44 | 
  45 |     await page.click('text=Clientes');
  46 |     await expect(page.locator('h4:has-text("Clientes"), h5:has-text("Clientes")')).toBeVisible({ timeout: 5000 });
  47 | 
  48 |     await page.click('button:has-text("Novo Cliente")');
  49 |     await expect(page.locator('[role="dialog"]')).toBeVisible();
  50 | 
  51 |     await page.fill('input[name="firstName"]', 'Playwright');
  52 |     await page.fill('input[name="lastName"]', 'Test');
  53 |     await page.fill('input[name="email"]', `playwright-${Date.now()}@test.com`);
  54 | 
  55 |     await page.click('button[type="submit"]');
  56 |     await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5000 });
  57 |   });
  58 | 
  59 |   test('criar deal → mover estágio no kanban', async ({ page }) => {
  60 |     await page.click('button:has-text("Administrador")');
  61 |     await page.waitForURL(/\/(dashboard|$)/);
  62 | 
  63 |     await page.click('text=Negociações');
  64 |     await expect(page.locator('h4:has-text("Negociações"), h5:has-text("Negociações")')).toBeVisible({ timeout: 5000 });
  65 | 
  66 |     await page.click('button:has-text("Nova Negociação")');
  67 |     await expect(page.locator('[role="dialog"]')).toBeVisible();
  68 | 
  69 |     await page.fill('input[name="title"]', `Deal E2E ${Date.now()}`);
  70 |     const customerField = page.locator('[name="customerId"]').first();
  71 |     if (await customerField.isVisible()) {
  72 |       await customerField.selectOption({ index: 1 }).catch(() => {});
  73 |     }
  74 | 
  75 |     await page.keyboard.press('Escape');
  76 |   });
  77 | 
  78 |   test('dashboard carrega com KPIs visíveis', async ({ page }) => {
  79 |     await page.click('button:has-text("Administrador")');
  80 |     await page.waitForURL(/\/(dashboard|$)/);
  81 |     await expect(page.locator('text=/clientes|deals|receita|atividades/i').first()).toBeVisible({ timeout: 10000 });
  82 |   });
  83 | 
  84 |   test('botão exportar CSV está disponível em Clientes', async ({ page }) => {
  85 |     await page.click('button:has-text("Administrador")');
  86 |     await page.waitForURL(/\/(dashboard|$)/);
> 87 |     await page.click('text=Clientes');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  88 |     await expect(page.locator('button:has-text("Exportar")')).toBeVisible();
  89 |     await page.click('button:has-text("Exportar")');
  90 |     await expect(page.locator('text=CSV')).toBeVisible();
  91 |     await expect(page.locator('text=Excel')).toBeVisible();
  92 |     await expect(page.locator('text=PDF')).toBeVisible();
  93 |   });
  94 | });
  95 | 
```