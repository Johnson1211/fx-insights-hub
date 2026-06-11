"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastContextType {
  toast: (message: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-md border animate-in slide-in-from-right ${
              t.type === "success"
                ? "bg-elite-green/10 border-elite-green/30 text-elite-green"
                : t.type === "error"
                ? "bg-elite-red/10 border-elite-red/30 text-elite-red"
                : "bg-blue-500/10 border-blue-500/30 text-blue-400"
            }`}
          >
            {t.type === "success" ? <CheckCircle size={18} /> : t.type === "error" ? <AlertCircle size={18} /> : <Info size={18} />}
            <span className="text-sm font-medium">{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              <X size={14} className="opacity-60 hover:opacity-100" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function Toaster() {
  return null; // ToastProvider handles rendering
}
