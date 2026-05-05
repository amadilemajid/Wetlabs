import { apiClient } from './client';
import type { ReportFilters, WetlandReport } from '@wetlabs/shared-types';

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
  meta: { page: number; per_page: number; total: number };
}
export interface GeoJsonFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] } | null;
  properties: Pick<WetlandReport, 'report_id'|'wetland_code'|'observation_type'|'severity'|'channel'|'is_duplicate'|'is_flagged'|'created_at'>;
}

export async function fetchReports(filters: ReportFilters): Promise<GeoJsonFeatureCollection> {
  const params = new URLSearchParams();
  if (filters.wetland_code) params.set('wetland_code', filters.wetland_code);
  if (filters.from)         params.set('from',         filters.from);
  if (filters.to)           params.set('to',           filters.to);
  if (filters.severity?.length)         filters.severity.forEach(s => params.append('severity', s));
  if (filters.observation_type?.length) filters.observation_type.forEach(t => params.append('observation_type', t));
  if (filters.channel?.length)          filters.channel.forEach(c => params.append('channel', c));
  if (filters.page)         params.set('page',     String(filters.page));
  if (filters.per_page)     params.set('per_page', String(filters.per_page));
  const res = await apiClient.get<GeoJsonFeatureCollection>(`/reports/public/map?${params.toString()}`);
  return res.data;
}

export async function fetchReport(id: string): Promise<WetlandReport> {
  const res = await apiClient.get<{ data: WetlandReport }>(`/reports/${id}`);
  return res.data.data;
}

export async function flagReport(id: string, flag_reason: string): Promise<void> {
  await apiClient.patch(`/reports/${id}/flag`, { flag_reason });
}
