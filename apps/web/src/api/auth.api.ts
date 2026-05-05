import { apiClient } from './client';
import type { UserRole } from '@wetlabs/shared-types';

export interface LoginResponse { access_token: string; expires_in: number; role: UserRole; }

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await apiClient.post<{ data: LoginResponse }>('/auth/login', { email, password });
  return res.data.data;
}
