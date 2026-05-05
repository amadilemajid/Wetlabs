import { MapPin } from 'lucide-react';
import { useReports }    from '../hooks/useReports';
import { useUiStore }    from '@stores/ui.store';
import { SeverityBadge, ObsTypeBadge } from '@components/ui/Badge';
import { Spinner }    from '@components/ui/Spinner';
import { EmptyState } from '@components/ui/EmptyState';
import { StatCard }   from '@components/ui/StatCard';
import { fmtRelative } from '@utils/date';
import { Activity, AlertTriangle, Radio, MessageSquare, Smartphone } from 'lucide-react';

export function ReportsList() {
  const { data, isLoading, isError, error } = useReports();
  const selectReport = useUiStore((s) => s.selectReport);

  if (isError) {
    return (
      <div className="p-4 text-xs text-red-400 font-mono">
        API Error: {String(error)}
      </div>
    );
  }

  const total  = data?.meta.total ?? 0;
  const high   = data?.features.filter(f => f.properties.severity === 'HIGH').length ?? 0;
  const sms    = data?.features.filter(f => f.properties.channel  === 'SMS').length ?? 0;
  const ussd   = data?.features.filter(f => f.properties.channel  === 'USSD').length ?? 0;

  return (
    <div className="flex flex-col h-full">
      {/* Stat summary */}
      <div className="grid grid-cols-2 gap-1.5 p-2 border-b border-teal-500/10">
        <StatCard label="VIA USSD" value={ussd}  icon={Radio}        />
        <StatCard label="VIA SMS"  value={sms}   icon={MessageSquare} />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        )}

        {!isLoading && !data?.features.length && (
          <EmptyState
            icon={MapPin}
            title="No reports match your filters"
            message="Try adjusting the date range, severity, or observation type filters."
          />
        )}

        {data?.features.map((feature, i) => {
          const p = feature.properties;
          return (
            <button
              key={p.report_id}
              onClick={() => selectReport(p.report_id)}
              className="w-full text-left px-4 py-3 border-b border-teal-500/5 hover:bg-teal-500/5 transition-colors animate-slide-in-up group"
              style={{ animationDelay: `${Math.min(i * 20, 300)}ms`, animationFillMode: 'both' }}
              aria-label={`View report: ${p.observation_type} at ${p.wetland_code}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex flex-wrap gap-1">
                  <SeverityBadge severity={p.severity} />
                  <ObsTypeBadge  type={p.observation_type} />
                </div>
                {p.is_flagged && (
                  <span className="text-[9px] font-mono text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded flex-shrink-0">
                    FLAGGED
                  </span>
                )}
                <div className="flex items-center gap-1">
                  {p.channel === 'USSD' && (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded leading-none">
                       <Radio className="w-2.5 h-2.5" /> USSD
                    </span>
                  )}
                  {p.channel === 'SMS' && (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-slate-400 bg-slate-500/10 border border-slate-500/20 px-1.5 py-0.5 rounded leading-none">
                       <MessageSquare className="w-2.5 h-2.5" /> SMS
                    </span>
                  )}
                  {p.channel === 'WEB_FORM' && (
                    <span className="flex items-center gap-1 text-[8px] font-mono text-teal-400 bg-teal-500/10 border border-teal-500/20 px-1.5 py-0.5 rounded leading-none">
                       <Smartphone className="w-2.5 h-2.5" /> WEB
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">{p.wetland_code}</span>
                <span className="font-mono text-[10px] text-slate-600">{fmtRelative(p.created_at)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
