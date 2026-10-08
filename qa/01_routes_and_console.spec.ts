import { test, expect } from '@playwright/test';
import { ALL_ROUTES } from './routes';

test.describe('Check 1: Routes & Console Health', () => {
  for (const route of ALL_ROUTES) {
    for (const theme of ['light', 'dark']) {
      test(`Route ${route} (${theme} mode): has H1, DiagramChip, zero errors`, async ({ page }) => {
        const consoleErrors: string[] = [];
        const failedRequests: string[] = [];
        const unhandledRejections: string[] = [];

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        page.on('requestfailed', (req) => {
          failedRequests.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
        });

        page.on('pageerror', (err) => {
          unhandledRejections.push(err.message);
        });

        await page.goto(route);
        await page.waitForLoadState('networkidle');

        // Apply theme
        if (theme === 'dark') {
          await page.evaluate(() => document.documentElement.classList.add('dark'));
        } else {
          await page.evaluate(() => document.documentElement.classList.remove('dark'));
        }

        // Check for H1 presence
        const h1 = page.locator('h1');
        const h1Count = await h1.count();
        expect(h1Count, `Route ${route} must have an H1 element`).toBeGreaterThanOrEqual(1);

        // Check for Diagram reference chip in header
        // Header always renders DiagramChip containing reference
        const chip = page.locator('header [title*="Architecture layer box"], [title*="Architecture layer box"]');
        const chipCount = await chip.count();
        expect(chipCount, `Route ${route} must show a diagram reference chip`).toBeGreaterThanOrEqual(1);

        // Check console errors, failed requests, and unhandled rejections
        expect(consoleErrors, `Route ${route} produced console errors: ${consoleErrors.join(', ')}`).toEqual([]);
        expect(failedRequests, `Route ${route} had failed requests: ${failedRequests.join(', ')}`).toEqual([]);
        expect(unhandledRejections, `Route ${route} had unhandled rejections: ${unhandledRejections.join(', ')}`).toEqual([]);
      });
    }
  }
});
