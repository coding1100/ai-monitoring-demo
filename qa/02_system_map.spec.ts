import { test, expect } from '@playwright/test';

test.describe('Check 2: System Map Interactive Nodes', () => {
  const activeNodes = [
    { title: 'Operator', expectedRoute: '/control/operator' },
    { title: 'AI Command Center', expectedRoute: '/control/command-center' },
    { title: 'Approval Gate', expectedRoute: '/control/approval-gate' },
    { title: 'n8n Orchestrator', expectedRoute: '/orchestration/runs' },
    { title: 'LLM Router', expectedRoute: '/orchestration/llm-router' },
    { title: 'OpenAI API', expectedRoute: '/orchestration/openai' },
    { title: 'Rules in Code', expectedRoute: '/orchestration/rules' },
    { title: 'B2B Leads', expectedRoute: '/workflows/b2b-leads' },
    { title: 'B2C Capture', expectedRoute: '/workflows/b2c-capture' },
    { title: 'Email Sequences', expectedRoute: '/workflows/email-sequences' },
    { title: 'SMS Outreach', expectedRoute: '/workflows/sms' },
    { title: 'Social Hub', expectedRoute: '/workflows/social' },
    { title: 'Follow-up Engine', expectedRoute: '/workflows/follow-up' },
    { title: 'Supabase (PostgreSQL)', expectedRoute: '/data/leads' },
    { title: 'CRM (HubSpot / GoHighLevel)', expectedRoute: '/data/crm' },
    { title: 'Suppression List', expectedRoute: '/data/suppression' },
    { title: 'Logs & Audit', expectedRoute: '/data/logs' },
    { title: 'Dashboard', expectedRoute: '/output/dashboard' },
    { title: 'Costs & Unit Economics', expectedRoute: '/output/costs' },
  ];

  for (const node of activeNodes) {
    test(`Clicking "${node.title}" box opens ${node.expectedRoute}`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Click the box containing the title
      const card = page.locator(`.glass-card:has-text("${node.title}")`).first();
      await expect(card).toBeVisible();
      await card.click();

      await page.waitForURL(`**${node.expectedRoute}`);
      expect(page.url()).toContain(node.expectedRoute);
    });
  }

  const phase2Items = ['Admin App', 'Tenant App', 'Custom CRM'];

  for (const item of phase2Items) {
    test(`Clicking Phase 2 locked item "${item}" opens "Not in phase 1" panel`, async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const lockedButton = page.locator(`button:has-text("${item}")`).first();
      await expect(lockedButton).toBeVisible();
      await lockedButton.click();

      // Check modal opens with "Not in phase 1"
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      await expect(modal).toContainText('Not in phase 1');

      // Close modal
      const closeBtn = modal.locator('button:has-text("Understood"), button[aria-label="Close dialog"]').first();
      await closeBtn.click();
      await expect(modal).not.toBeVisible();
    });
  }
});
