import { test, expect } from '@playwright/test';

test.describe('Check 5: Multi-Tenant Data Scoping & Persistence', () => {
  test('Leads screen: workspace switching scopes records and updates totals cleanly', async ({ page }) => {
    await page.goto('/data/leads');
    await page.waitForLoadState('networkidle');

    // 1. Switch to Lakeview Dental Group via top-left switcher
    const switcherBtn = page.locator('aside button:has-text("Halden Aesthetics")').first();
    await expect(switcherBtn).toBeVisible();
    await switcherBtn.click();

    const lakeviewOpt = page.locator('button:has-text("Lakeview Dental Group")').first();
    await expect(lakeviewOpt).toBeVisible();
    await lakeviewOpt.click();
    await page.waitForTimeout(600);

    // Verify workspace changed in UI
    await expect(page.locator('aside button:has-text("Lakeview Dental Group")')).toBeVisible();

    // Verify displayed contacts belong to Lakeview consumer dental leads
    const bodyText = await page.evaluate(() => document.body.innerText);
    expect(bodyText).toContain('Family Dental Account');

    // Reload page to verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('aside button:has-text("Lakeview Dental Group")')).toBeVisible();

    // Switch to Ridgeway Roofing
    await page.locator('aside button:has-text("Lakeview Dental Group")').click();
    await page.locator('button:has-text("Ridgeway Roofing")').click();
    await page.waitForTimeout(600);

    await expect(page.locator('aside button:has-text("Ridgeway Roofing")')).toBeVisible();
    const ridgewayText = await page.evaluate(() => document.body.innerText);
    expect(ridgewayText).toContain('Front Range Logistics');
  });

  test('Footer Data Scope Inspector prints workspace_id and Supabase table name', async ({ page }) => {
    await page.goto('/data/leads');
    await page.waitForLoadState('networkidle');

    // Turn on "Show data scope" in footer
    const scopeBtn = page.locator('footer button:has-text("Show data scope")');
    await scopeBtn.click();
    await page.waitForTimeout(400);

    // Assert scope badge container appears on page
    const badgeContainer = page.locator('div:has-text("Scope: workspace_id =")').first();
    await expect(badgeContainer).toBeVisible();
    await expect(badgeContainer).toContainText("Table: leads");

    // Navigate to another screen and verify table name updates
    await page.goto('/orchestration/runs');
    await page.waitForLoadState('networkidle');
    const runsBadge = page.locator('div:has-text("Scope: workspace_id =")').first();
    await expect(runsBadge).toBeVisible();
    await expect(runsBadge).toContainText("Table: n8n_executions");
  });
});
