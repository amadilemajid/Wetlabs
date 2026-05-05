import { apiClient } from './client';
import type { Wetland, WetlandSummary } from '@wetlabs/shared-types';

export interface WetlandGeoJson {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: { type: 'Polygon'; coordinates: number[][][] };
    properties: Omit<Wetland, 'boundary_geom'|'centroid_geom'>;
  }>;
}

export type { WetlandSummary };

export async function fetchWetlands(): Promise<WetlandGeoJson> {
  const res = await apiClient.get<WetlandGeoJson>('/wetlands');
  return res.data;
}

export async function fetchWetlandSummary(code: string, from?: string, to?: string): Promise<WetlandSummary> {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to)   params.set('to',   to);
  const res = await apiClient.get<{ data: WetlandSummary }>(`/wetlands/${code}/summary?${params.toString()}`);
  return res.data.data;
}
