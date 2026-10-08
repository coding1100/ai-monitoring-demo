import { test, expect } from '@playwright/test';

test.describe('Check 6: Roles & RBAC Restrictions', () => {
  test('Viewer role disables mutation buttons and displays explanatory tooltip', async ({ page }) => {
    await page.goto('/control/approval-gate');
    await page.waitForLoadState('networkidle');

    // Switch role to Viewer via footer
    await page.locator('footer button:has-text("View as:")').click();
    await page.locator('button:has-text("Viewer")').click();
    await page.waitForTimeout(400);

    // Verify footer shows active Viewer role
    await expect(page.locator('footer:has-text("Viewer")')).toBeVisible();

    // Check approval gate buttons: must be disabled
    const approveBtn = page.locator('button:has-text("Approve Plan")').first();
    const rejectBtn = page.locator('button:has-text("Reject")').first();

    if (await approveBtn.isVisible()) {
      await expect(approveBtn).toBeDisabled();
      const tooltip = await approveBtn.locator('xpath=..').getAttribute('title');
      expect(tooltip).toContain("Role 'viewer' has read-only access");
    }

    if (await rejectBtn.isVisible()) {
      await expect(rejectBtn).toBeDisabled();
    }

    // Navigate to Operator cockpit
    await page.goto('/control/operator');
    await page.waitForLoadState('networkidle');

    const pauseBtn = page.locator('button:has-text("Pause Outbound"), button:has-text("Resume Outbound")').first();
    await expect(pauseBtn).toBeDisabled();

    // Reset role back to Admin
    await page.locator('footer button:has-text("View as:")').click();
    await page.locator('button:has-text("Approve campaigns")').click();
    await page.waitForTimeout(400);

    // Verify button is enabled again
    await expect(pauseBtn).toBeEnabled();
  });
});
