import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ReportFilters, SeverityLevel, ObservationType } from '@wetlabs/shared-types';

interface FilterState extends ReportFilters {
  // Actions
  setWetlandCode:     (code: string | undefined) => void;
  setDateRange:       (from: string, to: string) => void;
  setSeverity:        (levels: SeverityLevel[]) => void;
  setObservationType: (types: ObservationType[]) => void;
  setChannel:         (channels: import('@wetlabs/shared-types').ReportChannel[]) => void;
  resetFilters:       () => void;
  getActiveFilters:   () => ReportFilters;
}

const DEFAULT_FROM = new Date(Date.now() - 365 * 86_400_000).toISOString().split('T')[0]!;
const DEFAULT_TO   = new Date(Date.now() +   1 * 86_400_000).toISOString().split('T')[0]!;

const defaults: ReportFilters = {
  from:     DEFAULT_FROM,
  to:       DEFAULT_TO,
  page:     1,
  per_page: 500,
};

export const useFilterStore = create<FilterState>()(
  subscribeWithSelector((set, get) => ({
    ...defaults,
    setWetlandCode:     (wetland_code) => set({ wetland_code, page: 1 }),
    setDateRange:       (from, to)     => set({ from, to, page: 1 }),
    setSeverity:        (severity)     => set({ severity, page: 1 }),
    setObservationType: (observation_type) => set({ observation_type, page: 1 }),
    setChannel:         (channel)          => set({ channel, page: 1 }),
    resetFilters:       () => set({ ...defaults, severity: undefined, observation_type: undefined, channel: undefined, wetland_code: undefined }),
    getActiveFilters:   () => get(),
  })),
);
