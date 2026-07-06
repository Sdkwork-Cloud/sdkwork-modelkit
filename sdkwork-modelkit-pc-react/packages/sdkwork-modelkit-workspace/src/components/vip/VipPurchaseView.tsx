import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useEffect } from "react";
import {
  Crown,
  Check,
  X,
  Zap,
  Sparkles,
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  Timer,
  QrCode,
  Coins,
  ArrowRight,
  TrendingUp,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import { workspaceService } from "../../services/WorkspaceService";
import { VipStatus } from "../../services/types";

import { VipCheckoutModal } from "./VipCheckoutModal";
import { VipPlanCard } from "./VipPlanCard";
import { VIP_PLANS } from "./VipPlansData";
import { VipCancelModal } from "../modals/VipCancelModal";

interface VipPurchaseViewProps {
  onNavigate?: (view: "user-profile" | "system-settings") => void;
  onVipStatusChanged?: () => void;
}

export function VipPurchaseView({
  onNavigate,
  onVipStatusChanged,
}: VipPurchaseViewProps) {
  const { t } = useAppContext();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [isVip, setIsVip] = useState(false);
  const [vipStatusData, setVipStatusData] = useState<VipStatus>({
    isActive: false,
    plan: "Pro",
    cycle: "monthly",
    date: "",
  });
  const [selectedPlan, setSelectedPlan] = useState<{
    id: string;
    name: string;
    price: number;
  } | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Check initial VIP status
  useEffect(() => {
    workspaceService.getVipStatus().then((status) => {
      setIsVip(status.isActive);
      setVipStatusData(status);
    });
  }, []);

  const handleOpenCheckout = (
    planId: string,
    planName: string,
    monthlyPrice: number,
    yearlyPrice: number,
  ) => {
    if (isVip) {
      toast.info(t('workspace:vip_already_active', "You are already an active VIP member. No need to subscribe again."));
      return;
    }
    const finalPrice = billingCycle === "yearly" ? yearlyPrice : monthlyPrice;
    setSelectedPlan({ id: planId, name: planName, price: finalPrice });
    setIsCheckoutOpen(true);
  };

  const handleCancelVip = () => {
    setShowCancelConfirm(true);
  };

  const executeCancelVip = () => {
    workspaceService.setVipStatus(null).then(() => {
      setIsVip(false);
      setVipStatusData({
        isActive: false,
        plan: "Pro",
        cycle: "monthly",
        date: "",
      });
      toast.info(t('workspace:vip_canceled', "VIP subscription cancelled. Your account is back to standard."));
      setShowCancelConfirm(false);
      if (onVipStatusChanged) {
        onVipStatusChanged();
      }
    });
  };

  const plans = VIP_PLANS;

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-panel overflow-y-auto custom-scrollbar relative select-none">
      {/* Upper premium aesthetic layout block */}
      <div className="px-8 pt-8 pb-4 flex-shrink-0 relative overflow-hidden">
        {/* Subtle blurred golden radial background */}
        <div className="absolute right-1/4 top-10 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute left-1/3 top-1/2 w-80 h-80 bg-primary-main/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-3 border-b border-divider">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 px-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-inner select-none">
                <Crown size={10} className="text-amber-500 animate-pulse" />
                PREMIUM PRIVILEGE
              </span>
              {isVip && (
                <span className="p-1 px-2 rounded bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
                  {t("workspace:txt_1365")}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-text-main tracking-tight flex items-center gap-2">
              {t("workspace:txt_1366")}
            </h1>
            <p className="text-sm text-text-muted mt-1 max-w-xl">
              {t("workspace:txt_1367")}
            </p>
          </div>

          {/* Billing Toggle (Monthly vs Yearly) */}
          {!isVip && (
            <div className="mt-4 md:mt-0 flex items-center gap-2.5 p-1 bg-canvas border border-divider rounded-xl self-start md:self-center">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  billingCycle === "monthly"
                    ? "bg-surface-hover text-text-main shadow-md"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {t('workspace:bill_monthly', 'Monthly')}
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`relative px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                  billingCycle === "yearly"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {t('workspace:bill_yearly', 'Yearly')}
                <span className="text-[9px] bg-red-600 text-white px-1 py-0.5 rounded-full font-black scale-90 -rotate-2 select-none">
                  {t("workspace:txt_1370")}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Subscriptions and Benefits container */}
      <div className="px-8 pb-16 space-y-12">
        {/* Existing VIP member stats block */}
        {isVip ? (
          <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 relative shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient(from_center) pointer-events-none opacity-20" />
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg">
                <Crown size={28} className="animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-black text-text-main flex items-center gap-2">
                  {t("workspace:txt_1371")}{" "}
                  <span className="text-amber-400">
                    {vipStatusData.plan || t("workspace:flagship_plan", "Flagship")}
                  </span>{" "}
                  {t("workspace:txt_1373")}
                </div>
                <div className="text-xs text-text-muted font-medium">
                  {t('workspace:billing_cycle', 'Billing Cycle:')}
                  {vipStatusData.cycle === "yearly"
                    ? t('workspace:yearly_member', "Yearly Member (30% Off)")
                    : t('workspace:monthly_member', "Monthly Member")}{" "}
                  &nbsp;|&nbsp; {t('workspace:activation_date', 'Activation Date:')}
                  {vipStatusData.date || new Date().toLocaleDateString()}
                </div>
                <div className="text-xs text-amber-500/80 font-semibold flex items-center gap-1 pt-1">
                  <ShieldCheck size={12} />
                  {t("workspace:txt_1374")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-auto justify-end">
              <button
                onClick={() => toast.info(t('workspace:loading_checkout', "Loading payment gateway..."))}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white transition-all cursor-pointer shadow-lg shadow-amber-500/20"
              >
                {t("workspace:txt_1375")}
              </button>
              <button
                onClick={handleCancelVip}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                {t("workspace:txt_1376")}
              </button>
            </div>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <VipPlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isVip={isVip}
                vipStatusData={vipStatusData}
                onOpenCheckout={handleOpenCheckout}
              />
            ))}
          </div>
        )}

        {/* Brand visual badges / trust factors */}
        <div className="border border-divider bg-canvas rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-6 text-center shadow-inner">
          <div className="flex flex-col items-center justify-center space-y-2 p-2">
            <Zap className="text-amber-500 animate-pulse" size={22} />
            <strong className="text-xs text-text-main">
              {t("workspace:txt_1380")}
            </strong>
            <p className="text-[10px] text-text-muted">
              {t("workspace:txt_1381")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 p-2 border-t md:border-t-0 md:border-l border-divider">
            <ShieldCheck className="text-primary-main" size={22} />
            <strong className="text-xs text-text-main">
              {t("workspace:txt_1382")}
            </strong>
            <p className="text-[10px] text-text-muted">
              {t("workspace:txt_1383")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 p-2 border-t md:border-t-0 md:border-l border-divider">
            <TrendingUp className="text-emerald-500" size={22} />
            <strong className="text-xs text-text-main">
              {t("workspace:txt_1384")}
            </strong>
            <p className="text-[10px] text-text-muted">
              {t("workspace:txt_1385")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 p-2 border-t md:border-t-0 md:border-l border-divider">
            <HeartHandshake className="text-violet-500" size={22} />
            <strong className="text-xs text-text-main">
              {t("workspace:txt_1386")}
            </strong>
            <p className="text-[10px] text-text-muted">
              {t("workspace:txt_1387")}
            </p>
          </div>
        </div>

        {/* Benefits Comparison Table / FAQ Accordion */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-text-main flex items-center gap-1.5 uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            {t("workspace:txt_1388")}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-divider">
            <table className="w-full text-left text-xs bg-panel">
              <thead className="bg-surface text-text-muted font-bold uppercase tracking-wider text-[9px] border-b border-divider">
                <tr>
                  <th className="py-3 px-4">{t("workspace:txt_1389")}</th>
                  <th className="py-3 px-4">{t("workspace:txt_1390")}</th>
                  <th className="py-3 px-4 text-primary-light">
                    {t("workspace:txt_1391")}
                  </th>
                  <th className="py-3 px-4">{t("workspace:txt_1392")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C1F26] text-text-main font-medium">
                <tr>
                  <td className="py-3.5 px-4 font-bold text-whites text-text-main">
                    {t("workspace:txt_1393")}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    {t("workspace:txt_1394")}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-455 text-primary-light font-bold">
                    {t("workspace:txt_1395")}
                  </td>
                  <td className="py-3.5 px-4">{t("workspace:txt_1396")}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-text-main">
                    {t("workspace:txt_1397")}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    {t("workspace:txt_1398")}
                  </td>
                  <td className="py-3.5 px-4 text-primary-light font-bold">
                    {t("workspace:txt_1399")}
                  </td>
                  <td className="py-3.5 px-4">{t("workspace:txt_1400")}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-text-main">
                    {t("workspace:txt_1401")}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    {t("workspace:txt_1402")}
                  </td>
                  <td className="py-3.5 px-4 text-primary-light font-bold">
                    {t("workspace:txt_1403")}
                  </td>
                  <td className="py-3.5 px-4">{t("workspace:txt_1404")}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-text-main">
                    {t("workspace:txt_1405")}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    {t("workspace:txt_1406")}
                  </td>
                  <td className="py-3.5 px-4 text-primary-light font-bold">
                    {t("workspace:txt_1407")}
                  </td>
                  <td className="py-3.5 px-4">{t("workspace:txt_1408")}</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-bold text-text-main">
                    {t("workspace:txt_1409")}
                  </td>
                  <td className="py-3.5 px-4 text-text-muted">
                    {t("workspace:txt_1410")}
                  </td>
                  <td className="py-3.5 px-4 text-primary-light font-bold">
                    {t("workspace:txt_1411")}
                  </td>
                  <td className="py-3.5 px-4">{t("workspace:txt_1412")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Checkout Dialog Modal */}
      <VipCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        billingCycle={billingCycle}
        onSuccess={(newStatus) => {
          setIsVip(true);
          setVipStatusData(newStatus);
          setIsCheckoutOpen(false); // Can close immediately or handled by modal
          if (onVipStatusChanged) onVipStatusChanged();
        }}
      />

      <VipCancelModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={executeCancelVip}
      />
    </div>
  );
}
