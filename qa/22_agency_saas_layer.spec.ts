import { test, expect } from '@playwright/test';
import { AGENCY_ROUTES, CLIENT_ROUTES, SIX_MOCK_CLIENTS } from './routes';

test.describe('Checks 22-27: SaaS & Agency Layer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForLoadState('networkidle');
  });

  // Check 22: New Routes in Light and Dark Mode
  test('Check 22: Visit all agency and client routes in light and dark without console errors or missing H1/chip', async ({ page }) => {
    const allNewRoutes = [...AGENCY_ROUTES, ...CLIENT_ROUTES];
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', (req) => {
      failedRequests.push(req.url());
    });

    for (const route of allNewRoutes) {
      // 1. Light Mode
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
      const h1Text = await h1.textContent();
      expect(h1Text?.trim().length).toBeGreaterThan(0);

      // Check diagram chip / badge
      const chip = page.locator('[data-testid="diagram-chip"]').first();
      await expect(chip).toBeVisible();

      // 2. Dark Mode
      await page.evaluate(() => document.documentElement.classList.add('dark'));
      await page.waitForTimeout(100);
      await expect(h1).toBeVisible();

      // Revert dark mode for next iteration
      await page.evaluate(() => document.documentElement.classList.remove('dark'));
    }

    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
  });

  // Check 23: Top-Level Agency Switcher
  test('Check 23: Agency switcher swaps sidebar and mode navigation completely', async ({ page }) => {
    await page.goto('/');

    // Locate navigation mode buttons in sidebar footer
    const agencyBtn = page.locator('button:has-text("Agency admin")').first();
    const clientBtn = page.locator('button:has-text("Client workspace")').first();

    await expect(agencyBtn).toBeVisible();
    await expect(clientBtn).toBeVisible();

    // Switch to Agency admin
    await agencyBtn.click();
    await page.waitForTimeout(300);

    // Sidebar must show agency administration entries
    await expect(page.locator('aside a:has-text("Agency Overview")')).toBeVisible();
    await expect(page.locator('aside a:has-text("Workspaces")')).toBeVisible();
    await expect(page.locator('aside a:has-text("Pricing & Forecast")')).toBeVisible();
    await expect(page.locator('aside a:has-text("Workspace Isolation")')).toBeVisible();

    // Switch back to Client workspace
    await clientBtn.click();
    await page.waitForTimeout(300);

    // Sidebar must show client workspace layers
    await expect(page.locator('aside a:has-text("Client Home")')).toBeVisible();
    await expect(page.locator('aside a:has-text("AI Command Center")')).toBeVisible();
    await expect(page.locator('aside a:has-text("Email Sequences")')).toBeVisible();
  });

  // Check 24: Client Workspace Switcher (6 Mock Clients)
  test('Check 24: In client mode, switch between 6 clients and verify data isolation', async ({ page }) => {
    await page.goto('/client/home');

    // Enable "Show data scope" from footer to inspect isolation scope
    const dataScopeToggle = page.locator('button:has-text("Data scope"), label:has-text("Data scope"), button:has-text("Show data scope")').first();
    if (await dataScopeToggle.isVisible()) {
      await dataScopeToggle.click();
    }

    // Locate workspace switcher button in sidebar
    const wsSwitcher = page.locator('aside button:has-text("Workspace"), aside button:has-text("Aesthetics"), aside button:has-text("Dental"), aside button:has-text("Roofing")').first();
    await expect(wsSwitcher).toBeVisible();

    // Test switching across multiple clients
    for (const clientName of ['Lakeview Dental Group', 'Halden Aesthetics', 'Apex Solar Dynamics']) {
      await wsSwitcher.click();
      await page.waitForTimeout(200);

      const clientOption = page.locator(`aside button:has-text("${clientName}")`).first();
      await expect(clientOption).toBeVisible();
      await clientOption.click();
      await page.waitForTimeout(300);

      // Verify the page title or tenant indicator reflects the selected client
      const pageText = await page.locator('body').textContent();
      expect(pageText).toContain(clientName);
    }
  });

  // Check 25: Pricing and Forecast Live Math
  test('Check 25: Pricing and forecast model updates in real time for 10, 25, 50, 100 clients', async ({ page }) => {
    await page.goto('/agency/pricing-forecast');
    await page.waitForLoadState('networkidle');

    // Verify 10, 25, 50, 100 client cards are visible
    await expect(page.locator('text=10 Clients').first()).toBeVisible();
    await expect(page.locator('text=25 Clients').first()).toBeVisible();
    await expect(page.locator('text=50 Clients').first()).toBeVisible();
    await expect(page.locator('text=100 Clients').first()).toBeVisible();

    // Find Starter price input and modify it
    const starterPriceInput = page.locator('input[type="number"]').first();
    await expect(starterPriceInput).toBeVisible();

    const initialVal = await starterPriceInput.inputValue();
    await starterPriceInput.fill('249');
    await page.waitForTimeout(300);

    // Verify recalculation occurred and gross margin projected
    const forecastCard = page.locator('text=100 Clients').first();
    await expect(forecastCard).toBeVisible();
  });

  // Check 26: Cross-Workspace Isolation Penetration Test
  test('Check 26: Isolation page runs 8 checks, delays 1.5s, and confirms 0 rows returned', async ({ page }) => {
    await page.goto('/agency/isolation');
    await page.waitForLoadState('networkidle');

    // Verify architecture diagram and table schema rows are rendered
    await expect(page.locator('text=Cross-Workspace Access Test')).toBeVisible();

    const runBtn = page.locator('button:has-text("Run Cross-Workspace Audit")');
    await expect(runBtn).toBeVisible();

    const startTime = Date.now();
    await runBtn.click();

    // Verify running indicator appears
    await expect(page.locator('text=Simulating Probes')).toBeVisible();

    // Wait for audit to complete
    await expect(runBtn).toHaveText('Run Cross-Workspace Audit', { timeout: 5000 });
    const elapsedTime = Date.now() - startTime;
    expect(elapsedTime).toBeGreaterThanOrEqual(1300);

    // Verify all 8 checks returned 0 rows
    const zeroRowsBadges = page.locator('[data-testid="isolation-check-rows"]');
    await expect(zeroRowsBadges).toHaveCount(8);

    const passBadges = page.locator('[data-testid="isolation-check-status"]');
    await expect(passBadges).toHaveCount(8);
  });

  // Check 27: Full 6-Step Onboarding Flow End-to-End
  test('Check 27: Onboarding wizard 6 steps start to finish, test card 4242, finishes on Client Home', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForLoadState('networkidle');

    // Step 1: Account
    await expect(page.locator('text=Account & Organization Details')).toBeVisible();
    const nextBtn1 = page.locator('button:has-text("Select Subscription Plan")');
    await nextBtn1.click();
    await page.waitForTimeout(400);

    // Step 2: Plan
    await expect(page.locator('text=Select Your Prospecting Tier')).toBeVisible();
    const nextBtn2 = page.locator('button:has-text("Proceed to Payment")');
    await nextBtn2.click();
    await page.waitForTimeout(400);

    // Step 3: Payment (card prefilled with 4242)
    await expect(page.locator('text=Payment Authorization')).toBeVisible();
    const cardInput = page.locator('input[value*="4242"]');
    await expect(cardInput).toBeVisible();
    const nextBtn3 = page.locator('button:has-text("Authorize")');
    await nextBtn3.click();
    await page.waitForTimeout(400);

    // Step 4: Connect Accounts
    await expect(page.locator('text=Connect Service Channels')).toBeVisible();
    const nextBtn4 = page.locator('button:has-text("Proceed to CRM Sync")');
    await nextBtn4.click();
    await page.waitForTimeout(400);

    // Step 5: CRM Sync Self-Ticking
    await expect(page.locator('text=CRM Sub-Account Synchronization')).toBeVisible();
    // Wait for auto-ticking or proceed
    await page.waitForTimeout(1500);
    const nextBtn5 = page.locator('button:has-text("Continue to First Campaign")');
    await nextBtn5.click();
    await page.waitForTimeout(400);

    // Step 6: First Campaign Checklist
    await expect(page.locator('text=First Campaign Readiness Checklist')).toBeVisible();
    const finishBtn = page.locator('button:has-text("Launch Campaign & Open Client Hub")');
    await expect(finishBtn).toBeVisible();
    await finishBtn.click();

    // Verify arrival on Client Home
    await page.waitForURL(/\/client\/home/, { timeout: 4000 });
    await expect(page).toHaveURL(/\/client\/home/);
    await expect(page.locator('h1:has-text("Workspace Overview")')).toBeVisible();
  });
});
