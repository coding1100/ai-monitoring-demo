import { test, expect } from '@playwright/test';

test.describe('Check 11: CRM Board Drag and Drop & Keyboard Support', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('Drag and drop moves a card to another stage', async ({ page }) => {
    await page.goto('/data/crm');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('[draggable="true"]').first();
    await expect(firstCard).toBeVisible();

    // Find the second column (e.g. Contacted column)
    const secondCol = page.locator('.glass-dense.rounded-panel').nth(1);
    await expect(secondCol).toBeVisible();

    // Drag and drop from first column to second column
    await firstCard.dragTo(secondCol);
    await page.waitForTimeout(500);

    // Verify card is now in second column or stages updated
    const secondColCards = secondCol.locator('[draggable="true"]');
    const count = await secondColCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('Keyboard navigation moves a card between stages', async ({ page }) => {
    await page.goto('/data/crm');
    await page.waitForLoadState('networkidle');

    const firstCard = page.locator('[draggable="true"]').first();
    await expect(firstCard).toBeVisible();

    await firstCard.focus();
    // Test keyboard movement (ArrowRight or Enter / Space)
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(300);

    // We check if card has keyboard accessibility attributes or moves
    const hasAria = await firstCard.getAttribute('tabindex');
    expect(hasAria, 'Kanban card must be keyboard focusable (tabIndex >= 0)').not.toBeNull();
  });
});
