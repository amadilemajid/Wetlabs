import { createContext, useContext } from 'react';

export type ToastVariant = 'success' | 'error' | 'warning';

export interface ToastMessage {
  id:      string;
  message: string;
  variant: ToastVariant;
}

export interface ToastContextValue {
  success: (msg: string) => void;
  error:   (msg: string) => void;
  warning: (msg: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
