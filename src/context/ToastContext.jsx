/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

const DISMISS_MS = 4500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, variant = "success") => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant }]);
      window.setTimeout(() => removeToast(id), DISMISS_MS);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 z-[200] flex flex-col items-center gap-2 p-4 sm:bottom-4 sm:left-auto sm:right-4 sm:top-auto sm:items-end sm:p-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex max-w-md min-w-[280px] animate-fade-in-up items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm motion-reduce:animate-none sm:min-w-[320px] ${
              t.variant === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-900 ring-1 ring-emerald-100"
                : "border-red-200 bg-red-50/95 text-red-900 ring-1 ring-red-100"
            }`}
          >
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                t.variant === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
              }`}
              aria-hidden
            >
              {t.variant === "success" ? "✓" : "!"}
            </span>
            <p className="flex-1 pt-0.5 text-sm font-medium leading-snug">{t.message}</p>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold transition hover:bg-black/5 ${
                t.variant === "success" ? "text-emerald-800" : "text-red-800"
              }`}
            >
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
