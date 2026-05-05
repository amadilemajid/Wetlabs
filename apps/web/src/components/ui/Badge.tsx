import { cn } from '@utils/cn';
import { SEVERITY_CONFIG, OBS_TYPE_LABELS } from '@utils/severity';
import type { SeverityLevel, ObservationType } from '@wetlabs/shared-types';

interface SeverityBadgeProps { severity: SeverityLevel; className?: string; }
export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const cfg = SEVERITY_CONFIG[severity];
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono border',
      cfg.tailwind, cfg.bg, cfg.border, className,
    )}>
      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: cfg.colour }} />
      {cfg.label}
    </span>
  );
}

interface ObsTypeBadgeProps { type: ObservationType; className?: string; }
export function ObsTypeBadge({ type, className }: ObsTypeBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-mono',
      'text-teal-300 bg-teal-500/10 border border-teal-500/20', className,
    )}>
      {OBS_TYPE_LABELS[type] ?? type}
    </span>
  );
}
