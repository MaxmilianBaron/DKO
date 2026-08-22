import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const baseURL = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/';

test.beforeAll(async () => {
  await fs.mkdir('artifacts/ui', { recursive: true });
});

test('desktop wrapper exposes a 390 × 844 interactive preview', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 980 });
  await page.goto(baseURL, { waitUntil: 'load' });
  await expect(page.getByText('Digitální Správa Objektů · mobile preview')).toBeVisible();
  const phone = page.locator('.phone');
  await expect(phone).toHaveCSS('width', '390px');
  await expect(phone).toHaveCSS('height', '844px');
  await page.screenshot({ path: 'artifacts/ui/desktop-wrapper.png', fullPage: true });
});

test('login, dashboard and work flow are interactive', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}app/`, { waitUntil: 'load' });
  await expect(page.locator('[data-screen="login"]')).toBeVisible();
  await page.getByTestId('technician-card').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByTestId('login-button').click();
  await expect(page.locator('[data-screen="dashboard"]')).toBeVisible();
  await expect(page.getByText('Vše důležité po ruce')).toBeVisible();
  await page.getByRole('button', { name: /Práce/ }).first().click();
  await expect(page.getByText('Domy podle termínu')).toBeVisible();
  await page.getByRole('button', { name: /Zahájit kontrolu/ }).first().click();
  await expect(page.locator('[data-screen="inspection"]')).toBeVisible();
  await page.screenshot({ path: 'artifacts/ui/inspection.png', fullPage: true });
});

test('theme and archive preview work without a backend', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}app/`, { waitUntil: 'load' });
  await page.getByLabel('Přepnout vzhled').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByTestId('technician-card').click();
  await page.getByTestId('login-button').click();
  await page.getByRole('button', { name: /Historie/ }).first().click();
  await expect(page.getByText('Archiv protokolů')).toBeVisible();
  await page.getByRole('button', { name: /Otevřít PDF/ }).first().click();
  await expect(page.locator('[data-screen="pdf"]')).toBeVisible();
  await expect(page.getByText('Protokol o kontrole objektu')).toBeVisible();
  await page.screenshot({ path: 'artifacts/ui/pdf-dark.png', fullPage: true });
});

test('V100 modular notification settings use saved and changed button states', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}app/`, { waitUntil: 'load' });
  await page.getByTestId('technician-card').click();
  await page.getByTestId('login-button').click();
  await page.getByRole('button', { name: /Nastavení/ }).first().click();
  await page.getByRole('button', { name: /Upozornění/ }).click();
  await expect(page.getByText('Kontroly zítra')).toBeVisible();
  await expect(page.getByText('Kontroly dnes', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('Prošlé kontroly', { exact: true }).first()).toBeVisible();
  const save = page.getByRole('button', { name: 'Uložit nastavení upozornění' });
  await expect(save).toBeDisabled();
  await page.locator('[data-notification-input]').first().fill('2');
  await expect(save).toBeEnabled();
  await save.click();
  await expect(save).toBeDisabled();
  await page.screenshot({ path: 'artifacts/ui/notifications-v100.png', fullPage: true });
});
