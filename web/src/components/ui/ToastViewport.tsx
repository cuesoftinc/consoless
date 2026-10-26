"use client";

import React from "react";
import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { useToast, type ToastType } from "@/controllers/toast";

const getIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    case "error":
      return <AlertTriangle className="w-5 h-5 text-red-400" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
    default:
      return <Info className="w-5 h-5 text-gaming-neon" />;
  }
};

const getBorderColor = (type: ToastType) => {
  switch (type) {
    case "success":
      return "border-green-500/30 bg-green-500/10";
    case "error":
      return "border-red-500/30 bg-red-500/10";
    case "warning":
      return "border-yellow-500/30 bg-yellow-500/10";
    default:
      return "border-gaming-neon/30 bg-gaming-neon/10";
  }
};

const ToastViewport: React.FC = () => {
  const { toasts, removeToast: onDismiss } = useToast();
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto w-80 flex items-start gap-3 p-4 rounded-xl border shadow-[0_0_15px_rgba(0,0,0,0.3)] backdrop-blur-md animate-slide-in ${getBorderColor(toast.type)}`}
        >
          <div className="mt-0.5">{getIcon(toast.type)}</div>
          <p className="flex-1 text-sm font-bold text-white leading-tight">
            {toast.message}
          </p>
          <button
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss Notification"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;
