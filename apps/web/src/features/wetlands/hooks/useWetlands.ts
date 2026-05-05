import { useQuery } from '@tanstack/react-query';
import { fetchWetlands, fetchWetlandSummary } from '@api/wetlands.api';
import { useFilterStore } from '@stores/filter.store';

export function useWetlands() {
  return useQuery({
    queryKey: ['wetlands'],
    queryFn:  fetchWetlands,
    staleTime: 5 * 60_000, // 5 min — boundaries change rarely
  });
}

export function useWetlandSummary(code: string | null) {
  const { from, to } = useFilterStore();
  return useQuery({
    queryKey: ['wetland-summary', code, from, to],
    queryFn:  () => fetchWetlandSummary(code!, from, to),
    enabled:  !!code,
    staleTime: 2 * 60_000,
  });
}
