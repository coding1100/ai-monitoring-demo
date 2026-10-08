import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import * as fs from 'fs';
import * as path from 'path';

const TARGET_PAGES = [
  { name: 'home', url: 'http://localhost:4173/' },
  { name: 'dashboard', url: 'http://localhost:4173/output/dashboard' },
  { name: 'leads', url: 'http://localhost:4173/data/leads' },
  { name: 'runs', url: 'http://localhost:4173/orchestration/runs' },
];

const LIGHTHOUSE_DIR = path.resolve(process.cwd(), 'qa', 'lighthouse');
if (!fs.existsSync(LIGHTHOUSE_DIR)) {
  fs.mkdirSync(LIGHTHOUSE_DIR, { recursive: true });
}

async function runAudit() {
  console.log('Launching Chrome for Lighthouse audits...');
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const options = {
    logLevel: 'error',
    output: ['json', 'html'],
    onlyCategories: ['performance', 'accessibility'],
    port: chrome.port,
  };

  const resultsSummary = [];
  let allPassed = true;

  try {
    for (const target of TARGET_PAGES) {
      console.log(`Auditing ${target.name} (${target.url})...`);
      const runnerResult = await lighthouse(target.url, options);

      const reportJson = runnerResult.report[0];
      const reportHtml = runnerResult.report[1];

      fs.writeFileSync(path.join(LIGHTHOUSE_DIR, `${target.name}.report.json`), reportJson);
      fs.writeFileSync(path.join(LIGHTHOUSE_DIR, `${target.name}.report.html`), reportHtml);

      const perfScore = Math.round((runnerResult.lhr.categories.performance?.score || 0) * 100);
      const a11yScore = Math.round((runnerResult.lhr.categories.accessibility?.score || 0) * 100);

      const pagePassed = perfScore >= 80 && a11yScore >= 90;
      if (!pagePassed) {
        allPassed = false;
      }

      resultsSummary.push({
        page: target.name,
        url: target.url,
        performance: perfScore,
        accessibility: a11yScore,
        passed: pagePassed,
      });

      console.log(`-> ${target.name}: Performance = ${perfScore} (req >= 80), Accessibility = ${a11yScore} (req >= 90)`);
    }
  } finally {
    await chrome.kill();
  }

  console.table(resultsSummary);

  const summaryFile = path.join(LIGHTHOUSE_DIR, 'summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(resultsSummary, null, 2));

  if (!allPassed) {
    console.error('Lighthouse thresholds not met on some pages.');
    // In Phase A, log but don't crash full test suite runner prematurely if run as part of qa
  } else {
    console.log('All Lighthouse audits passed successfully!');
  }
}

runAudit().catch((err) => {
  console.error('Lighthouse audit failed:', err);
  process.exit(1);
});
