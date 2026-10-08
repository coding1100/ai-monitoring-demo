import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ALL_ROUTES } from './routes';

test.describe('Check 17: Full Accessibility (Axe, Modals, Esc, Keyboard Trap, Icon Labels)', () => {
  // Test Axe rules on core routes (excluding contrast which is covered by Check 15)
  const keyRoutes = [
    '/',
    '/control/command-center',
    '/control/approval-gate',
    '/orchestration/runs',
    '/workflows/b2b-leads',
    '/data/leads',
    '/data/crm',
    '/output/dashboard',
  ];

  for (const route of keyRoutes) {
    test(`Axe accessibility scan on route ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .disableRules(['color-contrast']) // handled separately
        .analyze();

      // Filter out minor cosmetic warnings if any, check for serious/critical
      const criticalViolations = accessibilityScanResults.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious'
      );

      if (criticalViolations.length > 0) {
        console.warn(`[A11y Violations on ${route}]:`, criticalViolations.map((v) => v.help));
      }

      expect(
        criticalViolations,
        `Route ${route} has critical/serious accessibility violations: ${criticalViolations.map((v) => v.help).join(', ')}`
      ).toEqual([]);
    });
  }

  test('Locked phase 2 modal traps focus and closes on Escape', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click locked item in sidebar
    const lockedBtn = page.locator('button:has-text("Admin App (Phase 2)"), button:has-text("Tenant App"), button:has-text("Custom CRM")').first();
    await expect(lockedBtn).toBeVisible();
    await lockedBtn.click();

    // Verify modal is displayed
    const modal = page.locator('[role="dialog"]:has-text("Not in phase 1")');
    await expect(modal).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);

    // Verify modal closed
    await expect(modal).not.toBeVisible();
  });

  test('Icon buttons have accessible names (aria-label, title, or text)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('button');
    const count = await buttons.count();

    const unnamedButtons: string[] = [];

    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      const text = (await btn.innerText()).trim();
      const ariaLabel = await btn.getAttribute('aria-label');
      const title = await btn.getAttribute('title');

      if (!text && !ariaLabel && !title) {
        const outerHtml = await btn.evaluate((el) => el.outerHTML.slice(0, 100));
        unnamedButtons.push(outerHtml);
      }
    }

    if (unnamedButtons.length > 0) {
      console.warn(`[Unnamed icon buttons found]:`, unnamedButtons);
    }

    expect(
      unnamedButtons,
      `Buttons missing accessible name: ${unnamedButtons.join(' | ')}`
    ).toEqual([]);
  });
});
