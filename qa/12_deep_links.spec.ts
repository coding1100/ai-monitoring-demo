import { test, expect } from '@playwright/test';

test.describe('Check 12: Deep Links & 404 Handling', () => {
  const deepRoutes = [
    '/data/leads',
    '/orchestration/runs',
    '/data/crm',
    '/workflows/email-sequences',
    '/workspace/settings',
  ];

  for (const route of deepRoutes) {
    test(`Direct visit and refresh on deep route ${route} loads properly`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Refresh preview
      const reloadResponse = await page.reload();
      expect(reloadResponse?.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Ensure page didn't crash or go blank
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });
  }

  test('Unknown route shows a proper Not Found (404) screen', async ({ page }) => {
    await page.goto('/unknown-route-that-does-not-exist');
    await page.waitForLoadState('networkidle');

    // Check for 404 / Not Found message or element
    const notFoundText = page.locator('text=404').or(page.locator('text=Page Not Found')).or(page.locator('text=Not Found'));
    await expect(notFoundText.first()).toBeVisible({ timeout: 5000 });
  });
});
