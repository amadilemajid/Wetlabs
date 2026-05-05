import { test, expect } from '@playwright/test';

test.describe('Analytics Panel', () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock auth state to bypass login
    await page.addInitScript(() => {
      window.localStorage.setItem('wetlabs-auth', JSON.stringify({
        state: { token: 'mock-jwt-token', role: 'SYSTEM_ADMIN', email: 'admin@nema.go.ug' },
        version: 0
      }));
    });
    await page.goto('/dashboard');
  });

  test('switches to analytics tab and shows empty state (US-11)', async ({ page }) => {
    // Select Analytics tab
    await page.getByRole('button', { name: /^ANALYTICS$/ }).click();
    
    // Assert the default UI Empty State is visible since no wetland is selected on load
    await expect(page.getByText('Select a wetland')).toBeVisible();
    await expect(page.getByText('Click any wetland boundary on the map to view analytics')).toBeVisible();
  });
});
