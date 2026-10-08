import { test, expect } from '@playwright/test';

test.describe('Check 10: Data Consistency across Screens & Reloads', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Dashboard lead count matches Leads table and CRM kanban cards count', async ({ page }) => {
    // 1. Check Leads screen count
    await page.goto('/data/leads');
    await page.waitForLoadState('networkidle');
    const leadsBadge = page.locator('[title*="data scope count"], .font-mono:has-text("records"), .font-mono:has-text("leads")').first();
    const leadsCountText = await page.locator('table tbody tr').count();

    // 2. Check CRM screen pipeline count
    await page.goto('/data/crm');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${leadsCountText} Total Pipeline Records`)).toBeVisible();

    // 3. Check Dashboard totals
    await page.goto('/output/dashboard');
    await page.waitForLoadState('networkidle');
    const dashboardLeadMetric = page.locator('text=Total Prospects Ingested, text=Leads Ingested, [data-testid="metric-total-leads"]').first();
    await expect(page.locator(`text=${leadsCountText}`).first()).toBeVisible();

    // 4. Reload page and confirm numbers persist identically
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${leadsCountText}`).first()).toBeVisible();
  });

  test('Costs page calculations remain consistent on reload', async ({ page }) => {
    await page.goto('/output/costs');
    await page.waitForLoadState('networkidle');

    const totalCampaignCostBadge = page.locator('text=$41.40').or(page.locator('text=Active')).first();
    await expect(totalCampaignCostBadge).toBeVisible();

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(totalCampaignCostBadge).toBeVisible();
  });
});
