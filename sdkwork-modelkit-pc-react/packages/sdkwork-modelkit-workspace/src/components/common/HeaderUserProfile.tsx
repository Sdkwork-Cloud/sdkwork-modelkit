import { useAppContext } from "@sdkwork/modelkit-core";
import React, { useState, useRef, useEffect } from "react";
import {
  User,
  ChevronDown,
  Shield,
  Key,
  LogOut,
  Check,
  Settings2,
  Sparkles,
  ShoppingBag,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { useService } from "@sdkwork/modelkit-core";
import {
  IUserService,
  IUserServiceToken,
  UserProfileInfo,
} from "@sdkwork/modelkit-services";

interface HeaderUserProfileProps {
  onNavigate?: (
    view: "user-profile" | "system-settings" | "shop-orders" | "shop-cart",
  ) => void;
}

export function HeaderUserProfile({ onNavigate }: HeaderUserProfileProps) {
  const { t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userService = useService<IUserService>(IUserServiceToken);
  const [profile, setProfile] = useState<UserProfileInfo | null>(null);

  useEffect(() => {
    userService.fetchProfile().then(setProfile);
  }, [userService]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    toast.success(t('workspace:session_locked', "Session locked. Local terminal remains active."));
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Clickable Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-hover border border-divider hover:bg-surface-hover hover:border-primary-main/40 hover:shadow-[0_0_10px_rgba(59,130,246,0.15)] transition-all cursor-pointer select-none active:scale-95"
      >
        <div className="relative">
          <img
            src={
              profile?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            }
            alt="User Avatar"
            className="w-7 h-7 rounded-full object-cover border border-divider shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-divider" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-xs font-display font-bold text-text-main block max-w-[100px] truncate leading-none">
            {profile?.name || "Loading..."}
          </span>
        </div>
        <ChevronDown
          size={12}
          className={`text-text-muted transition-transform duration-200 ${isOpen ? "rotate-180 text-primary-light" : ""}`}
        />
      </button>

      {/* Popover Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-surface border border-surface-hover rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* User Profile Card Header */}
          <div className="p-4 bg-gradient-to-b from-surface-hover to-surface border-b border-divider">
            <div className="flex items-center gap-3">
              <img
                src={
                  profile?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                }
                alt="User Avatar Large"
                className="w-11 h-11 rounded-xl object-cover border border-primary-main/20 shadow-[0_0_15px_rgba(79,70,229,0.25)]"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-text-main truncate">
                    {profile?.name || "Loading..."}
                  </span>
                  <Sparkles size={11} className="text-yellow-500 shrink-0" />
                </div>
                <div className="text-[10px] text-primary-light font-semibold truncate">
                  {profile?.email || "..."}
                </div>
              </div>
            </div>
          </div>

          {/* Quick status checklist */}
          <div className="px-4 py-2.5 bg-canvas/60 border-b border-divider flex items-center justify-between text-[10px] text-text-muted">
            <span className="flex items-center gap-1">
              <Shield size={11} className="text-primary-light" />
              {t("workspace:txt_1153")}{" "}
              <strong className="text-text-main">
                {t("workspace:txt_1154")}
              </strong>
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-0.5">
            <button
              onClick={() => {
                onNavigate?.("user-profile");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-text-main hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
            >
              <User size={13} className="text-text-muted" />
              {t("workspace:txt_1155")}
            </button>
            <button
              onClick={() => {
                onNavigate?.("system-settings");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-text-main hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
            >
              <Settings2 size={13} className="text-text-muted" />
              {t("workspace:txt_1156")}
            </button>
          </div>

          {/* Shop Context Items */}
          <div className="p-2 border-t border-divider space-y-0.5">
            <button
              onClick={() => {
                onNavigate?.("shop-orders");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-text-main hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
            >
              <History size={13} className="text-text-muted" />
              {t("workspace:txt_1157")}
            </button>
            <button
              onClick={() => {
                onNavigate?.("shop-cart");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-text-main hover:text-text-main hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
            >
              <ShoppingBag size={13} className="text-text-muted" />
              {t("workspace:txt_1158")}
            </button>
          </div>

          {/* Footer Action */}
          <div className="p-2 bg-panel border-t border-divider">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-left"
            >
              <LogOut size={13} className="text-red-400" />
              {t("workspace:txt_1159")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
