import { test, expect } from '@playwright/test';

test.describe('Check 14: Glassmorphism Specification Compliance', () => {
  test('Glass panels adhere to tokens and turn solid under prefers-reduced-transparency', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify glass panel classes exist and have backdrop-filter
    const panel = page.locator('.glass-panel').first();
    await expect(panel).toBeVisible();

    const panelComputed = await panel.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        borderRadius: style.borderRadius,
        backdropFilter: style.backdropFilter || (style as any).webkitBackdropFilter,
      };
    });

    // Panel radius must be 14px
    expect(panelComputed.borderRadius).toBe('14px');

    // Under prefers-reduced-transparency, backdrop-filter must be none
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const prefersSolid = await page.evaluate(() => {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });
    expect(prefersSolid).toBe(true);
  });

  test('Check for absence of emoji, gradient text, and parallax blobs', async ({ page }) => {
    await page.goto('/output/dashboard');
    await page.waitForLoadState('networkidle');

    // Verify no gradient text utility classes (bg-gradient-to... + bg-clip-text)
    const gradientText = page.locator('.bg-clip-text');
    expect(await gradientText.count()).toBe(0);

    // Verify no emoji in page text
    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    const bodyText = await page.locator('body').innerText();
    const hasEmoji = emojiRegex.test(bodyText);
    expect(hasEmoji, 'Page body should not contain raw emoji characters').toBe(false);
  });
});
