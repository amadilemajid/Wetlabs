# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics.spec.ts >> Analytics Panel >> switches to analytics tab and shows empty state (US-11)
- Location: e2e\analytics.spec.ts:15:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /^ANALYTICS$/ })
    - waiting for" http://localhost:5173/login" navigation to finish...
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
  3  | test.describe('Analytics Panel', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Inject mock auth state to bypass login
  6  |     await page.addInitScript(() => {
  7  |       window.localStorage.setItem('wetlabs-auth', JSON.stringify({
  8  |         state: { token: 'mock-jwt-token', role: 'SYSTEM_ADMIN', email: 'admin@nema.go.ug' },
  9  |         version: 0
  10 |       }));
  11 |     });
  12 |     await page.goto('/dashboard');
  13 |   });
  14 | 
  15 |   test('switches to analytics tab and shows empty state (US-11)', async ({ page }) => {
  16 |     // Select Analytics tab
> 17 |     await page.getByRole('button', { name: /^ANALYTICS$/ }).click();
     |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  18 |     
  19 |     // Assert the default UI Empty State is visible since no wetland is selected on load
  20 |     await expect(page.getByText('Select a wetland')).toBeVisible();
  21 |     await expect(page.getByText('Click any wetland boundary on the map to view analytics')).toBeVisible();
  22 |   });
  23 | });
  24 | 
```