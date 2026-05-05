import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format ISO date to readable string */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-KE', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
    hour:  '2-digit',
    minute:'2-digit',
  }).format(new Date(iso));
}

/** Map severity level to Tailwind badge class */
export function severityClass(severity: string): string {
  const map: Record<string, string> = {
    HIGH:    'badge badge-high',
    MEDIUM:  'badge badge-medium',
    LOW:     'badge badge-low',
  };
  return map[severity] ?? 'badge badge-success';
}

/** Truncate text to n characters */
export function truncate(text: string, n = 60): string {
  return text.length > n ? text.slice(0, n) + '…' : text;
}
