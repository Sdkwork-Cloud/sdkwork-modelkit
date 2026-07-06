import { useAppContext } from "@sdkwork/modelkit-core";
import React from "react";

interface VipCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function VipCancelModal({
  isOpen,
  onClose,
  onConfirm,
}: VipCancelModalProps) {
  const { t } = useAppContext();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-panel border gap-4 border-divider-strong rounded-2xl p-6 shadow-2xl relative">
        <h3 className="text-lg font-bold text-text-main mb-2">
          {t("workspace:txt_1231")}
        </h3>
        <p className="text-sm text-text-muted mb-6">
          {t("workspace:txt_1232")}
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main hover:bg-surface transition-colors cursor-pointer"
          >
            {t("workspace:txt_1233")}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors cursor-pointer"
          >
            {t("workspace:txt_1234")}
          </button>
        </div>
      </div>
    </div>
  );
}
