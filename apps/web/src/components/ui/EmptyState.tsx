import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon:     LucideIcon;
  title:    string;
  message:  string;
  className?: string;
}
export function EmptyState({ icon: Icon, title, message, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      <div className="w-14 h-14 rounded-full bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
        <Icon className="w-6 h-6 text-teal-500 opacity-60" />
      </div>
      <p className="font-mono text-sm text-slate-300">{title}</p>
      <p className="text-xs text-slate-500 max-w-xs">{message}</p>
    </div>
  );
}
