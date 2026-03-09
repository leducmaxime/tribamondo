"use client";
import { useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "success", onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-5 py-3.5 shadow-2xl backdrop-blur-sm ${
        type === "success"
          ? "border-green-500/30 bg-green-950/90 text-green-400"
          : "border-red-500/30 bg-red-950/90 text-red-400"
      }`}
    >
      {type === "success" ? (
        <Check className="h-4 w-4 shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
