/**
 * Accessibility audit — runs @axe-core/playwright on key routes
 * Usage: npx ts-node scripts/a11y-audit.ts
 * All violations at WCAG 2.1 AA level are printed and exit code 1 is set if any found.
 */
import { chromium } from 'playwright';
import AxeBuilder   from '@axe-core/playwright';

const ROUTES = [
  { path: '/login',     name: 'Login Page'     },
  { path: '/report',    name: 'Field Form Page' },
];

async function audit() {
  const browser = await chromium.launch();
  let   totalViolations = 0;

  for (const route of ROUTES) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:5173${route.path}`);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length === 0) {
      console.log(`✓ ${route.name} — no violations`);
    } else {
      console.error(`✗ ${route.name} — ${results.violations.length} violation(s):`);
      results.violations.forEach((v) => {
        console.error(`  [${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        v.nodes.slice(0, 2).forEach((n) => console.error(`    → ${n.html}`));
      });
      totalViolations += results.violations.length;
    }

    await page.close();
  }

  await browser.close();

  if (totalViolations > 0) {
    console.error(`\nTotal WCAG violations: ${totalViolations}`);
    process.exit(1);
  } else {
    console.log('\nAll routes pass WCAG 2.1 AA audit');
  }
}

void audit();
