import { X, Flag, MapPin, Clock, Radio, CheckCircle, ShieldAlert } from 'lucide-react';
import { useUiStore } from '@stores/ui.store';
import { useReport, REPORTS_KEY }  from '@features/reports/hooks/useReports';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { apiClient } from '@api/client';
import { useToast } from '@hooks/useToast';
import { SeverityBadge, ObsTypeBadge } from '@components/ui/Badge';
import { Button }  from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { fmtDateTime, fmtRelative } from '@utils/date';
import { FlagReportDialog } from '@features/reports/components/FlagReportDialog';
import { useState } from 'react';
import { cn } from '@utils/cn';

export function ReportPopup() {
  const { selectedReportId, isPanelOpen, selectReport } = useUiStore();
  const { data: report, isLoading } = useReport(selectedReportId);
  const [flagOpen, setFlagOpen] = useState(false);
  const qc    = useQueryClient();
  const toast = useToast();

  const resolveMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/reports/${id}/resolve`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success('Report resolved and verified');
    }
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/reports/${id}/duplicate`),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: [REPORTS_KEY] });
      toast.success('Report duplication status updated');
    }
  });

  if (!isPanelOpen || !selectedReportId) return null;

  return (
    <>
      <div className="absolute top-4 right-4 z-[1000] w-80 panel animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-teal-500/10">
          <span className="font-mono text-xs text-teal-400 tracking-widest">REPORT DETAIL</span>
          <button
            onClick={() => selectReport(null)}
            aria-label="Close report panel"
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Spinner />
          </div>
        )}

        {report && !isLoading && (
          <div className="p-4 space-y-3 animate-fade-in">
            {/* ID */}
            <p className="font-mono text-[10px] text-slate-500 tracking-widest truncate">
              ID: {report.report_id}
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <SeverityBadge severity={report.severity} />
              <ObsTypeBadge  type={report.observation_type} />
              {report.is_duplicate && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  DUPLICATE
                </span>
              )}
              {report.is_resolved && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-signal-500/10 text-signal-400 border border-signal-500/20">
                  RESOLVED
                </span>
              )}
            </div>

            {/* Metadata rows */}
            <div className="space-y-2 pt-1">
              {[
                { icon: MapPin,  label: 'WETLAND', value: report.wetland_code },
                { icon: Radio,   label: 'CHANNEL', value: report.channel },
                { icon: Clock,   label: 'RECEIVED', value: fmtDateTime(report.created_at) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                  <span className="data-label">{label}</span>
                  <span className="font-mono text-xs text-slate-300 ml-auto">{value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            {report.description && (
              <p className="text-xs text-slate-400 leading-relaxed border-t border-teal-500/10 pt-3 font-serif">
                {report.description}
              </p>
            )}

            {/* Relative time */}
            <p className="text-[10px] text-slate-500 font-mono">
              {fmtRelative(report.created_at)}
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-teal-500/10">
              <div className="flex gap-2">
                {!report.is_resolved && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    loading={resolveMutation.isPending}
                    onClick={() => resolveMutation.mutate(report.report_id)}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Resolve
                  </Button>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  className={cn("flex-1", report.is_resolved && "flex-initial w-full")}
                  onClick={() => setFlagOpen(true)}
                >
                  <Flag className="w-3.5 h-3.5" />
                  Flag
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-slate-400 hover:text-amber-400"
                loading={duplicateMutation.isPending}
                onClick={() => duplicateMutation.mutate(report.report_id)}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                {report.is_duplicate ? 'Mark as Unique' : 'Mark as Duplicate'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <FlagReportDialog
        reportId={selectedReportId}
        open={flagOpen}
        onClose={() => setFlagOpen(false)}
      />
    </>
  );
}
