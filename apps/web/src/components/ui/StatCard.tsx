import { cn } from '@utils/cn';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label:     string;
  value:     string | number;
  icon?:     LucideIcon;
  trend?:    'up' | 'down' | 'neutral';
  className?: string;
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <div className={cn(
      'panel p-4 flex flex-col gap-2 animate-slide-in-up',
      className,
    )}>
      <div className="flex items-center justify-between">
        <span className="data-label">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-teal-500 opacity-60" />}
      </div>
      <span className="data-value">{value}</span>
    </div>
  );
}
