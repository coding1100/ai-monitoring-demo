import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ALL_ROUTES } from './routes';

test.describe('Check 15: Color Contrast & Luminance Analysis', () => {
  // Test key representative routes in light & dark modes
  const sampleRoutes = [
    '/',
    '/control/command-center',
    '/control/approval-gate',
    '/orchestration/runs',
    '/orchestration/rules',
    '/workflows/b2b-leads',
    '/data/leads',
    '/data/crm',
    '/output/dashboard',
    '/output/costs',
    '/workspace/integrations',
  ];

  for (const route of sampleRoutes) {
    for (const theme of ['light', 'dark']) {
      test(`Contrast audit on ${route} (${theme})`, async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState('networkidle');

        if (theme === 'dark') {
          await page.evaluate(() => document.documentElement.classList.add('dark'));
        } else {
          await page.evaluate(() => document.documentElement.classList.remove('dark'));
        }
        await page.waitForTimeout(250);

        const accessibilityScanResults = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze();

        const contrastViolations = accessibilityScanResults.violations.filter(
          (v) => v.id === 'color-contrast'
        );

        if (contrastViolations.length > 0) {
          console.warn(`[Contrast issue on ${route} (${theme})]:`, JSON.stringify(contrastViolations, null, 2));
        }

        expect(contrastViolations, `Route ${route} in ${theme} mode has contrast violations: ${contrastViolations.map(v => v.help).join(', ')}`).toEqual([]);
      });
    }
  }
});
