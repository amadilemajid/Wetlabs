
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  FileText,
  Download,
  Users,
  Settings,
  LogOut,
  Waves,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth.store';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Overview',   icon: LayoutDashboard },
  { to: '/map',        label: 'Map',         icon: Map },
  { to: '/reports',   label: 'Reports',     icon: FileText },
  { to: '/export',    label: 'Export',      icon: Download },
];

const ADMIN_ITEMS = [
  { to: '/admin/users',  label: 'Users',    icon: Users },
  { to: '/admin/audit',  label: 'Audit Log', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen glass border-r border-slate-800/30 shrink-0">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/30">
        <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center shadow-teal-glow">
          <svg viewBox="0 0 280 280" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="240" height="240" rx="30" fill="#05734e"/>
            <path d="M 100 180 Q 100 120 120 100 L 130 90 L 140 100 Q 160 120 160 180 L 160 200 L 100 200 Z" fill="#ffffff"/>
            <path d="M 140 180 Q 140 130 155 115 L 162 108 L 169 115 Q 184 130 184 180 L 184 200 L 140 200 Z" fill="#ffffff"/>
            <path d="M 70 180 Q 70 140 85 125 L 92 118 L 99 125 Q 114 140 114 180 L 114 200 L 70 200 Z" fill="#ffffff"/>
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white text-sm leading-tight">WETLABS</p>
          <p className="text-xs text-slate-400">Monitoring Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Main</p>
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                isActive
                  ? 'bg-teal-600/20 text-teal-400 border border-teal-500/20 font-medium'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5',
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}

        {user?.role === 'SYSTEM_ADMIN' && (
          <>
            <p className="px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</p>
            {ADMIN_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150',
                    isActive
                      ? 'bg-teal-600/20 text-teal-400 border border-teal-500/20 font-medium'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/5',
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-slate-800/30 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl glass-lighter mb-1">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-brand-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{user?.email}</p>
            <p className="text-xs text-slate-500 truncate">{user?.role?.replace('_', ' ')}</p>
          </div>
          <Bell className="w-4 h-4 text-slate-500 shrink-0" />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
