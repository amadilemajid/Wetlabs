import { Link } from 'react-router-dom';
import { WetlandMap }     from '@components/map/WetlandMap';
import { ReportPopup }    from '@components/map/ReportPopup';
import { MapLayerToggle } from '@components/map/MapLayerToggle';
import { MapLegend }      from '@components/map/MapLegend';
import { VirtualPhone }   from '@components/ui/VirtualPhone';
import { WetLabsLogo }    from '@components/ui/WetLabsLogo';
import { useUiStore }     from '@stores/ui.store';
import { useAuthStore }   from '@stores/auth.store';
import { LayoutDashboard, LogIn, Smartphone } from 'lucide-react';

export function MapOnlyPage() {
  const { isVirtualPhoneOpen } = useUiStore();
  const { isAuthed }           = useAuthStore();

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#0D1F35' }}>
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <WetlandMap />
      </div>

      <ReportPopup />

      {/* Top-left brand */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 1000 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur border border-teal-500/20 shadow-lg pointer-events-none">
        <WetLabsLogo className="w-5 h-5" />
        <div>
          <p className="font-mono text-xs font-semibold text-teal-400 tracking-widest leading-none">WETLABS</p>
          <p className="font-mono text-[9px] text-slate-500 tracking-wider">INTERACTIVE MAP</p>
        </div>
      </div>

      {/* Map Layer Toggle - Map UI Controls */}
      {/* Positioned Left to ensure it does NOT hit the Prototype Button on the Right */}
      <div style={{ position: 'absolute', bottom: '24px', left: '16px', zIndex: 1000 }}>
        <MapLayerToggle />
      </div>

      {/* Legend - Bottom right */}
      <div style={{ position: 'absolute', bottom: '24px', right: '16px', zIndex: 1000 }}>
        <MapLegend />
      </div>

      <VirtualPhone />

      {/* Top-center USSD hint */}
      {!isVirtualPhoneOpen && (
        <div style={{ position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }} className="px-3 py-1.5 rounded-full bg-emerald-900/70 backdrop-blur border border-emerald-500/30 shadow-lg animate-fade-in">
          <p className="font-mono text-[10px] text-emerald-400 tracking-wider whitespace-nowrap">
            📱 Tap the phone icon · Dial <span className="font-bold text-white">*384#</span> to report
          </p>
        </div>
      )}

      {/* Top-right nav */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1000, display: 'flex', gap: '8px' }} className="items-center">
        <Link
          to="/prototype"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur border border-emerald-500/20 text-emerald-400 hover:text-emerald-300 transition-colors shadow-lg font-mono text-[10px] tracking-wider"
        >
          <Smartphone className="w-3.5 h-3.5" />
          PROTOTYPE
        </Link>
        {isAuthed ? (
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur border border-teal-500/20 text-slate-400 hover:text-teal-400 transition-colors shadow-lg font-mono text-[10px] tracking-wider"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            DASHBOARD
          </Link>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 backdrop-blur border border-teal-500/20 text-slate-400 hover:text-teal-400 transition-colors shadow-lg font-mono text-[10px] tracking-wider"
          >
            <LogIn className="w-3.5 h-3.5" />
            ANALYST LOGIN
          </Link>
        )}
      </div>
    </div>
  );
}
