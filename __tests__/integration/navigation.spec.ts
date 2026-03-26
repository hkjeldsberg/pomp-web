import { test, expect } from '@playwright/test';

test.describe('Deep linking and browser navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes test user is already signed in via storage state or setup fixture
    await page.goto('/');
  });

  test('session detail URL loads in a new tab', async ({ browser }) => {
    const page = await browser.newPage();
    // Navigate directly to a history detail page URL
    await page.goto('/');
    await page.waitForSelector('a[href^="/history/"]');
    const firstLink = page.locator('a[href^="/history/"]').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();

    // Open the URL in a new page
    const detailPage = await browser.newPage();
    await detailPage.goto(`http://localhost:3000${href}`);
    await detailPage.waitForLoadState('networkidle');
    // Should render session detail (has "Tilbake" link)
    expect(await detailPage.locator('text=Tilbake').count()).toBeGreaterThan(0);
    await detailPage.close();
    await page.close();
  });

  test('browser Back button returns to history list from session detail', async ({ page }) => {
    await page.waitForSelector('a[href^="/history/"]');
    const firstLink = page.locator('a[href^="/history/"]').first();
    await firstLink.click();
    await page.waitForLoadState('networkidle');

    // Press browser back
    await page.goBack();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('localhost:3000/');
    // History list should be visible
    await expect(page.locator('h1', { hasText: 'Historikk' })).toBeVisible();
  });

  test('all main pages load correctly on hard refresh', async ({ page }) => {
    const routes = ['/', '/routines', '/exercises', '/statistics'];
    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain(route === '/' ? 'localhost:3000' : route);
    }
  });
});
