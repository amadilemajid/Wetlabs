import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@stores/auth.store';
import { SearchBar } from './SearchBar';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function DashboardHeader({ onMenuToggle }: HeaderProps) {
  const { user } = useAuthStore();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="flex-none flex flex-col bg-white border-b border-slate-200 shadow-sm z-50">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="w-6 h-6 text-teal-700 lg:hidden cursor-pointer hover:bg-slate-100 rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-500 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM11 7H13V13H11V7ZM11 15H13V17H11V15Z"/>
            </svg>
            <span className="font-bold text-xl text-slate-800 tracking-tight hidden sm:block">
              WetLabs
            </span>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="flex-1 max-w-2xl px-4 hidden md:block">
          <SearchBar />
        </div>

        {/* Login Button */}
        <button
          onClick={() => window.location.href = '/login'}
          className="flex items-center gap-2 bg-teal-800 hover:bg-teal-900 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
          <span className="hidden sm:block">{user?.name ? `${user.name}` : 'Log In'}</span>
        </button>
      </div>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div className="px-4 py-3 border-t border-slate-200 md:hidden">
          <div className="flex items-center gap-2">
            <SearchBar />
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Search Toggle */}
      {!showMobileSearch && (
        <button
          onClick={() => setShowMobileSearch(true)}
          className="md:hidden px-4 py-2 text-slate-500 hover:text-teal-700 text-sm font-medium"
        >
          Search Wetlands, Watersheds, Regions...
        </button>
      )}
    </header>
  );
}
