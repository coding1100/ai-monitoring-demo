import { test, expect } from '@playwright/test';

test.describe('Check 7: Integrations & Secret Masking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('All integration keys are masked in DOM and localStorage', async ({ page }) => {
    await page.goto('/workspace/integrations');
    await page.waitForLoadState('networkidle');

    // Check all API key inputs in the DOM
    const inputs = page.locator('input[readonly]');
    const count = await inputs.count();
    expect(count).toBeGreaterThanOrEqual(8);

    for (let i = 0; i < count; i++) {
      const val = await inputs.nth(i).inputValue();
      expect(val).toContain('••');
      expect(val).not.toMatch(/^sk-[a-zA-Z0-9]{32,}$/);
    }

    // Check localStorage secrets
    const storageState = await page.evaluate(() => {
      const demoStore = localStorage.getItem('ai-marketing-demo-storage');
      return demoStore ? JSON.parse(demoStore) : null;
    });

    if (storageState && storageState.state?.connections) {
      const allConns = Object.values(storageState.state.connections).flat() as any[];
      for (const conn of allConns) {
        expect(conn.apiKeyMasked).toBeDefined();
        expect(conn.apiKeyMasked).toContain('••');
      }
    }
  });

  test('Test connection buttons execute and update status and timestamp', async ({ page }) => {
    await page.goto('/workspace/integrations');
    await page.waitForLoadState('networkidle');

    const testButtons = page.locator('button:has-text("Test")');
    const btnCount = await testButtons.count();
    expect(btnCount).toBeGreaterThanOrEqual(1);

    // Test first connection
    const firstBtn = testButtons.first();
    await firstBtn.click();

    // Verify it updates or completes
    await page.waitForTimeout(1000);
    const connectedBadge = page.locator('text=connected').first();
    await expect(connectedBadge).toBeVisible();

    // Verify last tested updated
    const lastTestedSpan = page.locator('text=Last Tested:').first();
    await expect(lastTestedSpan).toBeVisible();
  });

  test('OpenAI dedicated screen test connection works with masked secrets', async ({ page }) => {
    await page.goto('/orchestration/openai');
    await page.waitForLoadState('networkidle');

    const keyInput = page.locator('input[value*="••••"]');
    await expect(keyInput).toBeVisible();

    const testBtn = page.locator('button:has-text("Test API Connection")');
    if (await testBtn.isVisible()) {
      await testBtn.click();
      await page.waitForTimeout(1000);
      await expect(page.locator('text=connected').first()).toBeVisible();
    }
  });
});
