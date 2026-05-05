import { Suspense, useState } from 'react';
import { useAuthStore } from '@stores/auth.store';
import { WetlandMap } from '@components/map/WetlandMap';
import { ReportPopup } from '@components/map/ReportPopup';
import { Spinner } from '@components/ui/Spinner';
import { useFilterSync } from '@hooks/useFilterSync';
import { cn } from '@utils/cn';
import { User } from 'lucide-react';
import { SearchBar } from '@components/dashboard/SearchBar';
import { QuickExport } from '@components/dashboard/QuickExport';
import { AddData } from '@components/dashboard/AddData';
import { SetAOI } from '@components/dashboard/SetAOI';
import { QuickInsightsPanel } from '@components/dashboard/QuickInsightsPanel';
import { DataPanel } from '@components/dashboard/DataPanel';

type MobileTab = 'map' | 'insights' | 'data';

export function DashboardPage() {
  useFilterSync();
  const logout = useAuthStore((s) => s.logout);
  const [mobileTab, setMobileTab] = useState<MobileTab>('map');
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden font-sans" style={{ background: '#E8EEF5' }}>

      {/* ── Top Bar ── */}
      <header className="flex-shrink-0 flex items-center gap-4 px-6 py-4 shadow-sm relative" style={{ background: '#D4E3F0', borderBottom: '1px solid #B8CFDF', minHeight: '80px', zIndex: 100 }}>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex flex-col items-center gap-1">
            <svg viewBox="0 0 120 120" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', flexShrink: 0 }}>
              {/* Rounded square background - Navy Blue #05734e */}
              <rect x="10" y="10" width="100" height="100" rx="20" fill="#05734e"/>
              
              {/* Reed motif - White #ffffff - Three curved organic reeds */}
              {/* Left reed - shortest, curves left */}
              <path d="M 40 85 Q 38 70 35 60 Q 33 50 38 45 Q 40 50 42 60 Q 45 70 43 85 Z" fill="#ffffff"/>
              
              {/* Center reed - tallest, straight */}
              <path d="M 55 85 Q 52 60 50 45 Q 48 30 55 25 Q 62 30 60 45 Q 58 60 65 85 Z" fill="#ffffff"/>
              
              {/* Right reed - medium, curves right */}
              <path d="M 75 85 Q 73 65 75 55 Q 77 45 82 42 Q 85 47 83 55 Q 81 65 85 85 Z" fill="#ffffff"/>
            </svg>
            <span className="font-bold text-sm tracking-wider leading-none" style={{ color: '#083650' }}>WETLABS</span>
          </div>
        </div>
        <div className="flex-1 max-w-2xl">
          <SearchBar />
        </div>
        <button
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
          style={{ background: '#1E6F5C' }}
        >
          <User className="w-4 h-4" />
          Log In
        </button>
      </header>

      {/* ── Desktop: 3-column layout ── */}
      <style>{`
        .desktop-layout { display: none; }
        .mobile-layout { display: flex; }
        @media (min-width: 1024px) {
          .desktop-layout { display: flex !important; }
          .mobile-layout { display: none !important; }
        }
      `}</style>
      
      <div className="desktop-layout flex-1 overflow-hidden flex relative">

        {/* Left — Quick Insights */}
        <aside className="flex flex-col h-full overflow-hidden w-[340px] flex-shrink-0 shadow-lg" style={{ background: '#FFFFFF', zIndex: 20 }}>
          <div className="flex-shrink-0 px-6 py-4" style={{ background: '#F8FAFB', borderBottom: '1px solid #E1E8ED' }}>
            <h2 className="text-lg font-bold" style={{ color: '#1A4D5E' }}>Quick Insights</h2>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <Suspense fallback={<div className="flex items-center justify-center h-32"><Spinner /></div>}>
              <QuickInsightsPanel />
            </Suspense>
          </div>
          <div className="flex-shrink-0 p-4 space-y-3" style={{ background: '#F8FAFB', borderTop: '1px solid #E1E8ED' }}>
            <QuickExport />
            <div className="flex gap-2">
              <SetAOI />
              <AddData />
            </div>
          </div>
        </aside>

        {/* Center — Map */}
        <main className="flex-1 relative overflow-hidden" style={{ isolation: 'isolate' }}>
          <WetlandMap />
          <ReportPopup />
        </main>

        {/* Right — Data Panel */}
        <aside className="flex flex-col h-full overflow-hidden w-[300px] flex-shrink-0 shadow-lg" style={{ background: '#FFFFFF', zIndex: 20 }}>
          <div className="flex-shrink-0 px-6 py-4" style={{ background: '#1E6F5C' }}>
            <h2 className="text-lg font-bold text-white">Data Panel</h2>
          </div>
          <div className="flex-1 overflow-y-auto" style={{ background: '#FFFFFF' }}>
            <DataPanel />
          </div>
        </aside>

      </div>

      {/* ── Mobile: map always visible + slide-up drawer ── */}
      <div className="mobile-layout flex-1 overflow-hidden flex flex-col relative">
        <div className="flex-1 relative overflow-hidden" style={{ isolation: 'isolate' }}>
          <WetlandMap />
          <ReportPopup />
        </div>
        {mobileTab !== 'map' && (
          <div
            className={cn('absolute inset-x-0 bottom-0 border-t z-20 flex flex-col transition-all duration-300', drawerOpen ? 'h-[70vh]' : 'h-[45vh]')}
            style={{ background: '#FFFFFF', borderColor: '#E1E8ED' }}
          >
            <button
              type="button"
              onClick={() => setDrawerOpen(o => !o)}
              className="flex-shrink-0 flex items-center justify-center py-2 border-b"
              style={{ borderColor: '#E1E8ED', color: '#6B8A99' }}
            >
              {drawerOpen ? '▼' : '▲'}
            </button>
            {mobileTab === 'insights' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                  <Suspense fallback={<div className="flex items-center justify-center h-32"><Spinner /></div>}>
                    <QuickInsightsPanel />
                  </Suspense>
                </div>
              </div>
            )}
            {mobileTab === 'data' && (
              <div className="flex-1 overflow-y-auto">
                <DataPanel />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="mobile-layout flex-shrink-0 flex border-t" style={{ background: '#FFFFFF', borderColor: '#E1E8ED' }}>
        {[
          { id: 'map' as const, label: 'Map' },
          { id: 'insights' as const, label: 'Insights' },
          { id: 'data' as const, label: 'Data' },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setMobileTab(id); if (id === 'map') setDrawerOpen(false); }}
            className="flex-1 py-3 text-sm font-medium transition-colors"
            style={{
              color: mobileTab === id ? '#1E6F5C' : '#6B8A99',
              background: mobileTab === id ? '#E8F5F1' : 'transparent',
            }}
          >
            {label}
          </button>
        ))}
      </nav>

    </div>
  );
}
