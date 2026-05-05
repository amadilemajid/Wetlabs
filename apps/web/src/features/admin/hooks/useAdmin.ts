import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@api/client';
import { useToast }  from '@hooks/useToast';
import type { User, UserRole } from '@wetlabs/shared-types';
import { saveAs } from 'file-saver';

// ── Users (US-13) ─────────────────────────────────────────────────────────────
export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn:  async () => {
      const res = await apiClient.get<{ data: User[]; meta: { total: number } }>('/admin/users');
      return res.data;
    },
    staleTime: 30_000,
  });
}

export function useCreateUser() {
  const qc    = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (data: {
      email: string; password: string; full_name: string;
      role: UserRole; assigned_wetlands: string[];
    }) => apiClient.post('/admin/users', data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User account created');
    },
    onError: () => toast.error('Failed to create user. Email may already be taken.'),
  });
}

export function useUpdateUser() {
  const qc    = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, data }: {
      id: string;
      data: Partial<{ role: UserRole; is_active: boolean; assigned_wetlands: string[] }>;
    }) => apiClient.patch(`/admin/users/${id}`, data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast.success('User updated');
    },
    onError: () => toast.error('Failed to update user'),
  });
}

// ── DLQ (US-14) ───────────────────────────────────────────────────────────────
export function useDlqDepth() {
  return useQuery({
    queryKey: ['admin', 'dlq'],
    queryFn:  async () => {
      const res = await apiClient.get<{ data: { dlq_depth: number; stats?: any; messages?: any[] } }>('/admin/queue/dlq');
      return res.data.data;
    },
    refetchInterval: 15_000,   // poll every 15 s so admin sees live depth
  });
}

export function useRetryDlq() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (messageId: string) => apiClient.post(`/admin/queue/dlq/${messageId}/retry`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'dlq'] });
      toast.success('Message requeued');
    },
    onError: () => toast.error('Failed to retry message'),
  });
}

export function useDiscardDlq() {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: (messageId: string) => apiClient.delete(`/admin/queue/dlq/${messageId}`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'dlq'] });
      toast.success('Message discarded');
    },
    onError: () => toast.error('Failed to discard message'),
  });
}

// ── Audit log (US-15) ─────────────────────────────────────────────────────────
export function useAuditLog(filters: { action?: string; actor_email?: string; page: number }) {
  return useQuery({
    queryKey: ['admin', 'audit', filters],
    queryFn:  async () => {
      const params = new URLSearchParams({ page: String(filters.page), per_page: '50' });
      if (filters.action)      params.set('action',      filters.action);
      if (filters.actor_email) params.set('actor_email', filters.actor_email);
      const res = await apiClient.get<{
        data: AuditEntry[];
        meta: { page: number; per_page: number; total: number };
      }>(`/admin/audit?${params.toString()}`);
      return res.data;
    },
    staleTime: 10_000,
  });
}

export async function exportAuditLogCsv(filters: { action?: string; actor_email?: string }) {
  const p = new URLSearchParams();
  if (filters.action) p.set('action', filters.action);
  if (filters.actor_email) p.set('actor_email', filters.actor_email);
  const res = await apiClient.get(`/admin/audit.csv?${p.toString()}`, { responseType: 'blob' });
  saveAs(res.data as Blob, `audit_log_${Date.now()}.csv`);
}

export interface AuditEntry {
  log_id:      number;
  action:      string;
  target_type: string | null;
  target_id:   string | null;
  meta:        Record<string, unknown> | null;
  ip_address:  string | null;
  created_at:  string;
  actor_email: string | null;
}
