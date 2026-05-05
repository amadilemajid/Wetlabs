# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard Page >> renders the main layout and topbar
- Location: e2e\dashboard.spec.ts:15:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('admin@nema.go.ug')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('admin@nema.go.ug')
    - waiting for navigation to finish...
    - navigated to "http://localhost:5173/login"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - heading "WETLABS" [level=1] [ref=e11]
      - paragraph [ref=e12]: WETLAND MONITORING SYSTEM
    - generic [ref=e13]:
      - heading "OFFICER LOGIN" [level=2] [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]:
          - text: EMAIL
          - textbox "EMAIL" [ref=e17]:
            - /placeholder: officer@nema.go.ug
        - generic [ref=e18]:
          - text: PASSWORD
          - generic [ref=e19]:
            - textbox "PASSWORD" [ref=e20]:
              - /placeholder: ••••••••••
            - button "Show password" [ref=e21]:
              - img [ref=e22]
        - button "Access Dashboard" [ref=e25]
    - paragraph [ref=e26]: WETLABS v1.0 · MIIC GIP 2025
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
> 17 |     await expect(page.getByText('admin@nema.go.ug')).toBeVisible();
     |                                                      ^ Error: expect(locator).toBeVisible() failed
  18 |     
  19 |     // Check TopBar Tabs (admin role sees all three)
  20 |     await expect(page.getByRole('button', { name: /^REPORTS$/ })).toBeVisible();
  21 |     await expect(page.getByRole('button', { name: /^ANALYTICS$/ })).toBeVisible();
  22 |     await expect(page.getByRole('button', { name: /^ADMIN$/ })).toBeVisible();
  23 |   });
  24 | 
  25 |   test('displays the Leaflet map container', async ({ page }) => {
  26 |     const map = page.locator('.leaflet-container');
  27 |     await expect(map).toBeVisible();
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