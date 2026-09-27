import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icon =
            toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            ) : toast.type === 'error' ? (
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-sky-500 shrink-0" />
            );

          const borderBg =
            toast.type === 'success'
              ? 'border-emerald-200 bg-emerald-50/95 text-emerald-950'
              : toast.type === 'error'
              ? 'border-rose-200 bg-rose-50/95 text-rose-950'
              : toast.type === 'warning'
              ? 'border-amber-200 bg-amber-50/95 text-amber-950'
              : 'border-sky-200 bg-sky-50/95 text-sky-950';

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md ${borderBg}`}
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 text-right min-w-0">
                <h4 className="font-bold text-sm leading-snug">{toast.title}</h4>
                {toast.message && (
                  <p className="text-xs opacity-90 mt-0.5 leading-relaxed font-medium">
                    {toast.message}
                  </p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
