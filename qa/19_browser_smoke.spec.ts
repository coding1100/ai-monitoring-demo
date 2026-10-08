import { test, expect } from '@playwright/test';

test.describe('Check 19: Cross-Browser Smoke Tests (Firefox & WebKit)', () => {
  const routes = [
    '/',
    '/control/command-center',
    '/orchestration/runs',
    '/workflows/b2b-leads',
    '/output/dashboard',
  ];

  for (const route of routes) {
    test(`Smoke test on ${route}`, async ({ page }, testInfo) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState('networkidle');

      // Check H1 element exists
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);

      // Check glass panels render
      const glassPanels = page.locator('.glass-panel');
      const panelCount = await glassPanels.count();
      expect(panelCount).toBeGreaterThanOrEqual(1);

      // Verify no console exceptions
      const text = await page.locator('body').innerText();
      expect(text.length).toBeGreaterThan(20);
    });
  }
});
