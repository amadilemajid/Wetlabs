import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Pen, X } from 'lucide-react';
import { useToast } from '@hooks/useToast';

type AOIMode = 'point' | 'polygon' | null;

export function SetAOI() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AOIMode>(null);
  const { success } = useToast();

  const handlePointMode = () => {
    setMode('point');
    success('Click on the map to add a point marker');
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('aoi:mode', { detail: { mode: 'point' } }));
  };

  const handlePolygonMode = () => {
    setMode('polygon');
    success('Click on the map to draw a polygon. Double-click to finish.');
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('aoi:mode', { detail: { mode: 'polygon' } }));
  };

  const handleClear = () => {
    setMode(null);
    success('AOI cleared');
    window.dispatchEvent(new CustomEvent('aoi:clear'));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex-1 py-3 rounded-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity"
        style={{ background: '#1E6F5C' }}
      >
        Set AOI
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Set Area of Interest</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              <button
                onClick={handlePointMode}
                className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors"
              >
                <MapPin className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">Add Point Marker</p>
                  <p className="text-xs text-slate-500">Click on map to place a marker</p>
                </div>
              </button>

              <button
                onClick={handlePolygonMode}
                className="w-full flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-teal-50 hover:border-teal-300 transition-colors"
              >
                <Pen className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">Draw Polygon</p>
                  <p className="text-xs text-slate-500">Click multiple points to draw area</p>
                </div>
              </button>

              {mode && (
                <button
                  onClick={handleClear}
                  className="w-full px-4 py-2 text-sm font-medium text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                >
                  Clear AOI
                </button>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
