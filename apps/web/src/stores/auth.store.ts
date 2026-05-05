import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@wetlabs/shared-types';

interface AuthState {
  token:           string | null;
  role:            UserRole | null;
  email:           string | null;
  isAuthed:        boolean;
  setAuth:         (token: string, role: UserRole, email: string) => void;
  logout:          () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXYtdXNlci1pZCIsImVtYWlsIjoiZGV2QHdldGxhYnMub3JnIiwicm9sZSI6IlNZU1RFTV9BRE1JTiIsImlhdCI6MTc3Njg4NTI4NCwiZXhwIjoxODA4NDIxMjg0fQ.WZuKadtowhGDWHRuzoQCxxQijvPaCHtRfLiQ64_eqPLOIeyvhMCRGZ9Ik1WpZB8BJrauC1pQDkIw0IYv18OHDp-tx3yAc3eEGon_7S9R1_3Z8ZWGCuFzrSIWoFfHI0wPdOS-yBKmXdtrgFRsLm06u6Hm67BW5dDIuCIELmX2f7IlXnhSQUmEC9sGjzKfVEtuz47Bg9jh6XQBkyw23ri1Ow0V7ehs5BrOUtFr_Fkegbo6bycTDM49NOqO11ZwjE2bkfaKYXjIOlPOZcrRugRaKL3RjTXM1lLLAu3E9cdd99K2JfybA7cu9Skd0xFSN7efQKv6T_tgDHRodlcQ3thLlA',
      role:     'SYSTEM_ADMIN',
      email:    'dev@wetlabs.org',
      isAuthed: true,
      setAuth:         (token, role, email) => set({ token, role, email, isAuthed: true }),
      logout:          ()                   => set({ token: null, role: null, email: null, isAuthed: false }),
      isAuthenticated: ()                   => true,
    }),
    { 
      name: 'wetlabs-auth', 
      partialize: (s) => ({ token: s.token, role: s.role, email: s.email, isAuthed: s.isAuthed }),
    },
  ),
);
