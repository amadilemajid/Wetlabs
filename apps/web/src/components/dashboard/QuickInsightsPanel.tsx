import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useReports } from '@features/reports/hooks/useReports';
import { Spinner } from '@components/ui/Spinner';
import { useState, useEffect } from 'react';

export function QuickInsightsPanel() {
  const { data, isLoading, isError } = useReports();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = data?.features ?? [];
  const total = features.length;
  const high = features.filter(f => f.properties.severity === 'HIGH').length;
  const medium = features.filter(f => f.properties.severity === 'MEDIUM').length;
  const low = features.filter(f => f.properties.severity === 'LOW').length;

  const pct = (n: number) => total ? Math.round((n / total) * 100) : 0;

  const highPct = pct(high);
  const mediumPct = pct(medium);
  const lowPct = pct(low);

  if (isLoading || !mounted) {
    return <div className="flex justify-center py-12"><Spinner /></div>;
  }

  if (isError) {
    return <div className="flex justify-center py-12"><p className="text-sm text-red-500">Failed to load reports</p></div>;
  }

  return (
    <div className="flex flex-col p-6 space-y-6">

      {/* Severity Overview - Large Donut */}
      <div>
        <h3 className="text-base font-bold mb-4" style={{ color: '#1A4D5E' }}>Severity Overview</h3>
        {total === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm" style={{ color: '#6B8A99' }}>No reports in current filter</p>
          </div>
        ) : (
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: 240, height: 240, minWidth: 240, minHeight: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { value: high, color: '#E74C3C' },
                    { value: medium, color: '#F39C12' },
                    { value: low, color: '#27AE60' },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  dataKey="value"
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#E74C3C" />
                  <Cell fill="#F39C12" />
                  <Cell fill="#27AE60" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Labels on segments */}
            <div className="absolute" style={{ top: '15%', left: '20%', textAlign: 'center' }}>
              <div className="font-bold text-2xl text-white">{highPct}%</div>
              <div className="text-xs text-white font-semibold">High</div>
            </div>
            <div className="absolute" style={{ top: '15%', right: '15%', textAlign: 'center' }}>
              <div className="font-bold text-2xl text-white">{mediumPct}%</div>
              <div className="text-xs text-white font-semibold">Moderate</div>
            </div>
            <div className="absolute" style={{ bottom: '20%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
              <div className="font-bold text-2xl text-white">{lowPct}%</div>
              <div className="text-xs text-white font-semibold">Low</div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* High Alerts - Small Ring */}
      <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: '#FEF5F5', border: '1px solid #F5C6CB' }}>
        <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
          <PieChart width={80} height={80}>
            <Pie
              data={[
                { value: high || 1 },
                { value: Math.max(total - high, 0) || 1 },
              ]}
              cx={40}
              cy={40}
              innerRadius={24}
              outerRadius={36}
              dataKey="value"
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#E74C3C" />
              <Cell fill="#F8D7DA" />
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: '#E74C3C' }}>{highPct}%</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: '#721C24' }}>High Alerts</div>
          <div className="text-3xl font-bold" style={{ color: '#E74C3C' }}>{high}</div>
          <div className="text-xs" style={{ color: '#721C24' }}>Critical</div>
          <div className="text-xs" style={{ color: '#999' }}>{highPct}%</div>
        </div>
      </div>

      {/* Moderate Alerts - Small Ring */}
      <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
        <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
          <PieChart width={80} height={80}>
            <Pie
              data={[
                { value: medium || 1 },
                { value: Math.max(total - medium, 0) || 1 },
              ]}
              cx={40}
              cy={40}
              innerRadius={24}
              outerRadius={36}
              dataKey="value"
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              <Cell fill="#F39C12" />
              <Cell fill="#FFF3CD" />
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: '#F39C12' }}>{mediumPct}%</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: '#856404' }}>Moderate Alerts</div>
          <div className="text-3xl font-bold" style={{ color: '#F39C12' }}>{medium}</div>
          <div className="text-xs" style={{ color: '#856404' }}>Moderate</div>
          <div className="text-xs" style={{ color: '#999' }}>{mediumPct}%</div>
        </div>
      </div>

    </div>
  );
}
