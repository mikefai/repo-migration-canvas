import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export function ConnectionToast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900/95 border border-amber-500/50 shadow-2xl backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 text-slate-100 ring-1 ring-amber-500/20 select-none"
        >
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <span>Connection Restricted</span>
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {toast.reason}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
