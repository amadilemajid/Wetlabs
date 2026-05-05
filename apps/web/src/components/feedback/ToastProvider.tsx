import * as Toast from '@radix-ui/react-toast';
import { useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';
import { cn } from '@utils/cn';
import { ToastContext, type ToastMessage, type ToastVariant, type ToastContextValue } from '@hooks/useToast';

const ICONS: Record<ToastVariant, typeof CheckCircle2> = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
};

const STYLES: Record<ToastVariant, string> = {
  success: 'border-signal-500/30 bg-signal-500/10  text-signal-400',
  error:   'border-crimson-500/30 bg-crimson-500/10 text-crimson-400',
  warning: 'border-amber-500/30  bg-amber-500/10   text-amber-400',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const push = useCallback((message: string, variant: ToastVariant) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
  }, []);

  const ctx: ToastContextValue = {
    success: (msg) => push(msg, 'success'),
    error:   (msg) => push(msg, 'error'),
    warning: (msg) => push(msg, 'warning'),
  };

  return (
    <ToastContext.Provider value={ctx}>
      <Toast.Provider swipeDirection="right" duration={5000}>
        {children}

        {toasts.map((toast) => {
          const Icon = ICONS[toast.variant];
          return (
            <Toast.Root
              key={toast.id}
              open={true}
              className={cn(
                'panel flex items-start gap-3 p-4 pr-8 w-80 animate-slide-in-right',
                'relative border',
                STYLES[toast.variant],
              )}
            >
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden />
              <Toast.Description className="text-xs font-serif text-slate-300 leading-relaxed">
                {toast.message}
              </Toast.Description>
              <Toast.Close
                aria-label="Dismiss notification"
                className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </Toast.Close>
            </Toast.Root>
          );
        })}

        <Toast.Viewport
          className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 outline-none"
          aria-label="Notifications"
        />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}


