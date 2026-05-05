import { useState, useEffect, useRef } from 'react';
import { useUiStore } from '@stores/ui.store';
import { Smartphone, Phone, PhoneOff, Send, X, Delete, ChevronLeft } from 'lucide-react';
import { cn } from '@utils/cn';
import { apiClient } from '@api/client';
import { useQueryClient } from '@tanstack/react-query';
import { REPORTS_KEY } from '@features/reports/hooks/useReports';

type Screen = 'LOCKED' | 'HOME' | 'DIALER' | 'USSD' | 'SMS_SENT';

const USSD_CODE = '*384#';

export function VirtualPhone() {
  const { isVirtualPhoneOpen, toggleVirtualPhone } = useUiStore();
  const [screen, setScreen]       = useState<Screen>('LOCKED');
  const [dialText, setDialText]   = useState('');
  const [ussdContent, setUssdContent] = useState('');
  const [ussdInput, setUssdInput] = useState('');
  const [fullText, setFullText]   = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastReportId, setLastReportId] = useState<string | null>(null);
  const [sessionId]               = useState(() => `sim_${Math.random().toString(36).slice(2, 9)}`);
  const inputRef                  = useRef<HTMLInputElement>(null);
  const qc                        = useQueryClient();

  useEffect(() => {
    if (!isVirtualPhoneOpen) {
      setScreen('LOCKED');
      setDialText('');
      setUssdContent('');
      setFullText('');
      setUssdInput('');
      setLastReportId(null);
    }
  }, [isVirtualPhoneOpen]);

  useEffect(() => {
    if (screen === 'USSD') inputRef.current?.focus();
  }, [screen, ussdContent]);

  const pressKey = (k: string) => {
    setDialText(prev => prev.length < 15 ? prev + k : prev);
  };

  const handleDial = async () => {
    if (dialText !== USSD_CODE) {
      setDialText('Invalid code');
      setTimeout(() => setDialText(''), 1800);
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiClient.post<string>('/ussd/callback', {
        sessionId, phoneNumber: '+256700000000', text: '',
      }, { headers: { 'x-ussd-simulator-key': 'dev-sim-key' } });
      setUssdContent(typeof res.data === 'string' ? res.data : JSON.stringify(res.data));
      setFullText('');
      setScreen('USSD');
    } catch {
      setUssdContent('CON Welcome to WETLABS\n1. Report\n2. My Reports\n3. Help\n0. Exit');
      setScreen('USSD');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUssdSend = async () => {
    if (!ussdInput.trim()) return;
    setIsLoading(true);
    const nextText = fullText ? `${fullText}*${ussdInput}` : ussdInput;
    try {
      const res = await apiClient.post<string>('/ussd/callback', {
        sessionId, phoneNumber: '+256700000000', text: nextText,
      }, { headers: { 'x-ussd-simulator-key': 'dev-sim-key' } });
      const text = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      setUssdContent(text);
      setFullText(nextText);
      setUssdInput('');
      if (text.startsWith('END')) {
        // Extract report ID if present
        const match = text.match(/WL-[\d-]+/);
        if (match) setLastReportId(match[0]);
        setTimeout(() => {
          void qc.invalidateQueries({ queryKey: [REPORTS_KEY] });
          setScreen('SMS_SENT');
        }, 1200);
      }
    } catch {
      setUssdContent('END Session error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  // ── FAB when closed ──────────────────────────────────────────────────────────
  if (!isVirtualPhoneOpen) return (
    <button
      onClick={toggleVirtualPhone}
      className="absolute bottom-6 left-6 z-[2000] w-14 h-14 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center justify-center hover:bg-emerald-500 transition-all"
      title={`Open Virtual Phone — dial ${USSD_CODE} to report`}
    >
      <Smartphone className="w-6 h-6" />
    </button>
  );

  return (
    <div className="absolute bottom-6 left-6 z-[2500] animate-slide-in-up select-none">
      {/* Phone shell */}
      <div className="relative w-[260px] bg-[#1a1a1a] rounded-[44px] border-[3px] border-[#2a2a2a] shadow-[0_30px_80px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.05)]">

        {/* Side buttons */}
        <div className="absolute -left-[5px] top-20 w-[3px] h-8 bg-[#333] rounded-l-sm" />
        <div className="absolute -left-[5px] top-32 w-[3px] h-12 bg-[#333] rounded-l-sm" />
        <div className="absolute -left-[5px] top-48 w-[3px] h-12 bg-[#333] rounded-l-sm" />
        <div className="absolute -right-[5px] top-28 w-[3px] h-16 bg-[#333] rounded-r-sm" />

        {/* Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-28 h-6 bg-[#111] rounded-b-2xl flex items-center justify-center gap-2">
            <div className="w-10 h-1.5 bg-[#222] rounded-full" />
            <div className="w-2 h-2 bg-[#222] rounded-full" />
          </div>
        </div>

        {/* Screen */}
        <div className="mx-2 mb-2 rounded-[32px] overflow-hidden bg-black" style={{ height: 480 }}>

          {/* ── LOCKED ── */}
          {screen === 'LOCKED' && (
            <div className="h-full flex flex-col bg-gradient-to-b from-emerald-900/60 to-black">
              <div className="flex-1 flex flex-col items-center justify-center gap-1">
                <p className="text-white text-4xl font-light tracking-tight">{timeStr}</p>
                <p className="text-white/60 text-xs">{dateStr}</p>
                <div className="mt-6 w-12 h-12 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center">
                  <span className="text-2xl">💧</span>
                </div>
                <p className="text-emerald-400 text-xs font-mono mt-1 tracking-widest">WETLABS</p>
              </div>
              <div className="pb-8 flex flex-col items-center gap-3">
                <p className="text-white/40 text-[10px] font-mono">Dial {USSD_CODE} to report</p>
                <button
                  onClick={() => setScreen('HOME')}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-all"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <p className="text-white/30 text-[9px] font-mono">SWIPE UP</p>
              </div>
            </div>
          )}

          {/* ── HOME ── */}
          {screen === 'HOME' && (
            <div className="h-full flex flex-col bg-gradient-to-b from-emerald-900/40 to-[#0a0a0a]">
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <p className="text-white/50 text-[10px] font-mono">{timeStr}</p>
                <div className="flex gap-1 text-white/50">
                  <span className="text-[9px]">▲▲▲</span>
                  <span className="text-[9px]">WiFi</span>
                  <span className="text-[9px]">🔋</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                  <span className="text-3xl">💧</span>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">WETLABS Reporter</p>
                  <p className="text-white/50 text-[10px] mt-0.5">SMS/USSD Wetland Monitoring</p>
                </div>
                <div className="w-full bg-white/5 rounded-2xl p-3 border border-white/10">
                  <p className="text-white/40 text-[9px] font-mono mb-2">QUICK REPORT</p>
                  <p className="text-emerald-400 text-xs font-mono">Dial: <span className="text-white font-bold">{USSD_CODE}</span></p>
                  <p className="text-white/30 text-[9px] mt-1">No internet required · Works on 2G</p>
                </div>
              </div>
              <div className="pb-6 flex justify-center gap-8">
                <button
                  onClick={() => setScreen('DIALER')}
                  className="w-14 h-14 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 hover:bg-emerald-500 transition-all active:scale-95"
                >
                  <Phone className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* ── DIALER ── */}
          {screen === 'DIALER' && (
            <div className="h-full flex flex-col bg-[#0f0f0f]">
              <div className="flex items-center px-4 pt-4 pb-2">
                <button onClick={() => setScreen('HOME')} className="text-white/40 hover:text-white/70 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <p className="text-white/40 text-[10px] font-mono mx-auto">KEYPAD</p>
              </div>

              {/* Display */}
              <div className="px-6 py-4 text-center">
                <p className={cn(
                  'font-mono text-2xl tracking-widest transition-colors',
                  dialText === 'Invalid code' ? 'text-red-400' : 'text-white'
                )}>
                  {dialText || <span className="text-white/20">_ _ _ _ _</span>}
                </p>
                <p className="text-white/30 text-[9px] font-mono mt-1">Enter {USSD_CODE}</p>
              </div>

              {/* Keypad */}
              <div className="flex-1 px-4">
                <div className="grid grid-cols-3 gap-2">
                  {['1','2','3','4','5','6','7','8','9','*','0','#'].map(k => (
                    <button
                      key={k}
                      onClick={() => pressKey(k)}
                      className="h-12 rounded-2xl bg-white/8 border border-white/5 text-white font-mono text-lg hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-center gap-6 py-5">
                <button
                  onClick={() => setDialText(p => p.slice(0, -1))}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
                >
                  <Delete className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDial}
                  disabled={isLoading}
                  className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-900/60 hover:bg-emerald-500 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Phone className="w-7 h-7" />}
                </button>
                <button
                  onClick={() => { setDialText(''); setScreen('HOME'); }}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/10 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ── USSD SESSION ── */}
          {screen === 'USSD' && (
            <div className="h-full flex flex-col bg-[#f5f5f0]">
              {/* USSD header bar */}
              <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">U</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-xs font-semibold leading-none">WETLABS USSD</p>
                  <p className="text-white/70 text-[9px] font-mono">{USSD_CODE}</p>
                </div>
                <button onClick={() => setScreen('DIALER')} className="text-white/60 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* USSD content */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                  <pre className="font-mono text-[12px] text-gray-800 leading-relaxed whitespace-pre-wrap break-words">
                    {ussdContent.replace(/^(CON|END)\s?/, '')}
                  </pre>
                </div>
                {ussdContent.startsWith('END') && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <p className="text-emerald-700 text-[11px] font-mono text-center">✓ Session ended</p>
                  </div>
                )}
              </div>

              {/* Input area */}
              {!ussdContent.startsWith('END') ? (
                <div className="p-3 bg-white border-t border-gray-200">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2">
                    <input
                      ref={inputRef}
                      value={ussdInput}
                      onChange={e => setUssdInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && void handleUssdSend()}
                      placeholder="Enter option number..."
                      className="flex-1 bg-transparent text-gray-800 font-mono text-sm outline-none placeholder:text-gray-400"
                    />
                    <button
                      onClick={() => void handleUssdSend()}
                      disabled={isLoading || !ussdInput.trim()}
                      className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white disabled:opacity-40 hover:bg-emerald-500 active:scale-95 transition-all"
                    >
                      {isLoading
                        ? <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
                        : <Send className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-gray-400 text-[9px] font-mono text-center mt-1.5">Type a number and press Send</p>
                </div>
              ) : (
                <div className="p-3 bg-white border-t border-gray-200">
                  <button
                    onClick={() => { setScreen('HOME'); setDialText(''); setFullText(''); setUssdContent(''); }}
                    className="w-full py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-500 active:scale-95 transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── SMS CONFIRMATION ── */}
          {screen === 'SMS_SENT' && (
            <div className="h-full flex flex-col bg-[#f5f5f0]">
              <div className="bg-emerald-600 px-4 py-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">S</div>
                <div className="flex-1">
                  <p className="text-white text-xs font-semibold">SMS Confirmation</p>
                  <p className="text-white/70 text-[9px]">WETLABS System</p>
                </div>
              </div>
              <div className="flex-1 p-4 flex flex-col gap-3">
                {/* Incoming SMS bubble */}
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-1">W</div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm border border-gray-100 max-w-[85%]">
                    <p className="text-gray-800 text-[11px] leading-relaxed font-mono">
                      ✅ Report submitted!{'\n'}
                      {lastReportId && <>ID: <span className="font-bold text-emerald-700">{lastReportId}</span>{'\n'}</>}
                      Thank you for protecting Uganda's wetlands.{'\n'}
                      Your officer has been notified.
                    </p>
                    <p className="text-gray-400 text-[9px] mt-1 text-right font-mono">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {/* Info note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-2">
                  <p className="text-blue-600 text-[10px] font-mono leading-relaxed">
                    ℹ️ Report is now visible on the map. Analysts will validate and cross-reference with satellite data.
                  </p>
                </div>
              </div>
              <div className="p-3 bg-white border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => { setScreen('DIALER'); setDialText(''); setFullText(''); setUssdContent(''); setLastReportId(null); }}
                  className="flex-1 py-2.5 border border-emerald-600 text-emerald-600 rounded-xl text-xs font-mono font-semibold hover:bg-emerald-50 active:scale-95 transition-all"
                >
                  New Report
                </button>
                <button
                  onClick={toggleVirtualPhone}
                  className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-mono font-semibold hover:bg-emerald-500 active:scale-95 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2">
          <button
            onClick={toggleVirtualPhone}
            className="w-24 h-1 bg-white/20 rounded-full hover:bg-white/40 transition-colors"
            title="Close phone"
          />
        </div>
      </div>

      {/* Close FAB */}
      <button
        onClick={toggleVirtualPhone}
        className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-all shadow-lg"
        title="Close"
      >
        <PhoneOff className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
