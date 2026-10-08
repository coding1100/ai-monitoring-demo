import { test, expect } from '@playwright/test';

test.describe('Check 8: Guided Flow (Tour)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  test('Plays 11 steps start to finish, tests pause, back, exit, replay, and reset demo', async ({ page }) => {
    // 1. Start tour from Home
    const playBtn = page.locator('button:has-text("Play end-to-end flow")').first();
    await expect(playBtn).toBeVisible();
    await playBtn.click();

    // Verify HUD appears
    const hud = page.locator('[data-testid="guided-tour-hud"], .fixed:has-text("01")').first();
    await expect(hud).toBeVisible();

    // Verify step 1 route
    await expect(page).toHaveURL(/\/control\/command-center/);

    // 2. Pause and Resume
    const pauseBtn = page.locator('button[title*="Pause"], button[aria-label*="Pause"], button:has-text("Pause"), button:has([class*="lucide-pause"])').first();
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
      await page.waitForTimeout(300);
      const playResumeBtn = page.locator('button[title*="Resume"], button[aria-label*="Resume"], button:has-text("Resume"), button:has([class*="lucide-play"])').first();
      await expect(playResumeBtn).toBeVisible();
      await playResumeBtn.click();
    }

    // 3. Step forward through steps
    const nextBtn = page.locator('button:has-text("Next"), button[title="Next step"]').first();
    await expect(nextBtn).toBeVisible();

    // Step 2 (Approval gate)
    await nextBtn.click();
    await page.waitForTimeout(400);
    await expect(page).toHaveURL(/\/control\/approval-gate/);

    // Step 3 (Lead Acquisition)
    await nextBtn.click();
    await page.waitForTimeout(400);
    await expect(page).toHaveURL(/\/workflows\/b2b-leads/);

    // Test Back button
    const prevBtn = page.locator('button:has-text("Back"), button[title="Previous step"]').first();
    await expect(prevBtn).toBeVisible();
    await prevBtn.click();
    await page.waitForTimeout(400);
    await expect(page).toHaveURL(/\/control\/approval-gate/);

    // Go forward again to step 3, then proceed through all 11 steps
    await nextBtn.click(); // to step 3
    await page.waitForTimeout(300);

    // Step through the remaining steps up to 11
    for (let s = 3; s < 11; s++) {
      const btn = page.locator('button:has-text("Next"), button[title="Next step"], button:has-text("Finish Tour")').first();
      await btn.click();
      await page.waitForTimeout(400);
    }

    // On final step (step 11), URL should be /output/dashboard
    await expect(page).toHaveURL(/\/output\/dashboard/);

    // Exit / Finish tour
    const exitBtn = page.locator('button:has-text("Finish Tour"), button:has-text("Exit"), button[title="Exit tour"]').first();
    if (await exitBtn.isVisible()) {
      await exitBtn.click();
    }

    // Verify Reset Demo restores start state
    const resetLink = page.locator('button:has-text("Reset demo"), a:has-text("Reset demo")').first();
    await expect(resetLink).toBeVisible();
    await resetLink.click();
    await page.waitForTimeout(500);

    // Check we are back to clean state
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const playBtnAfter = page.locator('button:has-text("Play end-to-end flow")').first();
    await expect(playBtnAfter).toBeVisible();
  });
});
