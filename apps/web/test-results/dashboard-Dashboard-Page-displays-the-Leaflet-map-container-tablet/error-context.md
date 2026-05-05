# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard Page >> displays the Leaflet map container
- Location: e2e\dashboard.spec.ts:25:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.leaflet-container')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.leaflet-container')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list "Notifications"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Dashboard Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Inject mock auth state into Zustand's localStorage persister to bypass login
  6  |     await page.addInitScript(() => {
  7  |       window.localStorage.setItem('wetlabs-auth', JSON.stringify({
  8  |         state: { token: 'mock-jwt-token', role: 'SYSTEM_ADMIN', email: 'admin@nema.go.ug' },
  9  |         version: 0
  10 |       }));
  11 |     });
  12 |     await page.goto('/dashboard');
  13 |   });
  14 | 
  15 |   test('renders the main layout and topbar', async ({ page }) => {
  16 |     await expect(page.getByText('WETLABS')).toBeVisible();
  17 |     await expect(page.getByText('admin@nema.go.ug')).toBeVisible();
  18 |     
  19 |     // Check TopBar Tabs (admin role sees all three)
  20 |     await expect(page.getByRole('button', { name: /^REPORTS$/ })).toBeVisible();
  21 |     await expect(page.getByRole('button', { name: /^ANALYTICS$/ })).toBeVisible();
  22 |     await expect(page.getByRole('button', { name: /^ADMIN$/ })).toBeVisible();
  23 |   });
  24 | 
  25 |   test('displays the Leaflet map container', async ({ page }) => {
  26 |     const map = page.locator('.leaflet-container');
> 27 |     await expect(map).toBeVisible();
     |                       ^ Error: expect(locator).toBeVisible() failed
  28 |   });
  29 | 
  30 |   test('opens filter dropdown (US-07)', async ({ page }) => {
  31 |     await page.getByRole('button', { name: /open filters/i }).click();
  32 |     await expect(page.getByText('DATE RANGE')).toBeVisible();
  33 |     await expect(page.getByText('SEVERITY')).toBeVisible();
  34 |   });
  35 | });
  36 | 
```