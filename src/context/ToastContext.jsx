import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, Bell, X } from 'lucide-react';
import { playReminderChime } from '../utils/soundEffects';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'info', duration = 5000, sound = false }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    
    if (sound) {
      playReminderChime();
    }

    setToasts((prev) => [
      ...prev,
      { id, title, message, type, duration }
    ]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 flex flex-col gap-2.5 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto transform transition-all duration-300 ease-out translate-y-0 opacity-100 flex items-start gap-3 p-4 rounded-2xl neu-card border-l-4 ${
              toast.type === 'error'
                ? 'border-l-rose-500 bg-rose-50 dark:bg-[#191417]'
                : toast.type === 'success'
                ? 'border-l-emerald-500 bg-emerald-50 dark:bg-[#121915]'
                : toast.type === 'reminder'
                ? 'border-l-amber-500 bg-amber-50 dark:bg-[#1A1813]'
                : 'border-l-sky-500 bg-sky-50 dark:bg-[#12171E]'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-500" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
              {toast.type === 'reminder' && <Bell className="w-5 h-5 text-amber-500 animate-bounce" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-500" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-0.5">
                  {toast.title}
                </h4>
              )}
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-snug">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="Tutup pesan"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
};
