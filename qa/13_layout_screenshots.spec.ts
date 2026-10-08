import { test, expect } from '@playwright/test';
import * as path from 'path';

test.describe('Check 13: Layout, Viewports & Screenshots', () => {
  const viewports = [
    { width: 1440, height: 900, name: '1440' },
    { width: 1280, height: 800, name: '1280' },
    { width: 1024, height: 768, name: '1024' },
    { width: 768, height: 1024, name: '768' },
    { width: 390, height: 844, name: '390' },
  ];

  const testRoutes = [
    { path: '/', name: 'home-map' },
    { path: '/output/dashboard', name: 'dashboard' },
    { path: '/control/command-center', name: 'command-center' },
    { path: '/orchestration/runs', name: 'runs' },
    { path: '/workflows/b2b-leads', name: 'b2b-leads' },
    { path: '/data/leads', name: 'data-leads' },
    { path: '/data/crm', name: 'data-crm' },
  ];

  for (const vp of viewports) {
    for (const theme of ['light', 'dark']) {
      test(`Viewport ${vp.name}px in ${theme} mode captures screenshot and checks overflow`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        for (const r of testRoutes) {
          await page.goto(r.path);
          await page.waitForLoadState('networkidle');

          if (theme === 'dark') {
            await page.evaluate(() => document.documentElement.classList.add('dark'));
          } else {
            await page.evaluate(() => document.documentElement.classList.remove('dark'));
          }

          // Check horizontal overflow (except for 390 or pages with internal tables like kanban which have horizontal scroll containers)
          if (vp.width >= 1024 && r.name !== 'data-crm') {
            const hasHorizontalScroll = await page.evaluate(() => {
              return document.documentElement.scrollWidth > window.innerWidth;
            });
            expect(hasHorizontalScroll, `Route ${r.path} has horizontal scrollbar at ${vp.width}px`).toBeFalsy();
          }

          // Save screenshot
          const screenshotPath = path.join(
            process.cwd(),
            'qa',
            'screenshots',
            `${r.name}-${vp.name}-${theme}.png`
          );
          await page.screenshot({ path: screenshotPath, fullPage: false });
        }
      });
    }
  }
});
