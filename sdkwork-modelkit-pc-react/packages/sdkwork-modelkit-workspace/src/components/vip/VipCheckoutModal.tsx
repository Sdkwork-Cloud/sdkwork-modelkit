import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useEffect, useState } from "react";
import { Crown, CreditCard, CheckCircle2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { readCommerceWalletBalance } from "@sdkwork/modelkit-pc-core/sdk";
import { workspaceService } from "../../services/WorkspaceService";
import type { VipStatus } from "../../services/types";

interface VipCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: { id: string; name: string; price: number } | null;
  billingCycle: "monthly" | "yearly";
  onSuccess: (newStatus: VipStatus) => void;
}

export function VipCheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  billingCycle,
  onSuccess,
}: VipCheckoutModalProps) {
  const { t } = useAppContext();
  const [checkoutStep, setCheckoutStep] = useState<"form" | "processing" | "success">("form");
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    readCommerceWalletBalance().then(setWalletBalance);
    setCheckoutStep("form");
  }, [isOpen, selectedPlan, billingCycle]);

  if (!isOpen || !selectedPlan) {
    return null;
  }

  const handlePurchase = async () => {
    if (walletBalance < selectedPlan.price) {
      toast.error("Insufficient wallet balance. Add funds in Account settings.");
      return;
    }

    setCheckoutStep("processing");
    try {
      const result = await workspaceService.purchaseVipPlan({
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        billingCycle,
        price: selectedPlan.price,
      });
      setWalletBalance(result.remainingBalance);
      setCheckoutStep("success");
      toast.success(
        t(
          "workspace:vip_pay_success",
          "Payment successful. Premium developer privileges activated.",
        ),
      );
      onSuccess(result.vipStatus);
    } catch (error) {
      setCheckoutStep("form");
      toast.error(error instanceof Error ? error.message : "VIP purchase failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div
        className="bg-surface border border-surface-hover rounded-3xl w-full max-w-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-divider-strong flex items-center justify-between bg-canvas">
          <div className="flex items-center gap-2">
            <Crown size={18} className="text-amber-500" />
            <h3 className="text-base font-black text-text-main">{t("workspace:txt_1340")}</h3>
          </div>
          {checkoutStep === "form" && (
            <button
              onClick={onClose}
              className="text-text-muted hover:text-text-main transition-colors text-lg font-black cursor-pointer px-1"
            >
              &times;
            </button>
          )}
        </div>

        {checkoutStep === "form" && (
          <div className="p-6 space-y-6">
            <div className="p-4 rounded-2xl bg-canvas border border-divider text-xs space-y-2.5">
              <div className="flex justify-between items-center text-text-muted">
                <span>{t("workspace:txt_1341")}</span>
                <strong className="text-text-main text-sm">{selectedPlan.name}</strong>
              </div>
              <div className="flex justify-between items-center text-text-muted">
                <span>{t("workspace:txt_1342")}</span>
                <strong className="text-primary-light font-bold">
                  {billingCycle === "yearly"
                    ? t("workspace:yearly_auto_renew_off", "Yearly Auto-Renew (30% off)")
                    : t("workspace:monthly_auto_renew", "Monthly Auto-Renew")}
                </strong>
              </div>
              <div className="flex justify-between items-center text-text-muted pt-2 border-t border-divider">
                <span>{t("workspace:txt_1344")}</span>
                <strong className="text-xl font-black text-amber-500 font-mono">
                  ¥ {selectedPlan.price}
                </strong>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-primary-main/5 border border-primary-main/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                <CreditCard size={16} className="text-primary-main" />
                Wallet balance
              </div>
              <span className="font-mono text-primary-main font-black">
                ¥ {walletBalance.toFixed(2)}
              </span>
            </div>

            <div className="pt-2 border-t border-divider flex items-center justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-text-main cursor-pointer"
              >
                {t("workspace:txt_1363")}
              </button>
              <button
                onClick={handlePurchase}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-primary-main hover:bg-primary-hover text-white transition-colors cursor-pointer"
              >
                Pay with wallet
              </button>
            </div>
          </div>
        )}

        {checkoutStep === "processing" && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-text-main">{t("workspace:txt_1356")}</h4>
              <p className="text-xs text-text-muted">Charging wallet and activating VIP privileges.</p>
            </div>
          </div>
        )}

        {checkoutStep === "success" && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2 max-w-sm mx-auto">
              <h4 className="text-lg font-black text-text-main">{t("workspace:txt_1358")}</h4>
              <p className="text-xs text-text-muted leading-relaxed">{t("workspace:txt_1359")}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[11px] text-emerald-400 font-bold max-w-sm font-mono flex items-center gap-2">
              <ShieldCheck size={14} className="shrink-0" />
              {t("workspace:txt_1360")}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-surface text-text-main hover:bg-surface-hover transition-all shadow-md mt-4 cursor-pointer"
            >
              {t("workspace:txt_1361")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
