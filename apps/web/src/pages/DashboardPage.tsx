
import { useState } from 'react';
import { 
  User, Map as MapIcon, ChevronDown, Check, BarChart2, Layers, 
  Database, AlertTriangle, MapPin, Droplets, Leaf, Waves, 
  Construction, CloudRain, Sun, Footprints, ZoomIn, ZoomOut, 
  Locate, Maximize2, Download
} from 'lucide-react';
import { useAuthStore } from '@stores/auth.store';
import { useUiStore } from '@stores/ui.store';
import { useFilterStore } from '@stores/filter.store';
import type { SeverityLevel, ObservationType } from '@wetlabs/shared-types';
import { WetlandMap } from '@components/map/WetlandMap';
import { SearchBar } from '@components/dashboard/SearchBar';
import { QuickExport } from '@components/dashboard/QuickExport';
import { AddData } from '@components/dashboard/AddData';
import { SetAOI } from '@components/dashboard/SetAOI';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [activeMobileTab, setActiveMobileTab] = useState<'insights' | 'map' | 'data'>('map');

  const {
    isSatelliteLayer, isDemLayer,
    isWetlandBoundaryLayer, isDrainageLayer, isProtectedAreaLayer,
    toggleSatellite, toggleDem,
    toggleWetlandBoundary, toggleDrainage, toggleProtectedArea
  } = useUiStore();

  const { severity, observation_type: observationType, setSeverity, setObservationType } = useFilterStore();

  const activeSeverities = severity || [];
  const activeObservationTypes = observationType || [];

  const handleSeverityToggle = (level: SeverityLevel) => {
    const newSeverity = activeSeverities.includes(level) 
      ? activeSeverities.filter(s => s !== level) 
      : [...activeSeverities, level];
    setSeverity(newSeverity);
  };

  const handleObservationTypeToggle = (type: ObservationType) => {
    const newObsType = activeObservationTypes.includes(type)
      ? activeObservationTypes.filter(t => t !== type)
      : [...activeObservationTypes, type];
    setObservationType(newObsType);
  };

  const handleBasemapChange = (type: 'satellite' | 'terrain' | 'streets') => {
    if (type === 'satellite') {
      if (!isSatelliteLayer) toggleSatellite();
      if (isDemLayer) toggleDem();
    } else if (type === 'terrain') {
      if (!isDemLayer) toggleDem();
      if (isSatelliteLayer) toggleSatellite();
    } else {
      if (isSatelliteLayer) toggleSatellite();
      if (isDemLayer) toggleDem();
    }
  };



  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Top App Bar - Clean White Header */}
      <header className="flex-none flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#05734e] to-emerald-600 flex items-center justify-center shadow-md">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-800 tracking-tight">
                WetLabs
              </h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">Environmental Intelligence</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#05734e] hover:bg-[#046340] text-white px-4 py-2.5 rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200">
            <User className="w-4 h-4" />
            <span>Login</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: Quick Insights */}
        <aside className={`
          ${activeMobileTab === 'insights' ? 'flex' : 'hidden'} 
          lg:flex flex-col w-full lg:w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 overflow-y-auto relative z-10
        `}>
          <div className="p-5 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-10">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#05734e]" />
              Quick Insights
            </h2>
          </div>
          
          <div className="p-5 flex-1 flex flex-col gap-6">
            <div className="text-center space-y-4">
              <h3 className="text-sm font-medium text-slate-600">Severity Overview</h3>
              {/* Main Pie Chart Mock */}
              <div className="relative w-48 h-48 mx-auto rounded-full bg-slate-200 shadow-inner overflow-hidden border-4 border-white shadow-md">
                 <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-emerald-400" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 70%)' }}></div>
                 <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600" style={{ clipPath: 'polygon(50% 50%, 0 70%, 0 0, 50% 0)' }}></div>
                 <div className="absolute inset-0 bg-gradient-to-bl from-amber-400 to-amber-500" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0)' }}></div>
                 
                 <span className="absolute top-8 left-6 text-white font-bold text-sm">28%<br/><span className="text-[10px] font-normal">High</span></span>
                 <span className="absolute top-8 right-8 text-white font-bold text-sm">34%<br/><span className="text-[10px] font-normal">Moderate</span></span>
                 <span className="absolute bottom-8 right-16 text-white font-bold text-sm">38%<br/><span className="text-[10px] font-normal">Low</span></span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Sub Charts */}
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 rounded-full border-4 border-red-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-red-600">12%</span>
                <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90">
                  <circle cx="50%" cy="50%" r="32" className="stroke-red-500 stroke-4 fill-none" strokeDasharray="200" strokeDashoffset="176" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">High Alerts</h4>
                <p className="text-xs text-slate-500"><span className="font-bold text-red-600">12</span> Critical</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 rounded-full border-4 border-amber-500/20 flex items-center justify-center">
                <span className="text-sm font-bold text-amber-600">15%</span>
                <svg className="absolute inset-[-4px] w-[calc(100%+8px)] h-[calc(100%+8px)] -rotate-90">
                  <circle cx="50%" cy="50%" r="32" className="stroke-amber-500 stroke-4 fill-none" strokeDasharray="200" strokeDashoffset="150" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Moderate Alerts</h4>
                <p className="text-xs text-slate-500"><span className="font-bold text-amber-600">15</span> Moderate</p>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-6">
              <button className="w-full flex items-center justify-center gap-2 bg-[#05734e] hover:bg-[#046340] text-white px-4 py-3 rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200">
                <Download className="w-4 h-4" />
                Quick Export
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#05734e] border-2 border-[#05734e] px-3 py-2.5 rounded-lg font-medium text-xs shadow-sm hover:shadow transition-all duration-200">
                  <Maximize2 className="w-3.5 h-3.5" />
                  Set AOI
                </button>
                <button className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#05734e] border-2 border-[#05734e] px-3 py-2.5 rounded-lg font-medium text-xs shadow-sm hover:shadow transition-all duration-200">
                  <Layers className="w-3.5 h-3.5" />
                  Add Data
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Map Area */}
        <section className={`
          ${activeMobileTab === 'map' ? 'flex' : 'hidden'} 
          lg:flex flex-1 relative bg-blue-50 overflow-hidden
        `}>
          {/* We import the actual map, or a fallback. Assuming WetlandMap handles its own sizing. */}
          <div className="absolute inset-0">
             <WetlandMap />
          </div>

          {/* Floating Map Controls - Bottom Right */}
          <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-xl shadow-lg p-2 flex flex-col gap-2 z-10">
            <button className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#05734e] hover:bg-emerald-50 rounded-lg transition-all duration-200 group">
              <Locate className="w-5 h-5" />
            </button>
            <div className="h-px bg-slate-200 my-1"></div>
            <button className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#05734e] hover:bg-emerald-50 rounded-lg font-bold transition-all duration-200">
              <ZoomIn className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#05734e] hover:bg-emerald-50 rounded-lg font-bold transition-all duration-200">
              <ZoomOut className="w-5 h-5" />
            </button>
            <div className="h-px bg-slate-200 my-1"></div>
            <button className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-[#05734e] hover:bg-emerald-50 rounded-lg transition-all duration-200">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Right Sidebar: Data Panel */}
        <aside className={`
          ${activeMobileTab === 'data' ? 'flex' : 'hidden'} 
          lg:flex flex-col w-full lg:w-[340px] bg-gradient-to-b from-slate-50 to-white border-l border-slate-200 overflow-y-auto relative z-10
        `}>
          <div className="p-5 bg-gradient-to-r from-[#05734e] to-emerald-600 sticky top-0 z-10 shadow-md">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Data Panel
            </h2>
          </div>

          <div className="p-5 flex flex-col gap-6">
            {/* Search & Filter Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search & Filter</h3>
              <SearchBar />
            </div>

            <hr className="border-slate-200" />
            {/* Basemap Selection */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Basemap</h3>
              <div className="grid grid-cols-3 gap-3">
                <div onClick={() => handleBasemapChange('satellite')} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`h-20 w-full rounded-lg border-2 ${isSatelliteLayer ? 'border-[#05734e] ring-2 ring-[#05734e]/20' : 'border-slate-200 group-hover:border-[#05734e]/50'} overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}>
                     <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=100&h=80" className="object-cover w-full h-full" alt="Satellite" />
                  </div>
                  <span className={`text-xs font-medium ${isSatelliteLayer ? 'text-[#05734e]' : 'text-slate-600 group-hover:text-slate-800'}`}>Satellite</span>
                </div>
                <div onClick={() => handleBasemapChange('terrain')} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`h-20 w-full rounded-lg border-2 ${isDemLayer ? 'border-[#05734e] ring-2 ring-[#05734e]/20' : 'border-slate-200 group-hover:border-[#05734e]/50'} overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}>
                    <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=100&h=80" className="object-cover w-full h-full" alt="Terrain"/>
                  </div>
                  <span className={`text-xs font-medium ${isDemLayer ? 'text-[#05734e]' : 'text-slate-600 group-hover:text-slate-800'}`}>Terrain</span>
                </div>
                <div onClick={() => handleBasemapChange('streets')} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`h-20 w-full rounded-lg border-2 ${!isSatelliteLayer && !isDemLayer ? 'border-[#05734e] ring-2 ring-[#05734e]/20' : 'border-slate-200 group-hover:border-[#05734e]/50'} overflow-hidden shadow-sm hover:shadow-md transition-all duration-200`}>
                      <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=100&h=80&sat=-100" className="object-cover w-full h-full" alt="Streets"/>
                  </div>
                  <span className={`text-xs font-medium ${!isSatelliteLayer && !isDemLayer ? 'text-[#05734e]' : 'text-slate-600 group-hover:text-slate-800'}`}>Streets</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Data Layers with Toggle Switches */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Data Layers</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">Wetland Sites</span>
                  <div onClick={toggleWetlandBoundary} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isWetlandBoundaryLayer ? 'bg-[#05734e]' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${isWetlandBoundaryLayer ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">Water Bodies</span>
                  <div onClick={toggleDrainage} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isDrainageLayer ? 'bg-[#05734e]' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${isDrainageLayer ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">Risk Zones</span>
                  <div onClick={toggleProtectedArea} className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isProtectedAreaLayer ? 'bg-[#05734e]' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${isProtectedAreaLayer ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                </label>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Severity Legend - Horizontal */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Severity Legend</h3>
              <div className="flex items-center justify-between gap-2">
                <div onClick={() => handleSeverityToggle('LOW')} className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activeSeverities.includes('LOW') ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md ${!activeSeverities.includes('LOW') && activeSeverities.length > 0 ? 'opacity-30' : ''}`}></div>
                  <span className="text-xs font-medium text-slate-700">Low</span>
                </div>
                <div onClick={() => handleSeverityToggle('MEDIUM')} className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activeSeverities.includes('MEDIUM') ? 'bg-amber-50 ring-2 ring-amber-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-md ${!activeSeverities.includes('MEDIUM') && activeSeverities.length > 0 ? 'opacity-30' : ''}`}></div>
                  <span className="text-xs font-medium text-slate-700">Moderate</span>
                </div>
                <div onClick={() => handleSeverityToggle('HIGH')} className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all duration-200 ${activeSeverities.includes('HIGH') ? 'bg-red-50 ring-2 ring-red-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-md ${!activeSeverities.includes('HIGH') && activeSeverities.length > 0 ? 'opacity-30' : ''}`}></div>
                  <span className="text-xs font-medium text-slate-700">High</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />
            
            {/* Reported Cases with Custom Icons */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Reported Cases</h3>
              <div className="grid grid-cols-2 gap-3">
                <div onClick={() => handleObservationTypeToggle('POLLUTION')} className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all duration-200 ${activeObservationTypes.includes('POLLUTION') ? 'bg-slate-100 ring-2 ring-slate-400' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 ${!activeObservationTypes.includes('POLLUTION') && activeObservationTypes.length > 0 ? 'opacity-30' : ''}`}>
                    <Database className="w-4 h-4 text-white"/>
                  </div>
                  <span className="text-xs font-medium text-slate-700">Pollution</span>
                </div>
                <div onClick={() => handleObservationTypeToggle('VEGETATION_CHANGE')} className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all duration-200 ${activeObservationTypes.includes('VEGETATION_CHANGE') ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 ${!activeObservationTypes.includes('VEGETATION_CHANGE') && activeObservationTypes.length > 0 ? 'opacity-30' : ''}`}>
                    <Leaf className="w-4 h-4 text-white"/>
                  </div>
                  <span className="text-xs font-medium text-slate-700">Vegetation</span>
                </div>
                <div onClick={() => handleObservationTypeToggle('WATER_LEVEL')} className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all duration-200 ${activeObservationTypes.includes('WATER_LEVEL') ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 ${!activeObservationTypes.includes('WATER_LEVEL') && activeObservationTypes.length > 0 ? 'opacity-30' : ''}`}>
                    <Waves className="w-4 h-4 text-white"/>
                  </div>
                  <span className="text-xs font-medium text-slate-700">Water Level</span>
                </div>
                <div onClick={() => handleObservationTypeToggle('ENCROACHMENT')} className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all duration-200 ${activeObservationTypes.includes('ENCROACHMENT') ? 'bg-amber-50 ring-2 ring-amber-500' : 'bg-slate-50 hover:bg-slate-100'}`}>
                  <div className={`p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 ${!activeObservationTypes.includes('ENCROACHMENT') && activeObservationTypes.length > 0 ? 'opacity-30' : ''}`}>
                    <Construction className="w-4 h-4 text-white"/>
                  </div>
                  <span className="text-xs font-medium text-slate-700">Encroachment</span>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200">
              <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-[#05734e] border-2 border-[#05734e] px-4 py-3 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200">
                <Maximize2 className="w-4 h-4" />
                Set Area of Interest
              </button>
            </div>
          </div>
        </aside>

      </main>

      {/* Mobile Bottom Navigation - Visible only on small screens */}
      <nav className="lg:hidden flex-none flex items-center justify-around bg-white border-t border-slate-200 px-2 py-3 safe-area-pb z-50">
        <button 
          onClick={() => setActiveMobileTab('insights')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[72px] ${activeMobileTab === 'insights' ? 'text-teal-700 bg-teal-50' : 'text-slate-500'}`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Insights</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('map')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[72px] ${activeMobileTab === 'map' ? 'text-teal-700 bg-teal-50' : 'text-slate-500'}`}
        >
          <MapIcon className="w-5 h-5" />
          <span className="text-[10px] font-medium">Map View</span>
        </button>
        <button 
          onClick={() => setActiveMobileTab('data')}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[72px] ${activeMobileTab === 'data' ? 'text-teal-700 bg-teal-50' : 'text-slate-500'}`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] font-medium">Data Panel</span>
        </button>
      </nav>

    </div>
  );
}
