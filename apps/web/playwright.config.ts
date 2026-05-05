import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries:    process.env['CI'] ? 2 : 0,
  reporter:   'html',
  use: {
    baseURL:     'http://localhost:5173',
    trace:       'on-first-retry',
    screenshot:  'only-on-failure',
  },
  projects: [
    // NFR-18: must work at 768px (tablet) and 1440px (desktop)
    { name: 'tablet',  use: { ...devices['iPad (gen 7)'],       viewport: { width: 768,  height: 1024 } } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'],     viewport: { width: 1440, height: 900  } } },
    { name: 'mobile',  use: { ...devices['Pixel 7'],            viewport: { width: 393,  height: 851  } } },
  ],
  webServer: {
    command: 'npm run dev --workspace=apps/web',
    url:     'http://localhost:5173',
    reuseExistingServer: !process.env['CI'],
  },
});
