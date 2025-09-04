// app/NotificationBoot.tsx
"use client";
import { useEffect } from "react";
import { setNotifier } from "@/lib/notifier";
import { toast, Toaster } from "sonner";
import { X } from "lucide-react";

const DURATION = 2000; // plus rapide

function renderToast(message: string, type: "success" | "error", close: () => void) {
  const bg = type === "success" ? "bg-green-600" : "bg-red-600";
  const bar = type === "success" ? "bg-green-300" : "bg-red-300"; // plus clair

  return (
    <div className={`${bg} rounded-xl shadow-lg min-w-[320px] max-w-md p-4 relative`}>
      {/* Bouton close */}
      <button
        onClick={close}
        className="absolute top-2 right-2 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/30 transition"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Message */}
      <p className="font-medium text-white pr-8">{message}</p>

      {/* Barre de progression */}
      <div className="mt-3 h-1 bg-white/40 overflow-hidden rounded">
        <div
          className={`${bar} h-full`}
          style={{ animation: `toast-progress ${DURATION}ms linear forwards` }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

export default function NotificationBoot() {
  useEffect(() => {
    setNotifier({
      success: (m) =>
        toast.custom((t) => renderToast(m, "success", () => toast.dismiss(t.id)), {
          duration: DURATION,
        }),
      error: (m) =>
        toast.custom((t) => renderToast(m, "error", () => toast.dismiss(t.id)), {
          duration: DURATION,
        }),
    });
  }, []);

  return <Toaster position="bottom-right" duration={DURATION} />;
}
