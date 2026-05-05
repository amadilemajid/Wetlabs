import { apiClient } from './client';
import { saveAs } from 'file-saver';
import type { ReportFilters } from '@wetlabs/shared-types';

function buildParams(filters: Omit<ReportFilters, 'page'|'per_page'>): string {
  const p = new URLSearchParams();
  if (filters.wetland_code)           p.set('wetland_code', filters.wetland_code);
  if (filters.from)                   p.set('from', filters.from);
  if (filters.to)                     p.set('to',   filters.to);
  if (filters.severity?.length)       filters.severity.forEach(s => p.append('severity', s));
  if (filters.observation_type?.length) filters.observation_type.forEach(t => p.append('observation_type', t));
  return p.toString();
}

// FR-17, US-10: trigger browser file download without page navigation
export async function exportCsv(filters: Omit<ReportFilters, 'page'|'per_page'>): Promise<void> {
  const res = await apiClient.get(`/export/reports.csv?${buildParams(filters)}`, {
    responseType: 'blob',
  });
  saveAs(res.data as Blob, `wetlabs_reports_${Date.now()}.csv`);
}

export async function exportGeoJson(filters: Omit<ReportFilters, 'page'|'per_page'>): Promise<void> {
  const res = await apiClient.get(`/export/reports.geojson?${buildParams(filters)}`, {
    responseType: 'blob',
  });
  saveAs(res.data as Blob, `wetlabs_reports_${Date.now()}.geojson`);
}
