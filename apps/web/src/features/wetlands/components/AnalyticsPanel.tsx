import { useUiStore }         from '@stores/ui.store';
import { useWetlandSummary }  from '../hooks/useWetlands';
import { Spinner }            from '@components/ui/Spinner';
import { EmptyState }         from '@components/ui/EmptyState';
import { BarChart2 }          from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { OBS_TYPE_LABELS }    from '@utils/severity';

export function AnalyticsPanel() {
  const code = useUiStore((s) => s.selectedWetlandCode);
  const { data, isLoading } = useWetlandSummary(code);

  if (!code) return (
    <EmptyState
      icon={BarChart2}
      title="Select a wetland"
      message="Click any wetland boundary on the map to view analytics and satellite indices."
    />
  );

  if (isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (!data)     return null;

  // Transform time_series for recharts
  const weeks = [...new Set(data.time_series.map(r => r.week))].sort();
  const obsTypes = [...new Set(data.time_series.map(r => r.observation_type))];
  const chartData = weeks.map(week => {
    const weekRows = data.time_series.filter(r => r.week === week);
    const entry: Record<string, unknown> = { week: format(parseISO(week), 'dd MMM') };
    obsTypes.forEach(t => { entry[t] = weekRows.find(r => r.observation_type === t)?.count ?? 0; });
    return entry;
  });

  const COLOURS = ['#14B8A6','#F59E0B','#EF4444','#10B981','#6366F1','#EC4899','#F97316'];

  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Wetland ID */}
      <div>
        <p className="data-label">WETLAND</p>
        <p className="font-mono text-sm text-teal-300">{code}</p>
      </div>

      {/* Satellite indices — US-09 */}
      <div className="grid grid-cols-2 gap-2">
        {(['ndvi','ndwi'] as const).map((idx) => {
          const val  = data.satellite[idx];
          const stale = data.satellite.stale;
          return (
            <div key={idx} className="panel p-3">
              <p className="data-label mb-1">{idx.toUpperCase()}</p>
              {val !== null && val !== undefined
                ? <p className="font-mono text-lg text-teal-300">{val.toFixed(3)}</p>
                : <p className="font-mono text-xs text-slate-500">—</p>}
              {stale && <p className="text-[9px] font-mono text-amber-400 mt-1">⚠ DATA STALE</p>}
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div>
        <p className="data-label mb-2">TOTALS · {data.period.from.split('T')[0]} → {data.period.to.split('T')[0]}</p>
        <div className="space-y-1">
          {(data.by_type || []).map(({ observation_type: type, count }) => (
            <div key={type} className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400 w-32 truncate">{OBS_TYPE_LABELS[type] ?? type}</span>
              <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, (Number(count) / (data.total_reports || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-teal-400 w-6 text-right">{count as React.ReactNode}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time series chart — US-11 */}
      {chartData.length > 0 && (
        <div>
          <p className="data-label mb-3">WEEKLY TREND</p>
          <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="rgba(20,184,166,0.07)" strokeDasharray="3 3" />
              <XAxis dataKey="week" tick={{ fill:'#475569', fontSize:9, fontFamily:'DM Mono' }} />
              <YAxis tick={{ fill:'#475569', fontSize:9, fontFamily:'DM Mono' }} />
              <Tooltip
                contentStyle={{ background:'#172033', border:'1px solid rgba(20,184,166,0.2)', borderRadius:8, fontFamily:'DM Mono', fontSize:11 }}
                labelStyle={{ color:'#94A3B8' }}
              />
              {obsTypes.map((type, i) => (
                <Line key={type} type="monotone" dataKey={type}
                  name={OBS_TYPE_LABELS[type] ?? type}
                  stroke={COLOURS[i % COLOURS.length]}
                  strokeWidth={1.5} dot={false} activeDot={{ r:3 }}
                />
              ))}
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
