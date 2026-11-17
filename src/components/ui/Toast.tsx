"use client";

import { useToasts } from "@/lib/store";

export function ToastContainer() {
  const { toasts, dismissToast } = useToasts();

  if (!toasts.length) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={[
            "flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium",
            "transition-all",
            toast.type === "success"
              ? "bg-[#3CB371] text-white"
              : toast.type === "error"
              ? "bg-[#FF6347] text-white"
              : "bg-[#061E47] text-white",
          ].join(" ")}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="shrink-0 opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white rounded"
            aria-label="Dismiss notification"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
