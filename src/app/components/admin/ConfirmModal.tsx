"use client";

interface ConfirmModalProps {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  message,
  confirmLabel = "Supprimer",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-red-500/30 bg-black/90 p-6 shadow-2xl">
        <p className="mb-6 text-center text-white/90">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-red-500"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
