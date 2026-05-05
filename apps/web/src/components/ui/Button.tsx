import { cn } from '@utils/cn';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?:    'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-mono font-medium',
        'transition-all duration-150 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500',
        'disabled:opacity-40 disabled:cursor-not-allowed select-none',
        size === 'sm'  && 'text-xs px-3 py-1.5',
        size === 'md'  && 'text-sm px-4 py-2',
        size === 'lg'  && 'text-base px-6 py-3',
        variant === 'primary' && 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-glow',
        variant === 'ghost'   && 'hover:bg-teal-500/10 text-slate-300 hover:text-teal-300',
        variant === 'danger'  && 'bg-crimson-500/15 hover:bg-crimson-500/25 text-crimson-400 border border-crimson-500/30',
        variant === 'outline' && 'border border-teal-500/30 hover:border-teal-500 text-teal-300 hover:bg-teal-500/10',
        className,
      )}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
