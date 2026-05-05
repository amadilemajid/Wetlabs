import * as Popover from '@radix-ui/react-popover';
import { Filter, X } from 'lucide-react';
import { useFilterStore } from '@stores/filter.store';
import { Button }         from '@components/ui/Button';
import { cn }             from '@utils/cn';
import type { SeverityLevel, ObservationType, ReportChannel } from '@wetlabs/shared-types';

const SEVERITIES:  SeverityLevel[]   = ['LOW','MEDIUM','HIGH'];
const OBS_TYPES:   ObservationType[] = ['FLOOD','DROUGHT','ENCROACHMENT','VEGETATION_CHANGE','POLLUTION','WILDLIFE','OTHER'];
const CHANNELS:    ReportChannel[]   = ['USSD','SMS','WEB_FORM'];

export function FilterDropdown() {
  const { from, to, severity, observation_type, channel, setDateRange, setSeverity, setObservationType, setChannel, resetFilters } = useFilterStore();

  const activeCount = [
    severity?.length,
    observation_type?.length,
    channel?.length,
  ].filter(Boolean).length;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm" aria-label="Open filters">
          <Filter className="w-3.5 h-3.5" />
          FILTER
          {activeCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-teal-500 text-canvas text-[9px] flex items-center justify-center font-mono">
              {activeCount}
            </span>
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side="right" align="start" sideOffset={8}
          className="panel w-72 p-4 z-[1500] animate-slide-in-left space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-teal-400 tracking-widest">FILTERS</span>
            <button onClick={resetFilters} className="text-[10px] font-mono text-slate-500 hover:text-amber-400 flex items-center gap-1">
              <X className="w-3 h-3" /> RESET
            </button>
          </div>

          {/* Date range */}
          <div className="space-y-2">
            <span className="data-label">DATE RANGE</span>
            <div className="grid grid-cols-2 gap-2">
              {(['from','to'] as const).map((key) => (
                <div key={key} className="space-y-1">
                  <label htmlFor={`filter-${key}`} className="data-label">{key.toUpperCase()}</label>
                  <input
                    id={`filter-${key}`}
                    type="date"
                    value={key === 'from' ? from : to}
                    onChange={(e) => setDateRange(key === 'from' ? e.target.value : from!, key === 'to' ? e.target.value : to!)}
                    className="w-full bg-slate-900 border border-teal-500/20 rounded px-2 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-teal-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <span className="data-label">SEVERITY</span>
            <div className="flex gap-1.5 flex-wrap">
              {SEVERITIES.map((s) => (
                <button
                  key={s}
                  aria-pressed={severity?.includes(s)}
                  onClick={() => setSeverity(severity?.includes(s) ? severity.filter(x => x !== s) : [...(severity ?? []), s])}
                  className={cn(
                    'px-2.5 py-1 rounded text-[10px] font-mono border transition-all',
                    severity?.includes(s)
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                      : 'border-slate-700 text-slate-500 hover:border-slate-500',
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Observation type */}
          <div className="space-y-2">
            <span className="data-label">OBSERVATION TYPE</span>
            <div className="flex gap-1.5 flex-wrap">
              {OBS_TYPES.map((t) => (
                <button
                  key={t}
                  aria-pressed={observation_type?.includes(t)}
                  onClick={() => setObservationType(observation_type?.includes(t) ? observation_type.filter(x => x !== t) : [...(observation_type ?? []), t])}
                  className={cn(
                    'px-2 py-1 rounded text-[10px] font-mono border transition-all',
                    observation_type?.includes(t)
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                      : 'border-slate-700 text-slate-500 hover:border-slate-500',
                  )}
                >
                  {t.replace('_',' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Channel */}
          <div className="space-y-2">
            <span className="data-label">SOURCE CHANNEL</span>
            <div className="flex gap-1.5 flex-wrap">
              {CHANNELS.map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={channel?.includes(c)}
                  onClick={() => setChannel(channel?.includes(c) ? channel.filter(x => x !== c) : [...(channel ?? []), c])}
                  className={cn(
                    'px-2 py-1 rounded text-[10px] font-mono border transition-all',
                    channel?.includes(c)
                      ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                      : 'border-slate-700 text-slate-500 hover:border-slate-500',
                  )}
                >
                  {c.replace('_',' ')}
                </button>
              ))}
            </div>
          </div>

          <Popover.Arrow className="fill-slate-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
