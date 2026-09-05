import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useToastStore } from '@/store/toastStore';

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />,
  error: <XCircle className="h-5 w-5 text-danger" aria-hidden="true" />,
  info: <Info className="h-5 w-5 text-info" aria-hidden="true" />,
};

export function ToastContainer() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0"
      role="region"
      aria-label="Notificações"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            className="pointer-events-auto flex items-start gap-3 rounded-sm border border-ink-200 bg-cream-50 p-4 shadow-elevated"
          >
            {ICONS[toast.type]}
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink-900">{toast.message}</p>
              {toast.description && <p className="mt-0.5 text-xs text-ink-500">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="Fechar notificação"
              className="text-ink-400 hover:text-ink-700"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
