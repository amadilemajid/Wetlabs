import { useUiStore } from '@stores/ui.store';
import { useReports } from '@features/reports/hooks/useReports';
import { cn } from '@utils/cn';

export function DataPanel() {
  const {
    isSatelliteLayer, isWetlandBoundaryLayer, isNdwiLayer, isNdviLayer,
    toggleSatellite, toggleDem, toggleWetlandBoundary, toggleNdwi, toggleNdvi,
    isDemLayer,
  } = useUiStore();

  const { data } = useReports();
  const features = data?.features ?? [];

  const high = features.filter(f => f.properties.severity === 'HIGH').length;
  const medium = features.filter(f => f.properties.severity === 'MEDIUM').length;
  const low = features.filter(f => f.properties.severity === 'LOW').length;

  const obsCounts: Record<string, number> = {};
  features.forEach(f => {
    const t = f.properties.observation_type;
    obsCounts[t] = (obsCounts[t] ?? 0) + 1;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Basemap */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🌍</span>
            <h3 className="text-sm font-bold" style={{ color: '#1A4D5E' }}>Basemap</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={toggleSatellite}
              className={cn('flex flex-col items-center gap-1 p-2 rounded border-2 transition-all', isSatelliteLayer ? 'border-blue-500' : 'border-gray-300')}
            >
              <div className="w-full h-16 rounded overflow-hidden">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%2334495e' width='100' height='100'/%3E%3Ctext x='50' y='55' font-size='12' fill='white' text-anchor='middle'%3ESatellite%3C/text%3E%3C/svg%3E" alt="Satellite" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-medium" style={{ color: '#2C3E50' }}>Satellite</span>
            </button>
            <button
              onClick={toggleDem}
              className={cn('flex flex-col items-center gap-1 p-2 rounded border-2 transition-all', isDemLayer ? 'border-blue-500' : 'border-gray-300')}
            >
              <div className="w-full h-16 rounded overflow-hidden">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%238B7355' width='100' height='100'/%3E%3Ctext x='50' y='55' font-size='12' fill='white' text-anchor='middle'%3ETerrain%3C/text%3E%3C/svg%3E" alt="Terrain" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-medium" style={{ color: '#2C3E50' }}>Terrain</span>
            </button>
            <button
              onClick={() => { if (isSatelliteLayer) toggleSatellite(); if (isDemLayer) toggleDem(); }}
              className={cn('flex flex-col items-center gap-1 p-2 rounded border-2 transition-all', !isSatelliteLayer && !isDemLayer ? 'border-blue-500' : 'border-gray-300')}
            >
              <div className="w-full h-16 rounded overflow-hidden">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23ecf0f1' width='100' height='100'/%3E%3Ctext x='50' y='55' font-size='12' fill='%232c3e50' text-anchor='middle'%3EStreets%3C/text%3E%3C/svg%3E" alt="Streets" className="w-full h-full object-cover" />
              </div>
              <span className="text-xs font-medium" style={{ color: '#2C3E50' }}>Streets</span>
            </button>
          </div>
        </div>

        {/* Layers */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <input type="checkbox" className="w-5 h-5" style={{ accentColor: '#1E6F5C' }} checked disabled />
            <h3 className="text-sm font-bold" style={{ color: '#1A4D5E' }}>Layers</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Wetland Sites', checked: isWetlandBoundaryLayer, toggle: toggleWetlandBoundary },
              { label: 'Water Bodies', checked: isNdwiLayer, toggle: toggleNdwi },
              { label: 'Risk Zones', checked: isNdviLayer, toggle: toggleNdvi },
            ].map(({ label, checked, toggle }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={toggle}
                  className="w-5 h-5"
                  style={{ accentColor: '#1E6F5C' }}
                />
                <span className="text-sm" style={{ color: '#2C3E50' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Severity Legend */}
        <div>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#1A4D5E' }}>Severity Legend</h3>
          <div className="space-y-2">
            {[
              { label: 'Low', color: '#27AE60', count: low },
              { label: 'Moderate', color: '#F39C12', count: medium },
            ].map(({ label, color, count }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full" style={{ background: color }} />
                <span className="text-sm flex-1" style={{ color: '#2C3E50' }}>{label}</span>
                <span className="text-sm font-bold" style={{ color }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reported Cases */}
        <div>
          <h3 className="text-sm font-bold mb-3" style={{ color: '#1A4D5E' }}>Reported Cases</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '🏭', label: 'Pollution', type: 'POLLUTION' },
              { emoji: '🌿', label: 'Vegetation', type: 'VEGETATION_CHANGE' },
              { emoji: '💧', label: 'Water Level', type: 'FLOOD' },
              { emoji: '🏗️', label: 'Encroachment', type: 'ENCROACHMENT' },
              { emoji: '🏠', label: 'Flood', type: 'FLOOD' },
              { emoji: '☀️', label: 'Drought', type: 'DROUGHT' },
              { emoji: '🦎', label: 'Wildlife', type: 'WILDLIFE' },
              { emoji: '🦎', label: 'Wildlife', type: 'WILDLIFE' },
            ].map(({ emoji, label, type }, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xl">{emoji}</span>
                <div className="min-w-0">
                  <div className="text-xs truncate" style={{ color: '#6B8A99' }}>{label}</div>
                  <div className="text-sm font-bold" style={{ color: '#1E6F5C' }}>{obsCounts[type] ?? 0}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Set AOI Button */}
      <div className="flex-shrink-0 p-4" style={{ background: '#F8FAFB', borderTop: '1px solid #E1E8ED' }}>
        <button className="w-full py-3 rounded-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity" style={{ background: '#1E6F5C' }}>
          Set AOI
        </button>
      </div>
    </div>
  );
}
