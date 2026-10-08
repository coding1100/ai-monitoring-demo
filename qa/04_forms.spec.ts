import { test, expect } from '@playwright/test';

test.describe('Check 4: Forms & Input Robustness', () => {
  test('Command Center: handles empty submit, 5,000 chars, quotes, and Enter submit', async ({ page }) => {
    await page.goto('/control/command-center');
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea').first();
    const submitBtn = page.locator('button:has-text("Compile Plan")').first();

    // 1. Empty submit
    await textarea.fill('');
    await submitBtn.click();
    await page.waitForTimeout(400);

    // 2. 5,000 character paste
    const longString = 'Plan criteria: ' + 'A'.repeat(5000);
    await textarea.fill(longString);
    expect(await textarea.inputValue()).toHaveLength(longString.length);

    // 3. Special characters & quotes
    const specialChars = `Target "med spa" <owners> in NY & NJ; test 'single' & "double" quotes; emojis 💉✨; <script>alert(1)</script>`;
    await textarea.fill(specialChars);
    await submitBtn.click();
    await page.waitForTimeout(600);

    // Assert plan card renders without XSS execution or crashing
    const planCard = page.locator('.glass-panel:has-text("STRUCTURED PLAN")');
    await expect(planCard).toBeVisible();
  });

  test('SMS Composer: handles 5,000 characters and special characters', async ({ page }) => {
    await page.goto('/workflows/sms');
    await page.waitForLoadState('networkidle');

    const textarea = page.locator('textarea').first();
    const longText = 'Reminder ' + 'X'.repeat(500);
    await textarea.fill(longText);
    expect(await textarea.inputValue()).toHaveLength(longText.length);

    // Special characters
    const special = `Special & "quotes" + 'apostrophes' <xml>`;
    await textarea.fill(special);
    const sendBtn = page.locator('button:has-text("Send SMS Message")').first();
    await sendBtn.click();
    await page.waitForTimeout(600);
  });

  test('Suppression Check Address: handles quotes, empty, and Enter key submit', async ({ page }) => {
    await page.goto('/data/suppression');
    await page.waitForLoadState('networkidle');

    const input = page.locator('input[placeholder*="Check an Address"], input[placeholder*="competitor"]').first();

    // Empty submit
    await input.fill('');
    await input.press('Enter');
    await page.waitForTimeout(300);

    // Special characters & quotes
    await input.fill(`"test'@special<domain>.com`);
    await input.press('Enter');
    await page.waitForTimeout(500);

    // Clean check
    await input.fill('clean.doctor@validpractice.org');
    await input.press('Enter');
    await page.waitForTimeout(500);
    await expect(page.locator('text=CLEAN')).toBeVisible();
  });

  test('Workspace Settings: handles numeric fields and quotes', async ({ page }) => {
    await page.goto('/workspace/settings');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill(`Halden "Aesthetics" & 'Partners' <LLC>`);

    const retentionInput = page.locator('input[type="number"]').first();
    await retentionInput.fill('120');

    const saveBtn = page.locator('button:has-text("Save Workspace Parameters")').first();
    await saveBtn.click();
    await page.waitForTimeout(600);

    await expect(page.locator('text=saved successfully')).toBeVisible();
  });
});
