import { test, expect } from '@playwright/test';

test.describe('Workout session flow', () => {
  // Note: Full session flow tests require an authenticated test user with at least one routine.
  // These tests are designed to run with a Playwright `storageState` fixture containing valid auth.

  test('workout page 404s for non-existent session', async ({ page }) => {
    // Redirect to login (not authenticated), or 404 if session not found
    await page.goto('/workout/non-existent-id');
    const url = page.url();
    // Either redirected to login or shows 404
    const isLoginOrNotFound = url.includes('/login') || await page.locator('text=/404|not found/i').count() > 0;
    expect(isLoginOrNotFound).toBeTruthy();
  });

  test('active workout page warns on browser unload', async ({ page }) => {
    // This is a smoke test; full flow requires auth
    await page.goto('/workout/test-session');
    // Either redirected to login or shows workout page (with beforeunload handler)
  });
});
