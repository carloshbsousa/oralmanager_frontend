'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  onDismiss?: () => void;
}

export function Toast({ id, title, description, variant = 'default', onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = React.useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full max-w-md rounded-lg border p-4 shadow-lg transition-all',
        'animate-in slide-in-from-right-full',
        isExiting && 'animate-out slide-out-to-right-full',
        {
          'bg-background border-border': variant === 'default',
          'bg-destructive text-destructive-foreground border-destructive': variant === 'destructive',
          'bg-green-50 text-green-900 border-green-200 dark:bg-green-900 dark:text-green-50': variant === 'success',
        }
      )}
    >
      <div className="flex-1">
        {title && (
          <div className="text-sm font-semibold mb-1">
            {title}
          </div>
        )}
        {description && (
          <div className="text-sm opacity-90">
            {description}
          </div>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className="ml-4 rounded-md p-1 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onDismiss={() => dismiss(toast.id)}
        />
      ))}
    </div>
  );
}

// Import the hook
import { useToast } from '@/hooks/use-toast';

const dismiss = (toastId: string) => {
  const event = new CustomEvent('dismiss-toast', { detail: { toastId } });
  window.dispatchEvent(event);
};