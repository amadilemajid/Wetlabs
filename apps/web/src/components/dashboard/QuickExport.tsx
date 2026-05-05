import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, FileText, Table2, Printer, X } from 'lucide-react';
import { useFilterStore } from '@stores/filter.store';
import { fetchReports } from '@api/reports.api';

export function QuickExport() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('');

  const triggerDownload = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFilters = () => useFilterStore.getState();

  const handleCSV = async () => {
    setStatus('Fetching reports…');
    try {
      const filters = getFilters();
      const data = await fetchReports({
        wetland_code: filters.wetland_code,
        from: filters.from,
        to: filters.to,
        severity: filters.severity,
        observation_type: filters.observation_type,
        channel: filters.channel,
        page: 1,
        per_page: 500,
      });
      if (!data?.features?.length) { setStatus('No reports to export.'); return; }
      const headers = ['report_id','wetland_code','observation_type','severity','channel','is_flagged','created_at','longitude','latitude'];
      const rows = data.features.map(f => {
        const p = f.properties;
        const [lon, lat] = f.geometry?.coordinates ?? ['',''];
        return [p.report_id, p.wetland_code, p.observation_type, p.severity, p.channel, p.is_flagged, p.created_at, lon, lat].join(',');
      });
      const csv = [headers.join(','), ...rows].join('\n');
      const date = new Date().toISOString().split('T')[0];
      triggerDownload(csv, `wetlabs-reports-${date}.csv`, 'text/csv;charset=utf-8;');
      setStatus(`✓ Exported ${data.features.length} reports`);
      setTimeout(() => { setIsOpen(false); setStatus(''); }, 1500);
    } catch (e) {
      setStatus('Export failed. Check console.');
      console.error(e);
    }
  };

  const handleGeoJSON = async () => {
    setStatus('Fetching reports…');
    try {
      const filters = getFilters();
      const data = await fetchReports({
        wetland_code: filters.wetland_code,
        from: filters.from,
        to: filters.to,
        severity: filters.severity,
        observation_type: filters.observation_type,
        channel: filters.channel,
        page: 1,
        per_page: 500,
      });
      if (!data?.features?.length) { setStatus('No reports to export.'); return; }
      const date = new Date().toISOString().split('T')[0];
      triggerDownload(JSON.stringify(data, null, 2), `wetlabs-reports-${date}.geojson`, 'application/json');
      setStatus(`✓ Exported ${data.features.length} features`);
      setTimeout(() => { setIsOpen(false); setStatus(''); }, 1500);
    } catch (e) {
      setStatus('Export failed. Check console.');
      console.error(e);
    }
  };

  const handlePrint = () => {
    setIsOpen(false);
    setTimeout(() => window.print(), 300);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => { setStatus(''); setIsOpen(true); }}
        className="w-full py-3 rounded-lg font-bold text-white shadow-md hover:opacity-90 transition-opacity"
        style={{ background: '#1E6F5C' }}
      >
        Quick Export
      </button>

      {isOpen && createPortal(
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999, padding: '1rem' }}
          onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
        >
          <div style={{ background: '#FFFFFF', border: '1px solid #E1E8ED', borderRadius: '0.5rem', width: '100%', maxWidth: '360px', fontFamily: 'system-ui' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid rgba(20,184,166,0.1)' }}>
              <span style={{ color: '#1E6F5C', fontSize: '0.875rem', fontWeight: 700 }}>Export Reports</span>
              <button type="button" onClick={() => setIsOpen(false)} style={{ color: '#6B8A99', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                <X size={16} />
              </button>
            </div>

            {status && (
              <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', color: status.startsWith('✓') ? '#27AE60' : '#F39C12', borderBottom: '1px solid #E1E8ED' }}>
                {status}
              </div>
            )}

            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button type="button" onClick={handleCSV}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #E1E8ED', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <Table2 size={20} color="#27AE60" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#2C3E50', fontSize: '0.875rem', margin: 0, fontWeight: 600 }}>Export as CSV</p>
                  <p style={{ color: '#6B8A99', fontSize: '0.75rem', margin: 0 }}>Spreadsheet-compatible · Excel, Google Sheets</p>
                </div>
              </button>

              <button type="button" onClick={handleGeoJSON}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #E1E8ED', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <FileText size={20} color="#3B82F6" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#2C3E50', fontSize: '0.875rem', margin: 0, fontWeight: 600 }}>Export as GeoJSON</p>
                  <p style={{ color: '#6B8A99', fontSize: '0.75rem', margin: 0 }}>Full geometry · QGIS, ArcGIS, Mapbox</p>
                </div>
              </button>

              <button type="button" onClick={handlePrint}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', border: '1px solid #E1E8ED', borderRadius: '0.5rem', background: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                <Printer size={20} color="#F39C12" style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ color: '#2C3E50', fontSize: '0.875rem', margin: 0, fontWeight: 600 }}>Print / Save as PDF</p>
                  <p style={{ color: '#6B8A99', fontSize: '0.75rem', margin: 0 }}>Browser print dialog → Save as PDF</p>
                </div>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
