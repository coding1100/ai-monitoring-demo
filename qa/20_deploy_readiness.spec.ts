import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Check 20: Deploy Readiness, Static Config & Secret Hygiene', () => {
  test('vercel.json is valid JSON with SPA rewrite and noindex headers', async () => {
    const vercelPath = path.resolve(process.cwd(), 'vercel.json');
    expect(fs.existsSync(vercelPath), 'vercel.json must exist').toBe(true);

    const content = fs.readFileSync(vercelPath, 'utf-8');
    const parsed = JSON.parse(content);

    // Verify SPA rewrite
    expect(parsed.rewrites).toBeDefined();
    expect(
      parsed.rewrites.some((r: any) => r.destination === '/index.html')
    ).toBe(true);

    // Verify noindex header
    expect(parsed.headers).toBeDefined();
    const hasNoIndexHeader = parsed.headers.some((h: any) =>
      h.headers?.some(
        (sub: any) =>
          sub.key.toLowerCase() === 'x-robots-tag' &&
          sub.value.includes('noindex')
      )
    );
    expect(hasNoIndexHeader).toBe(true);
  });

  test('robots.txt and meta noindex tag exist', async () => {
    const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt');
    expect(fs.existsSync(robotsPath), 'public/robots.txt must exist').toBe(true);
    const robotsText = fs.readFileSync(robotsPath, 'utf-8');
    expect(robotsText).toContain('Disallow: /');

    const indexPath = path.resolve(process.cwd(), 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    expect(indexHtml).toMatch(/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex[^"']*["']/i);
  });

  test('.gitignore covers node_modules, dist, and .env files', async () => {
    const gitignorePath = path.resolve(process.cwd(), '.gitignore');
    expect(fs.existsSync(gitignorePath)).toBe(true);
    const content = fs.readFileSync(gitignorePath, 'utf-8');
    expect(content).toContain('node_modules');
    expect(content).toContain('dist');
    expect(content).toContain('.env');
  });

  test('Repository contains no raw live secret keys', async () => {
    // Regex for actual unmasked live keys (e.g. sk-live, sk-proj with >20 hex chars, etc)
    const rawSecretRegex = /sk-(?:live|proj|ant)-[a-zA-Z0-9]{30,}/;
    
    function checkDir(dir: string) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        if (file === 'node_modules' || file === '.git' || file === 'dist') continue;
        const full = path.join(dir, file);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          checkDir(full);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.env')) {
          const text = fs.readFileSync(full, 'utf-8');
          expect(
            rawSecretRegex.test(text),
            `Unmasked secret key detected in ${file}`
          ).toBe(false);
        }
      }
    }

    checkDir(path.resolve(process.cwd(), 'src'));
  });
});
