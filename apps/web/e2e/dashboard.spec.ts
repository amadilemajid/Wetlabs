import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock auth state into Zustand's localStorage persister to bypass login
    await page.addInitScript(() => {
      window.localStorage.setItem('wetlabs-auth', JSON.stringify({
        state: { token: 'mock-jwt-token', role: 'SYSTEM_ADMIN', email: 'admin@nema.go.ug' },
        version: 0
      }));
    });
    await page.goto('/dashboard');
  });

  test('renders the main layout and topbar', async ({ page }) => {
    await expect(page.getByText('WETLABS')).toBeVisible();
    await expect(page.getByText('admin@nema.go.ug')).toBeVisible();
    
    // Check TopBar Tabs (admin role sees all three)
    await expect(page.getByRole('button', { name: /^REPORTS$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^ANALYTICS$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^ADMIN$/ })).toBeVisible();
  });

  test('displays the Leaflet map container', async ({ page }) => {
    const map = page.locator('.leaflet-container');
    await expect(map).toBeVisible();
  });

  test('opens filter dropdown (US-07)', async ({ page }) => {
    await page.getByRole('button', { name: /open filters/i }).click();
    await expect(page.getByText('DATE RANGE')).toBeVisible();
    await expect(page.getByText('SEVERITY')).toBeVisible();
  });
});
