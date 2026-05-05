import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchReports, fetchReport, flagReport } from '@api/reports.api';
import { useFilterStore } from '@stores/filter.store';
import { useAuthStore }   from '@stores/auth.store';
import { useToast }       from '@hooks/useToast';

export const REPORTS_KEY = 'reports';

export function useReports() {
  const wetland_code     = useFilterStore((s) => s.wetland_code);
  const from             = useFilterStore((s) => s.from);
  const to               = useFilterStore((s) => s.to);
  const severity         = useFilterStore((s) => s.severity);
  const observation_type = useFilterStore((s) => s.observation_type);
  const channel          = useFilterStore((s) => s.channel);
  const page             = useFilterStore((s) => s.page);
  const per_page         = useFilterStore((s) => s.per_page);
  const isAuthed         = useAuthStore((s) => s.isAuthed);

  const filters = { wetland_code, from, to, severity, observation_type, channel, page, per_page };
  return useQuery({
    queryKey: [REPORTS_KEY, filters],
    queryFn:  () => fetchReports(filters),
    enabled:  true,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useReport(id: string | null) {
  return useQuery({
    queryKey: [REPORTS_KEY, id],
    queryFn:  () => fetchReport(id!),
    enabled:  !!id && true,      // always fetch if ID exists
    staleTime: 60_000,
  });
}

export function useFlagReport() {
  const qc    = useQueryClient();
  const toast = useToast();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => flagReport(id, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success('Report flagged for review');
    },
    onError: () => { toast.error('Failed to flag report. Please try again.'); },
  });
}
