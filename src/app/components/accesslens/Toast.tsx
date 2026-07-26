import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastListeners: ((toast: ToastData) => void)[] = [];

export function showToast(message: string, type: ToastData["type"] = "info") {
  const toast: ToastData = { id: Date.now().toString(), message, type };
  toastListeners.forEach((fn) => fn(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (toast: ToastData) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== listener);
    };
  }, []);

  const icons = {
    success: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#10b981" strokeWidth="1.5"/><path d="M4.5 7l2 2 3.5-3.5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
    ),
    error: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#ef4444" strokeWidth="1.5"/><path d="M7 4.5v3M7 9.5h.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
    info: (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#4F46E5" strokeWidth="1.5"/><path d="M7 6.5v3.5M7 4.5h.01" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round"/></svg>
    ),
  };

  const bgColors = {
    success: "bg-emerald-50 border-emerald-200 dark:bg-emerald-950 dark:border-emerald-800",
    error: "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
    info: "bg-white border-[#e5e7eb] dark:bg-[#1a1a1e] dark:border-[#2a2a2e]",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg text-sm text-[#374151] ${bgColors[toast.type]}`}
          >
            {icons[toast.type]}
            <span>{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
