import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose, duration = 6000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="fixed top-5 right-5 z-[100] max-w-sm w-full transition-all duration-300 animate-in slide-in-from-top-5 fade-in">
      <div
        className={`flex items-start p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
          isSuccess
            ? 'bg-emerald-900/90 border-emerald-700 text-white shadow-emerald-900/20'
            : isError
            ? 'bg-rose-900/90 border-rose-700 text-white shadow-rose-900/20'
            : 'bg-slate-900/90 border-slate-700 text-white shadow-slate-900/20'
        }`}
      >
        <div className="shrink-0 mr-3 mt-0.5">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
          {!isSuccess && !isError && <Info className="w-5 h-5 text-sky-400" />}
        </div>

        <div className="flex-1 pr-2">
          <h4 className="text-xs font-bold uppercase tracking-wider opacity-80 mb-0.5">
            {isSuccess ? 'Success' : isError ? 'Error' : 'Notification'}
          </h4>
          <p className="text-sm font-semibold leading-snug">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="shrink-0 p-1 text-white/60 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
