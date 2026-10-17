"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  Shirt, 
  ShieldCheck, 
  Building,
  User,
  Phone,
  Layers
} from "lucide-react";

export const WelcomeCustomizerModal: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Form States (Merged into single unified atelier form)
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [selectedGarment, setSelectedGarment] = useState<"varsity" | "hoodie" | "basketball">("varsity");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<"customize" | "inquiry" | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [createdRfqNumber, setCreatedRfqNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Video playback ref & state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // 3D Product Showcase Animation State (Supports atelier products)
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

  const PRODUCTS_SHOWCASE = [
    {
      id: "varsity",
      name: "Heritage Varsity Jacket",
      spec: "500 GSM Melton Wool & Full-Grain Cowhide Leather",
      videoUrl: "/images/varsity_3d_rotating.mp4",
      fallbackVideoUrl: "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4",
      image: "/varsity_jacket/front/body.png",
      tag: "Atelier Model #01",
      slug: "custom-varsity-jacket",
    },
    {
      id: "hoodie",
      name: "450 GSM Heavy Streetwear Hoodie",
      spec: "Organic Cotton Combed French Terry • Drop-Shoulder",
      videoUrl: "/images/varsity_3d_rotating.mp4",
      fallbackVideoUrl: "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4",
      image: "/hoodie/hoodie_front.png",
      tag: "Atelier Model #02",
      slug: "custom-hoodie",
    },
    {
      id: "basketball",
      name: "Pro Court Diamond Air-Mesh Jersey",
      spec: "Micro-Eyelet Sublimated Air-Mesh • Pro Athletic Fit",
      videoUrl: "/images/varsity_3d_rotating.mp4",
      fallbackVideoUrl: "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4",
      image: "/basketball/front (3) (1).png",
      tag: "Atelier Model #03",
      slug: "custom-basketball-jersey",
    },
  ];

  // Auto-switch showcase when selecting garment in the form
  useEffect(() => {
    const idx = PRODUCTS_SHOWCASE.findIndex((p) => p.id === selectedGarment);
    if (idx !== -1) {
      setActiveShowcaseIdx(idx);
    }
  }, [selectedGarment]);

  useEffect(() => {
    // Check if modal was already dismissed in this session (or force open via query param ?welcome=true)
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const forceOpen = urlParams?.get("welcome") === "true" || urlParams?.get("welcome") === "1";
    const dismissed = sessionStorage.getItem("cm_welcome_popup_dismissed");

    if (!dismissed || forceOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  // Hydrate client contact info from localStorage/sessionStorage if already provided
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail =
        localStorage.getItem("cm_user_email") ||
        localStorage.getItem("user_inquiry_email") ||
        localStorage.getItem("user_design_email") ||
        sessionStorage.getItem("user_inquiry_email") ||
        sessionStorage.getItem("user_design_email") ||
        "";
      const storedName =
        localStorage.getItem("cm_user_name") ||
        localStorage.getItem("user_inquiry_name") ||
        localStorage.getItem("user_design_name") ||
        sessionStorage.getItem("user_inquiry_name") ||
        "";
      const storedCompany =
        localStorage.getItem("cm_user_company") ||
        localStorage.getItem("user_inquiry_company") ||
        sessionStorage.getItem("user_inquiry_company") ||
        "";
      const storedPhone =
        localStorage.getItem("cm_user_phone") ||
        localStorage.getItem("user_inquiry_phone") ||
        sessionStorage.getItem("user_inquiry_phone") ||
        "";

      if (storedEmail) setEmail(storedEmail);
      if (storedName) setFullName(storedName);
      if (storedCompany) setCompanyName(storedCompany);
      if (storedPhone) setPhone(storedPhone);
    }
  }, []);

  // When modal opens, make sure video starts playing immediately
  useEffect(() => {
    if (isOpen && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented or postponed
        });
      }
    }
  }, [isOpen]);

  const handleClose = () => {
    sessionStorage.setItem("cm_welcome_popup_dismissed", "true");
    sessionStorage.removeItem("user_popup_submitted");
    sessionStorage.removeItem("user_popup_submitted_email");
    sessionStorage.removeItem("user_popup_submitted_name");
    sessionStorage.removeItem("user_popup_submitted_company");
    sessionStorage.removeItem("user_popup_submitted_phone");
    try {
      localStorage.removeItem("cm_user_email");
      localStorage.removeItem("user_inquiry_email");
      localStorage.removeItem("user_design_email");
      localStorage.removeItem("cm_customizer_client_email");
    } catch (e) {}
    setIsOpen(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  // Action Handler: triggers either "customize" flow or "inquiry" flow
  const handleAction = async (action: "customize" | "inquiry") => {
    setErrorMessage("");

    if (!email || !validateEmail(email)) {
      setErrorMessage("Please enter a valid work or brand email address.");
      return;
    }

    setIsSubmitting(true);
    setSubmittingAction(action);

    const chosenGarmentObj = PRODUCTS_SHOWCASE.find((p) => p.id === selectedGarment) || PRODUCTS_SHOWCASE[0];

    try {
      const { apiClient } = await import("@/services/api.client");

      if (action === "customize") {
        // --- CUSTOMIZE ACTION FLOW ---
        const rfqResponse = await apiClient.post<{ success: boolean; rfq_number?: string; id?: number }>("/inquiries/rfq", {
          inquiry_type: "customizer_lead",
          full_name: fullName.trim() || "Brand Buyer / Designer",
          email: email.trim(),
          company: companyName.trim() || null,
          phone: phone.trim() || null,
          quantity: 50,
          items: [
            {
              product_name: chosenGarmentObj.name,
              garment_type: chosenGarmentObj.id,
              slug: chosenGarmentObj.slug,
              quantity: 50,
            }
          ],
          requirements: {
            source: "welcome_popup",
            garment_id: chosenGarmentObj.id,
            garment_name: chosenGarmentObj.name,
            garment_spec: chosenGarmentObj.spec,
            inquiry_notes: inquiryNotes.trim() || null,
            lead_source: "Turntable Atelier Modal",
          },
          message: inquiryNotes.trim() 
            ? `Lead from Customizer Popup: ${inquiryNotes.trim()} [Selected: ${chosenGarmentObj.name}]`
            : `Lead from Customizer Popup: Client selected '${chosenGarmentObj.name}' to start customizer session. Work email unlocked for technical CAD specs.`,
        });

        // Store in sessionStorage for current session sync with SaveDesignModal
        if (typeof window !== "undefined") {
          sessionStorage.setItem("user_popup_submitted", "true");
          sessionStorage.setItem("user_popup_submitted_email", email.trim());
          if (fullName.trim()) {
            sessionStorage.setItem("user_popup_submitted_name", fullName.trim());
          }
          if (companyName.trim()) {
            sessionStorage.setItem("user_popup_submitted_company", companyName.trim());
          }
          if (phone.trim()) {
            sessionStorage.setItem("user_popup_submitted_phone", phone.trim());
          }
          sessionStorage.setItem("user_inquiry_notes", inquiryNotes.trim());
          sessionStorage.setItem("user_inquiry_garment", chosenGarmentObj.id);
          if (rfqResponse?.rfq_number) {
            sessionStorage.setItem("user_inquiry_rfq_number", rfqResponse.rfq_number);
          }
          sessionStorage.setItem("cm_welcome_popup_dismissed", "true");
        }

        // Subscribe to drops
        await apiClient.post("/inquiries/newsletter", { 
          email: email.trim() 
        }).catch(() => {});

        setIsOpen(false);
        router.push(`/customize/${chosenGarmentObj.slug}`);
      } else {
        // --- DIRECT INQUIRY ACTION FLOW ---
        const payloadMessage = inquiryNotes.trim()
          ? `[Home Popup Direct Inquiry] Notes: ${inquiryNotes.trim()} (Selected Garment: ${chosenGarmentObj.name})`
          : `Direct Manufacturing Inquiry via Home Popup: Client requested full OEM/ODM product catalog, wholesale volume price matrix, and fabric GSM specification swatches for ${chosenGarmentObj.name}.`;

        const rfqRes = await apiClient.post<{ success: boolean; rfq_number?: string }>("/inquiries/rfq", {
          inquiry_type: "blank_inquiry",
          full_name: fullName.trim() || "Prospective Brand Client",
          email: email.trim(),
          company: companyName.trim() || null,
          phone: phone.trim() || null,
          quantity: 100,
          items: [
            {
              product_name: chosenGarmentObj.name,
              garment_type: chosenGarmentObj.id,
              slug: chosenGarmentObj.slug,
              quantity: 100,
            }
          ],
          message: payloadMessage,
        });

        if (rfqRes?.rfq_number) {
          setCreatedRfqNumber(rfqRes.rfq_number);
          sessionStorage.setItem("user_inquiry_rfq_number", rfqRes.rfq_number);
        }

        await Promise.allSettled([
          apiClient.post("/inquiries/contact", {
            name: fullName.trim() || companyName.trim() || "Prospective Brand Client",
            email: email.trim(),
            company: companyName.trim() || null,
            phone: phone.trim() || null,
            subject: `Direct Home Popup Factory Inquiry - ${chosenGarmentObj.name}`,
            message: payloadMessage,
          }),
          apiClient.post("/inquiries/newsletter", { 
            email: email.trim() 
          }),
        ]);

        sessionStorage.setItem("user_inquiry_email", email.trim());
        sessionStorage.setItem("user_inquiry_name", fullName.trim());
        sessionStorage.setItem("user_inquiry_company", companyName.trim());
        sessionStorage.setItem("user_inquiry_phone", phone.trim());
        sessionStorage.setItem("user_inquiry_notes", inquiryNotes.trim());
        sessionStorage.setItem("cm_welcome_popup_dismissed", "true");
        setInquirySent(true);
      }
    } catch (err) {
      console.warn("Popup form submission error:", err);
      if (action === "customize") {
        setIsOpen(false);
        router.push(`/customize/${chosenGarmentObj.slug}`);
      } else {
        setInquirySent(true);
      }
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  // High-performance background preloading while modal is not yet visible
  if (!isOpen) {
    return (
      <video
        src="/images/varsity_3d_rotating.mp4"
        preload="auto"
        muted
        playsInline
        className="hidden pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-4xl lg:max-w-5xl bg-[#0e0f12] text-white border border-[#222530] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden animate-in zoom-in-95 duration-200 relative grid grid-cols-1 md:grid-cols-12 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button in Top-Right Corner */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 text-slate-400 hover:text-white bg-black/70 hover:bg-black p-2.5 rounded-full transition-colors cursor-pointer border border-slate-700/80 shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ========================================================================= */}
        {/* LEFT COLUMN: 3D ROTATING PRODUCT VIDEO (ZOOMED IN & FAST BUFFERING)       */}
        {/* ========================================================================= */}
        <div className="md:col-span-5 bg-[#0e0f12] relative flex flex-col items-center justify-center p-0 overflow-hidden min-h-[320px] md:min-h-full order-1 md:order-1 border-b md:border-b-0 md:border-r border-[#1B2232]">
          
          {/* Clean 3D Continuous Rotating Video on Matching Studio Dark Background - Further Zoomed In */}
          <div className="relative w-full h-full min-h-[320px] sm:min-h-[400px] md:min-h-[520px] flex items-center justify-center select-none overflow-hidden">
            
            {/* Loading Indicator while video buffers */}
            {!videoLoaded && !videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-[#0e0f12] z-10">
                <div className="w-9 h-9 rounded-full border-2 border-[#D61C24]/30 border-t-[#D61C24] animate-spin" />
                <span className="text-[10.5px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">
                  Loading Garment Model...
                </span>
              </div>
            )}

            <video
              ref={videoRef}
              src="/images/varsity_3d_rotating.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              onCanPlay={() => setVideoLoaded(true)}
              onError={() => {
                if (videoRef.current && !videoRef.current.src.includes("popup_3d_rotation.mp4")) {
                  videoRef.current.src = "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4";
                } else {
                  setVideoError(true);
                }
              }}
              className={`w-full h-auto max-h-[550px] object-contain select-none pointer-events-none transform scale-[1.8] sm:scale-[1.88] md:scale-[1.95] origin-center transition-all duration-700 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LET'S BUILD YOUR BRAND & UNIFIED ALL-IN-ONE FORM            */}
        {/* ========================================================================= */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-9 flex flex-col justify-between space-y-5 relative z-10 order-2 md:order-2 bg-[#0e0f12]">
          
          <div className="space-y-3.5">
            
            {/* Top Subtitle Eyebrow in Signature CM SPORTS WEAR Theme */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-ping" />
              <span className="text-[10px] font-mono uppercase font-bold text-[#D61C24] tracking-widest">
                CM SPORTS WEAR &bull; SIALKOT FACTORY ATELIER
              </span>
            </div>

            {/* Giant High-Impact Heading: LET'S BUILD YOUR BRAND */}
            <div className="relative pt-0.5">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black uppercase tracking-tight text-white font-display leading-[1.02]">
                LET&apos;S BUILD <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#D61C24]">
                  YOUR BRAND
                </span>
              </h2>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Form View / Success Screen */}
            {inquirySent ? (
              <div className="py-8 text-center space-y-3.5 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-[#D61C24]/20 text-[#D61C24] flex items-center justify-center mx-auto border border-[#D61C24]/40 shadow-lg shadow-[#D61C24]/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight font-display">
                  Manufacturing Inquiry Dispatched!
                </h4>
                {createdRfqNumber && (
                  <div className="inline-block bg-[#D61C24]/15 border border-[#D61C24]/30 rounded-xl px-4 py-1.5 text-xs font-mono font-bold text-[#D61C24] shadow-sm">
                    Factory RFQ Reference: {createdRfqNumber}
                  </div>
                )}
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Our factory production team has logged your inquiry directly into our core CRM system. A copy has been dispatched to <span className="font-mono text-white font-bold">{email}</span> with our full OEM/ODM product catalog, volume tier price list, and fabric GSM specification swatches.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 px-7 py-2.5 rounded-full bg-[#181D2C] hover:bg-[#20273A] text-xs font-bold text-white border border-[#2B3347] transition cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => e.preventDefault()} className="space-y-3 pt-1">
                
                {/* 1. Full Name & 2. Company / Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" />
                      <span>Full Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={fullName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFullName(val);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cm_user_name", val.trim());
                          localStorage.setItem("user_inquiry_name", val.trim());
                          localStorage.setItem("user_design_name", val.trim());
                          sessionStorage.setItem("user_inquiry_name", val.trim());
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>Company / Brand</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Apparel Ltd"
                      value={companyName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCompanyName(val);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cm_user_company", val.trim());
                          localStorage.setItem("user_inquiry_company", val.trim());
                          sessionStorage.setItem("user_inquiry_company", val.trim());
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                    />
                  </div>
                </div>

                {/* 3. Work Email (Required) & 4. WhatsApp Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-300 uppercase font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-[#D61C24]" />
                        <span>Work Email</span>
                      </span>
                      <span className="text-[#D61C24] font-bold text-[10px]">*REQUIRED</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="buyer@company.com"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cm_user_email", val.trim());
                          localStorage.setItem("user_inquiry_email", val.trim());
                          localStorage.setItem("user_design_email", val.trim());
                          sessionStorage.setItem("user_inquiry_email", val.trim());
                          sessionStorage.setItem("user_design_email", val.trim());
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>WhatsApp Number</span>
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPhone(val);
                        if (typeof window !== "undefined") {
                          localStorage.setItem("cm_user_phone", val.trim());
                          localStorage.setItem("user_inquiry_phone", val.trim());
                          sessionStorage.setItem("user_inquiry_phone", val.trim());
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                    />
                  </div>
                </div>

                {/* 5. Inquiry Note / Target Specifications */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-slate-500" />
                    <span>Inquiry Note / Target Specifications</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Inquiring for 100 pcs custom varsity jackets with chenille embroidery, target delivery Nov 2026..."
                    value={inquiryNotes}
                    onChange={(e) => setInquiryNotes(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition resize-none"
                  />
                </div>

                {/* Action Buttons: Customize & Send Inquiry */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAction("customize")}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#D61C24] hover:bg-[#b8141b] text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#D61C24]/30 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    <Shirt className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      {isSubmitting && submittingAction === "customize"
                        ? "CUSTOMIZING..."
                        : "START CUSTOMIZING"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAction("inquiry")}
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#151926] hover:bg-[#1c2234] border border-[#2B354D] hover:border-[#D61C24]/60 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5 text-[#D61C24]" />
                    <span>
                      {isSubmitting && submittingAction === "inquiry"
                        ? "DISPATCHING..."
                        : "SEND INQUIRY"}
                    </span>
                  </button>
                </div>


              </form>
            )}

          </div>

          {/* Micro Trust Bottom Bar in CM SPORTS WEAR Theme */}
          <div className="pt-3 border-t border-[#1B2232] flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO 9001 Certified Sialkot Factory</span>
            </span>
            <span>AQL 2.5 Quality Standard</span>
          </div>

        </div>

      </div>
    </div>
  );
};
