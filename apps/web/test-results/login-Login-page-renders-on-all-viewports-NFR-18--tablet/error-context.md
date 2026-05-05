# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.ts >> Login page >> renders on all viewports (NFR-18)
- Location: e2e\login.spec.ts:4:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('WETLABS')
Expected: visible
Error: strict mode violation: getByText('WETLABS') resolved to 2 elements:
    1) <h1 class="font-mono text-2xl font-medium text-teal-400 tracking-widest">WETLABS</h1> aka getByRole('heading', { name: 'WETLABS' })
    2) <p class="text-center text-[10px] text-slate-600 font-mono tracking-widest">WETLABS v1.0 · MIIC GIP 2025</p> aka getByText('WETLABS v1.0 · MIIC GIP')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('WETLABS')

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
  3  | test.describe('Login page', () => {
  4  |   test('renders on all viewports (NFR-18)', async ({ page }) => {
  5  |     await page.goto('/login');
> 6  |     await expect(page.getByText('WETLABS')).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  7  |     await expect(page.getByRole('button', { name: /access dashboard/i })).toBeVisible();
  8  |   });
  9  | 
  10 |   test('shows validation error for empty submit', async ({ page }) => {
  11 |     await page.goto('/login');
  12 |     await page.getByRole('button', { name: /access dashboard/i }).click();
  13 |     await expect(page.getByRole('alert').first()).toBeVisible();
  14 |   });
  15 | 
  16 |   test('toggles password visibility', async ({ page }) => {
  17 |     await page.goto('/login');
  18 |     const pw = page.getByPlaceholder('••••••••••');
  19 |     await expect(pw).toHaveAttribute('type', 'password');
  20 |     await page.getByRole('button', { name: /show password/i }).click();
  21 |     await expect(pw).toHaveAttribute('type', 'text');
  22 |   });
  23 | });
  24 | 
```