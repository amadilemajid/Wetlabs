import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Upload, X, AlertCircle, CheckCircle, Layers } from 'lucide-react';
import { useUiStore } from '@stores/ui.store';

export function AddData() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedName, setUploadedName] = useState('');
  const [featureCount, setFeatureCount] = useState(0);
  const [err, setErr] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addOverlayLayer    = useUiStore((s) => s.addOverlayLayer);
  const overlayLayers      = useUiStore((s) => s.overlayLayers);
  const removeOverlayLayer = useUiStore((s) => s.removeOverlayLayer);

  const reset = () => {
    setErr(''); setUploadedName(''); setFeatureCount(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.geojson') && !file.name.endsWith('.json')) {
      setErr('Only GeoJSON (.geojson / .json) files are supported.'); return;
    }
    setIsLoading(true); setErr('');
    try {
      const geojson = JSON.parse(await file.text());
      if (geojson.type !== 'FeatureCollection' && geojson.type !== 'Feature') {
        setErr('Invalid GeoJSON: root must be FeatureCollection or Feature.'); return;
      }
      const count = geojson.type === 'FeatureCollection' ? (geojson.features?.length ?? 0) : 1;
      const name  = file.name.replace(/\.(geojson|json)$/i, '');
      addOverlayLayer(name, geojson);
      setUploadedName(name); setFeatureCount(count);
    } catch {
      setErr('Failed to parse file. Ensure it is valid GeoJSON.');
    } finally {
      setIsLoading(false);
    }
  };

  const close = () => { setIsOpen(false); reset(); };

  const modal = (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div style={{ background: '#FFFFFF', border: '1px solid #E1E8ED', borderRadius: '0.5rem', width: '100%', maxWidth: '380px', fontFamily: 'system-ui' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(20,184,166,0.1)' }}>
          <span style={{ color: '#1E6F5C', fontSize: '0.875rem', fontWeight: 700 }}>Add Spatial Data</span>
          <button type="button" onClick={close} style={{ color: '#6B8A99', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

          {/* Drop zone */}
          <label style={{ display: 'block', border: '2px dashed #B8CFDF', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
            <input ref={inputRef} type="file" accept=".geojson,.json" onChange={handleFile} disabled={isLoading}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
            {isLoading ? (
              <p style={{ color: '#1E6F5C', fontSize: '0.75rem' }}>Parsing file…</p>
            ) : uploadedName ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle size={24} color="#27AE60" />
                <p style={{ color: '#27AE60', fontSize: '0.75rem', fontWeight: 700, margin: 0 }}>{uploadedName}</p>
                <p style={{ color: '#6B8A99', fontSize: '0.7rem', margin: 0 }}>{featureCount} feature{featureCount !== 1 ? 's' : ''} overlaid on map</p>
              </div>
            ) : (
              <>
                <Upload size={28} color="#6B8A99" style={{ margin: '0 auto 0.5rem' }} />
                <p style={{ color: '#2C3E50', fontSize: '0.75rem', margin: '0 0 0.25rem' }}>Drop GeoJSON here or click to browse</p>
                <p style={{ color: '#6B8A99', fontSize: '0.7rem', margin: 0 }}>.geojson · .json</p>
              </>
            )}
          </label>

          {/* Error */}
          {err && (
            <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.5rem' }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ color: '#f87171', fontSize: '0.75rem', margin: 0 }}>{err}</p>
            </div>
          )}

          {/* Active overlays */}
          {overlayLayers.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <p style={{ color: '#6B8A99', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Active overlays</p>
              {overlayLayers.map(l => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#E8F5F1', border: '1px solid #B8CFDF', borderRadius: '0.375rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={14} color="#1E6F5C" />
                    <span style={{ color: '#2C3E50', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{l.name}</span>
                  </div>
                  <button type="button" onClick={() => removeOverlayLayer(l.id)}
                    style={{ color: '#6B8A99', background: 'none', border: 'none', cursor: 'pointer', padding: '0.125rem' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Info */}
          <div style={{ padding: '0.75rem', background: '#E8F5F1', border: '1px solid #B8CFDF', borderRadius: '0.5rem' }}>
            <p style={{ color: '#6B8A99', fontSize: '0.7rem', margin: 0, lineHeight: 1.5 }}>
              Upload GeoJSON exported from QGIS, ArcGIS, or any GIS tool. The layer renders on the map as an amber overlay with clickable feature popups. Use this to compare survey boundaries, AOI polygons, or external datasets against live wetland reports.
            </p>
          </div>
        </div>

        <div style={{ padding: '0 1rem 1rem' }}>
          <button type="button" onClick={close}
            style={{ width: '100%', padding: '0.5rem', color: '#6B8A99', background: 'none', border: '1px solid #E1E8ED', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.75rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => { reset(); setIsOpen(true); }}
        className="flex-1 py-3 rounded-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity"
        style={{ background: '#1E6F5C' }}
      >
        Add Data
      </button>

      {isOpen && createPortal(modal, document.body)}
    </>
  );
}
