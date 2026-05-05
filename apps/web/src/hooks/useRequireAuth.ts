import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@stores/auth.store';
import type { UserRole } from '@wetlabs/shared-types';

export function useRequireAuth(allowedRoles?: UserRole[]) {
  const { isAuthed, role } = useAuthStore();
  const navigate           = useNavigate();

  useEffect(() => {
    if (!isAuthed) { void navigate('/login', { replace: true }); return; }
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      void navigate('/dashboard', { replace: true });
    }
  }, [isAuthed, role, allowedRoles, navigate]);
}
