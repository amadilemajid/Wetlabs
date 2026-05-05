import { Satellite, Leaf, Droplets, Grid, Mountain, Map as MapIcon, Shield, Waves, GitBranch, MapPin } from 'lucide-react';
import { useUiStore } from '@stores/ui.store';
import { cn } from '@utils/cn';

export function MapLayerToggle() {
  const {
    isSatelliteLayer, isNdviLayer, isNdwiLayer, isLulcLayer, isDemLayer,
    isWetlandBoundaryLayer, isProtectedAreaLayer, isDrainageLayer, isHydroshedsLayer, isAdminLayer,
    toggleSatellite, toggleNdvi, toggleNdwi, toggleLulc, toggleDem,
    toggleWetlandBoundary, toggleProtectedArea, toggleDrainage, toggleHydrosheds, toggleAdmin
  } = useUiStore();

  const analyticLayers = [
    { active: isSatelliteLayer, toggle: toggleSatellite, icon: Satellite, label: 'SAT'  },
    { active: isDemLayer,       toggle: toggleDem,       icon: Mountain,  label: 'DEM'  },
    { active: isNdviLayer,      toggle: toggleNdvi,      icon: Leaf,      label: 'NDVI' },
    { active: isNdwiLayer,      toggle: toggleNdwi,      icon: Droplets,  label: 'NDWI' },
    { active: isLulcLayer,      toggle: toggleLulc,      icon: Grid,      label: 'LULC' },
  ];

  const contextualLayers = [
    { active: isWetlandBoundaryLayer, toggle: toggleWetlandBoundary, icon: MapIcon,   label: 'Wetlands' },
    { active: isProtectedAreaLayer,   toggle: toggleProtectedArea,   icon: Shield,    label: 'Protected' },
    { active: isDrainageLayer,        toggle: toggleDrainage,        icon: Waves,     label: 'Drainage' },
    { active: isHydroshedsLayer,      toggle: toggleHydrosheds,      icon: GitBranch, label: 'Hydrosheds' },
    { active: isAdminLayer,           toggle: toggleAdmin,           icon: MapPin,    label: 'Administrative' },
  ];

  return (
    <div className="panel p-1.5 flex flex-col gap-3 animate-fade-in pointer-events-auto max-h-[60vh] overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col gap-1">
        <span className="data-label text-center pb-1 border-b border-teal-500/10">ANALYSIS</span>
        {analyticLayers.map(({ active, toggle, icon: Icon, label }) => (
          <button
            key={label}
            onClick={toggle}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all',
              active
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <span className="data-label text-center pb-1 border-b border-teal-500/10">CONTEXT</span>
        {contextualLayers.map(({ active, toggle, icon: Icon, label }) => (
          <button
            key={label}
            onClick={toggle}
            aria-pressed={active}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all',
              active
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50',
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
