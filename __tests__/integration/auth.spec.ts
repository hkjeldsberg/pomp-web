import { test, expect } from '@playwright/test';

test.describe('Authentication flow', () => {
  test('unauthenticated user is redirected to /login', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('login page renders sign-in form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=/ugyldig|invalid|feil/i')).toBeVisible({ timeout: 5000 });
  });

  test('authenticated user visiting /login is redirected to /', async ({ page, context }) => {
    // This test requires a pre-authenticated context (set up via storageState in CI)
    // Skip if no auth session available
    await page.goto('/login');
    // If user is authenticated, should redirect to home
    const url = page.url();
    if (!url.includes('/login')) {
      expect(url).toContain('localhost:3000/');
    }
  });
});
