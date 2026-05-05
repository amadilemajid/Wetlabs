import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('renders on all viewports (NFR-18)', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByText('WETLABS')).toBeVisible();
    await expect(page.getByRole('button', { name: /access dashboard/i })).toBeVisible();
  });

  test('shows validation error for empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /access dashboard/i }).click();
    await expect(page.getByRole('alert').first()).toBeVisible();
  });

  test('toggles password visibility', async ({ page }) => {
    await page.goto('/login');
    const pw = page.getByPlaceholder('••••••••••');
    await expect(pw).toHaveAttribute('type', 'password');
    await page.getByRole('button', { name: /show password/i }).click();
    await expect(pw).toHaveAttribute('type', 'text');
  });
});
