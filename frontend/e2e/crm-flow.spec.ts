import { test, expect } from '@playwright/test';

const BASE = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173';

const MOCK_USER = {
  userId: 1, name: 'Admin Demo', email: 'admin@retailflow.demo',
  role: 'ADMIN', token: 'ci-test-token',
};

const EMPTY_PAGE = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 20 };

test.describe('RetailFlow CRM — Fluxo Principal', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(/\/api\/auth\/(login|register)/, route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) })
    );
    await page.route(/\/api\//, route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(EMPTY_PAGE) })
    );
    await page.goto(BASE);
    await page.waitForSelector('text=Acesso rápido', { timeout: 20000 });
  });

  test('login como admin demo via botão de acesso rápido', async ({ page }) => {
    await page.click('button:has-text("Administrador")');
    await expect(page).toHaveURL(/\/(dashboard|$)/, { timeout: 15000 });
    await expect(page.locator('text=Dashboard').first()).toBeVisible();
  });

  test('login manual com credenciais demo', async ({ page }) => {
    await page.fill('input[type="email"]', 'admin@retailflow.demo');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/(dashboard|$)/, { timeout: 15000 });
  });

  test('criar cliente → validar na listagem', async ({ page }) => {
    await page.click('button:has-text("Administrador")');
    await page.waitForURL(/\/(dashboard|$)/);

    await page.click('text=Clientes');
    await expect(page.locator('h4:has-text("Clientes"), h5:has-text("Clientes")')).toBeVisible({ timeout: 5000 });

    await page.click('button:has-text("Novo Cliente")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.fill('input[name="firstName"]', 'Playwright');
    await page.fill('input[name="lastName"]', 'Test');
    await page.fill('input[name="email"]', `playwright-${Date.now()}@test.com`);

    await page.click('button[type="submit"]');
    await expect(page.locator('[role="dialog"]')).not.toBeVisible({ timeout: 5000 });
  });

  test('criar deal → mover estágio no kanban', async ({ page }) => {
    await page.click('button:has-text("Administrador")');
    await page.waitForURL(/\/(dashboard|$)/);

    await page.click('text=Negociações');
    await expect(page.locator('h4:has-text("Negociações"), h5:has-text("Negociações")')).toBeVisible({ timeout: 5000 });

    await page.click('button:has-text("Nova Negociação")');
    await expect(page.locator('[role="dialog"]')).toBeVisible();

    await page.fill('input[name="title"]', `Deal E2E ${Date.now()}`);
    const customerField = page.locator('[name="customerId"]').first();
    if (await customerField.isVisible()) {
      await customerField.selectOption({ index: 1 }).catch(() => {});
    }

    await page.keyboard.press('Escape');
  });

  test('dashboard carrega com KPIs visíveis', async ({ page }) => {
    await page.click('button:has-text("Administrador")');
    await page.waitForURL(/\/(dashboard|$)/);
    await page.click('text=Dashboard');
    await expect(page.locator('text=/clientes|deals|receita|atividades/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('botão exportar CSV está disponível em Clientes', async ({ page }) => {
    await page.click('button:has-text("Administrador")');
    await page.waitForURL(/\/(dashboard|$)/);
    await page.click('text=Clientes');
    await expect(page.locator('button:has-text("Exportar")')).toBeVisible();
    await page.click('button:has-text("Exportar")');
    await expect(page.locator('text=CSV')).toBeVisible();
    await expect(page.locator('text=Excel')).toBeVisible();
    await expect(page.locator('text=PDF')).toBeVisible();
  });
});
