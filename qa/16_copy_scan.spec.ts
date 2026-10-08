import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { ALL_ROUTES } from './routes';

const FORBIDDEN_WORDS = [
  'seamless',
  'unlock',
  'leverage',
  'elevate',
  'supercharge',
  'powerful',
  'revolutionize',
  'lorem ipsum',
  'TODO',
];

const LEAKED_TOKENS = ['undefined', 'NaN', '[object Object]'];

test.describe('Check 16: Copy Audit (Source Code & Rendered Pages)', () => {
  test('Scan all source files in src/ for forbidden words, em-dashes, and placeholders', async () => {
    const issues: { file: string; match: string; line: number }[] = [];

    function scanDir(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          scanDir(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            // Check for em-dash
            if (line.includes('—')) {
              issues.push({ file: fullPath, match: 'em-dash (—)', line: index + 1 });
            }
            // Check for forbidden buzzwords
            for (const word of FORBIDDEN_WORDS) {
              const regex = new RegExp(`\\b${word}\\b`, 'i');
              if (regex.test(line)) {
                issues.push({ file: fullPath, match: word, line: index + 1 });
              }
            }
          });
        }
      }
    }

    scanDir(path.resolve(process.cwd(), 'src'));

    if (issues.length > 0) {
      console.warn(`[Copy violations found in source code (${issues.length})]:`, issues.slice(0, 10));
    }

    expect(
      issues,
      `Found ${issues.length} copy violations in src/: ${issues.map((i) => `${path.basename(i.file)}:${i.line} (${i.match})`).join(', ')}`
    ).toEqual([]);
  });

  for (const route of ALL_ROUTES) {
    test(`Rendered copy check on route ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const bodyText = await page.locator('body').innerText();

      // Check for leaked tokens
      for (const token of LEAKED_TOKENS) {
        if (token === '[object Object]') {
          expect(bodyText.includes('[object Object]'), `Route ${route} renders [object Object]`).toBe(false);
        } else {
          const regex = new RegExp(`\\b${token}\\b`);
          expect(regex.test(bodyText), `Route ${route} renders leaked token '${token}'`).toBe(false);
        }
      }

      // Check for em-dash
      expect(
        bodyText.includes('—'),
        `Route ${route} renders em-dash (—)`
      ).toBeFalsy();

      // Check for forbidden words
      for (const word of FORBIDDEN_WORDS) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        expect(
          regex.test(bodyText),
          `Route ${route} renders forbidden word '${word}'`
        ).toBeFalsy();
      }
    });
  }
});
