"use client";

import React, { useState, useEffect } from "react";
import { X, Save, CheckCircle2, Copy, Check, Mail, Sparkles, ShieldCheck } from "lucide-react";

export interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (email: string, name?: string, designTitle?: string) => Promise<{ success: boolean; designCode?: string }>;
  activeModelName: string;
  previewImage: string;
  activeWash: string;
  gsm: number;
}

export const SaveDesignModal: React.FC<SaveDesignModalProps> = ({
  isOpen,
  onClose,
  onSave,
  activeModelName,
  previewImage,
  activeWash,
  gsm,
}) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [designTitle, setDesignTitle] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCode, setSavedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      // ONLY prefill if user explicitly filled and submitted the welcome popup form in this active session
      const popupSubmitted = typeof window !== "undefined" && sessionStorage.getItem("user_popup_submitted") === "true";

      if (!popupSubmitted && typeof window !== "undefined") {
        // If popup was NOT submitted, ensure any legacy stale emails in localStorage are purged
        try {
          localStorage.removeItem("tawfiq_user_email");
          localStorage.removeItem("user_inquiry_email");
          localStorage.removeItem("user_design_email");
          localStorage.removeItem("tawfiq_customizer_client_email");
        } catch (e) {}
      }

      const prefillEmail = popupSubmitted ? (sessionStorage.getItem("user_popup_submitted_email") || "") : "";
      const prefillName = popupSubmitted ? (sessionStorage.getItem("user_popup_submitted_name") || "") : "";

      setEmail(prefillEmail);
      setName(prefillName);
      setDesignTitle(`${activeModelName} Custom Spec`);
      setError(null);
      setSavedCode(null);
      setCopied(false);
    }
  }, [isOpen, activeModelName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      setError("Please enter a valid email address to save your design.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("tawfiq_user_email", cleanEmail);
        localStorage.setItem("user_design_email", cleanEmail);
        localStorage.setItem("user_inquiry_email", cleanEmail);
        sessionStorage.setItem("user_design_email", cleanEmail);
        sessionStorage.setItem("user_inquiry_email", cleanEmail);
        if (name.trim()) {
          localStorage.setItem("tawfiq_user_name", name.trim());
          localStorage.setItem("user_design_name", name.trim());
          localStorage.setItem("user_inquiry_name", name.trim());
          sessionStorage.setItem("user_design_name", name.trim());
          sessionStorage.setItem("user_inquiry_name", name.trim());
        }
      }

      const res = await onSave(cleanEmail, name.trim(), designTitle.trim());
      if (res?.success) {
        setSavedCode(res.designCode || "CD-" + Math.random().toString(36).substring(2, 8).toUpperCase());
      } else {
        setError("Failed to sync design to server. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    if (!savedCode) return;
    navigator.clipboard.writeText(savedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-[2px] shadow-2xl max-w-md w-full overflow-hidden text-neutral-900 dark:text-neutral-100 font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-[#FAFAF8] dark:bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[2px] bg-[#D10115]/10 border border-[#D10115]/20 flex items-center justify-center">
              <Save className="w-4 h-4 text-[#D10115]" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-black dark:text-white font-mono">
                {savedCode ? "Design Spec Secured" : "Save Custom Design"}
              </h3>
              <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                Factory Vault Synchronization
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-black dark:hover:text-white rounded-[2px] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {savedCode ? (
            /* Success State */
            <div className="text-center space-y-4 py-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>

              <div>
                <h4 className="text-base font-bold text-black dark:text-white font-mono">
                  Specification Saved to Factory Vault!
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  Your customized garment spec has been linked to{" "}
                  <strong className="text-black dark:text-white">{email}</strong>.
                </p>
              </div>

              {/* Design Code Card */}
              <div className="p-3.5 bg-[#FAFAF8] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[2px] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block">
                  Unique Factory Design Reference Code:
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="font-mono text-lg font-black tracking-widest text-[#D10115]">
                    {savedCode}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-1.5 text-neutral-500 hover:text-black dark:hover:text-white rounded-[2px] border border-neutral-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Copy design code"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {copied && (
                  <span className="text-[10px] font-mono text-emerald-600 font-bold block">
                    Copied to clipboard!
                  </span>
                )}
              </div>

              <div className="text-[11px] text-neutral-500 font-mono text-left bg-neutral-50 dark:bg-neutral-950/60 p-3 rounded-[2px] border border-neutral-200 dark:border-neutral-800 space-y-1">
                <div className="flex items-center gap-1.5 text-black dark:text-white font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>What happens next:</span>
                </div>
                <p>&bull; Use this code anytime to reload your design or export a Sialkot Tech Pack.</p>
                <p>&bull; Reference this code in commercial RFQs for instant factory sample pricing.</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-[#0B0B0B] hover:bg-neutral-900 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            /* Input Form State */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Garment Summary Badge */}
              <div className="p-3 bg-[#FAFAF8] dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[2px] flex items-center gap-3">
                <div className="w-12 h-12 rounded-[2px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                  <img
                    src={previewImage || "/hoodie/hoodie_front.png"}
                    alt={activeModelName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/hoodie/hoodie_front.png";
                    }}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-black dark:text-white truncate">
                    {activeModelName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-mono text-neutral-500">
                    <span>{gsm} GSM</span>
                    <span>&bull;</span>
                    <span className="truncate">{activeWash}</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-[2px] text-xs text-red-700 dark:text-red-400 font-medium">
                  {error}
                </div>
              )}

              {/* Email Input (Required) */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-1.5 flex items-center justify-between">
                  <span>Your Email Address *</span>
                  <span className="text-[10px] font-normal text-[#D10115] font-mono">REQUIRED</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      if (typeof window !== "undefined") {
                        localStorage.setItem("tawfiq_user_email", val.trim());
                        localStorage.setItem("user_design_email", val.trim());
                        localStorage.setItem("user_inquiry_email", val.trim());
                        sessionStorage.setItem("user_design_email", val.trim());
                        sessionStorage.setItem("user_inquiry_email", val.trim());
                      }
                      if (error) setError(null);
                    }}
                    placeholder="e.g. designer@yourbrand.com"
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-[2px] text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black dark:focus:ring-white"
                    autoFocus
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] text-neutral-500 font-mono mt-1">
                  We will link your custom configuration and specification code to this email.
                </p>
              </div>

              {/* Name / Brand Input (Optional) */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Full Name / Brand (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setName(val);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("tawfiq_user_name", val.trim());
                      localStorage.setItem("user_design_name", val.trim());
                      localStorage.setItem("user_inquiry_name", val.trim());
                      sessionStorage.setItem("user_design_name", val.trim());
                    }
                  }}
                  placeholder="e.g. Apex Sportswear / Studio Atelier"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-[2px] text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Design Spec Title */}
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Design Title
                </label>
                <input
                  type="text"
                  value={designTitle}
                  onChange={(e) => setDesignTitle(e.target.value)}
                  placeholder="e.g. Heavyweight Fleece Drop 1"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 rounded-[2px] text-black dark:text-white placeholder:text-neutral-400 focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#0B0B0B] hover:bg-neutral-900 disabled:bg-neutral-400 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-[2px] flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Spec...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#D10115]" />
                      <span>Save Spec &amp; Get Code</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
