import { render, screen, waitFor } from '@testing-library/react';
import userEvent                    from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@features/auth/LoginPage';

// Mock the api module
vi.mock('@api/auth.api', () => ({
  login: vi.fn(),
}));

import { login } from '@api/auth.api';
const mockLogin = vi.mocked(login);

function renderLogin() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => { mockLogin.mockReset(); });

  it('renders email, password fields and submit button', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /access dashboard/i })).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: /access dashboard/i }));
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    });
  });

  it('shows API error on bad credentials', async () => {
    mockLogin.mockRejectedValue(new Error('401'));
    renderLogin();
    await userEvent.type(screen.getByPlaceholderText(/email/i),    'bad@email.com');
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'wrongpassword');
    await userEvent.click(screen.getByRole('button', { name: /access dashboard/i }));
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/invalid email or password/i);
    });
  });

  it('toggles password visibility (US-04 accessibility)', async () => {
    renderLogin();
    const pw = screen.getByPlaceholderText(/password/i);
    expect(pw).toHaveAttribute('type', 'password');
    await userEvent.click(screen.getByRole('button', { name: /show password/i }));
    expect(pw).toHaveAttribute('type', 'text');
    await userEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(pw).toHaveAttribute('type', 'password');
  });
});
