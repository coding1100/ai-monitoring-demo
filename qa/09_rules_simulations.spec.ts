import { test, expect } from '@playwright/test';

test.describe('Check 9: Rules in Code Simulations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Runs opt-out, bounce spike, and spend cap simulations and verifies decision logs', async ({ page }) => {
    await page.goto('/orchestration/rules');
    await page.waitForLoadState('networkidle');

    // Count initial logs in table
    const initialLogRows = await page.locator('table tbody tr').count();

    // 1. Simulate Opt-Out
    const optOutBtn = page.locator('button:has-text("Simulate Opt-Out")').first();
    await expect(optOutBtn).toBeVisible();
    await optOutBtn.click();
    await page.waitForTimeout(600);

    // Verify toast or notification or log updated
    await expect(page.locator('text=Simulated Opt-Out').or(page.locator('text=RULE_OPT_OUT_IMMEDIATE')).first()).toBeVisible();

    // 2. Simulate Bounce Spike
    const bounceBtn = page.locator('button:has-text("Simulate Bounce Spike")').first();
    await expect(bounceBtn).toBeVisible();
    await bounceBtn.click();
    await page.waitForTimeout(600);

    await expect(page.locator('text=Simulated Bounce Spike').or(page.locator('text=RULE_BOUNCE_THRESHOLD_PAUSE')).first()).toBeVisible();

    // 3. Simulate Spend Cap
    const spendBtn = page.locator('button:has-text("Simulate Spend Cap")').first();
    await expect(spendBtn).toBeVisible();
    await spendBtn.click();
    await page.waitForTimeout(600);

    await expect(page.locator('text=Simulated Spend Cap Breach').or(page.locator('text=RULE_CAMPAIGN_SPEND_CAP')).first()).toBeVisible();

    // Confirm new log entries added to the decision log table
    const finalLogRows = await page.locator('table tbody tr').count();
    expect(finalLogRows).toBeGreaterThan(initialLogRows);
  });
});
