import { SEVERITY_CONFIG } from '@utils/severity';

export function MapLegend() {
  const severities = [
    { id: 'HIGH',   ...SEVERITY_CONFIG.HIGH },
    { id: 'MEDIUM', ...SEVERITY_CONFIG.MEDIUM },
    { id: 'LOW',    ...SEVERITY_CONFIG.LOW },
  ];

  return (
    <div className="panel p-3 flex flex-col gap-2 rounded-xl bg-slate-900/80 backdrop-blur border border-teal-500/20 shadow-lg pointer-events-none animate-fade-in w-48">
      <h3 className="font-mono text-[10px] font-semibold text-slate-400 tracking-widest leading-none border-b border-teal-500/10 pb-2 mb-1">
        MAP LEGEND
      </h3>
      
      <div className="flex flex-col gap-2">
        <div className="text-[10px] text-slate-400 font-mono">Report Severity</div>
        {severities.map((sev) => (
          <div key={sev.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full border border-white/80 shadow-[0_0_4px_rgba(0,0,0,0.5)] shrink-0"
              style={{ backgroundColor: sev.colour, boxShadow: `0 0 6px ${sev.colour}60` }}
            />
            <span className="font-mono text-xs text-slate-300">{sev.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-1 pt-2 border-t border-teal-500/10 flex flex-col gap-2">
         <div className="text-[10px] text-slate-400 font-mono">Territories</div>
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-dashed border-teal-500/80 bg-teal-500/10 rounded-sm shrink-0" />
            <span className="font-mono text-xs text-slate-300">Wetland bounds</span>
         </div>
      </div>
    </div>
  );
}