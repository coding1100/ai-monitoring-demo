import { test, expect } from '@playwright/test';
import { ALL_ROUTES } from './routes';

test.describe('Check 3: Dead Buttons Sweep', () => {
  for (const route of ALL_ROUTES) {
    test(`Screen ${route}: all visible buttons and links trigger active state or navigation`, async ({ page }) => {
      test.setTimeout(180000);
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      // Get all visible buttons and links inside main content area (excluding sidebar/footer repetitive navigation)
      const actionButtons = page.locator('main button:visible, main a:visible');
      const count = await actionButtons.count();

      for (let i = 0; i < count; i++) {
        await page.goto(route);
        await page.waitForLoadState('domcontentloaded');

        const btn = page.locator('main button:visible, main a:visible').nth(i);
        const isVisible = await btn.isVisible().catch(() => false);
        if (!isVisible) continue;

        const isDisabled = await btn.isDisabled().catch(() => false);
        if (isDisabled) {
          // Disabled buttons must have title/tooltip explaining why
          const title = await btn.getAttribute('title').catch(() => null);
          const parentTitle = await btn.locator('xpath=..').getAttribute('title').catch(() => null);
          expect(title || parentTitle, `Disabled button at index ${i} on ${route} must have explanatory tooltip`).toBeTruthy();
          continue;
        }

        const btnLabel = (await btn.innerText().catch(() => '')).trim() || `btn-${i}`;

        const isAlreadyActive = await btn.evaluate((el) => {
          return (
            el.getAttribute('aria-selected') === 'true' ||
            el.getAttribute('aria-current') === 'page' ||
            el.getAttribute('aria-pressed') === 'true' ||
            el.classList.contains('active') ||
            el.classList.contains('bg-blue-600') ||
            el.classList.contains('bg-accent') ||
            el.classList.contains('text-white')
          );
        }).catch(() => false);

        const initialUrl = page.url();
        const initialText = await page.evaluate(() => document.body.innerText);
        const initialHtml = await page.evaluate(() => document.body.innerHTML);

        await btn.click({ timeout: 5000 }).catch(() => {});
        await page.waitForTimeout(400);

        const currentUrl = page.url();
        const currentText = await page.evaluate(() => document.body.innerText);
        const currentHtml = await page.evaluate(() => document.body.innerHTML);
        const modalVisible = (await page.locator('[role="dialog"]:visible, .glass-modal:visible').count()) > 0;

        const changed = currentUrl !== initialUrl || currentText !== initialText || currentHtml !== initialHtml || modalVisible || isAlreadyActive;
        expect(changed, `Button/link "${btnLabel}" at index ${i} on ${route} must trigger state change or navigation`).toBe(true);

        if (modalVisible) {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        }
      }
    });
  }
});
