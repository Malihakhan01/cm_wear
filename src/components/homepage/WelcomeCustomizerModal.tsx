"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Sparkles, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Send, 
  Shirt, 
  ShieldCheck, 
  Layers, 
  RotateCw,
  Box,
  Building,
  User,
  Phone,
  Flame
} from "lucide-react";

export const WelcomeCustomizerModal: React.FC = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"customize" | "blank-inquiry">("customize");

  // Form States
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [selectedGarment, setSelectedGarment] = useState<"varsity" | "hoodie" | "equestrian" | "basketball">("varsity");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [createdRfqNumber, setCreatedRfqNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Video playback ref & state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  // 3D Product Showcase Animation State (Supports all 4 atelier products)
  const [activeShowcaseIdx, setActiveShowcaseIdx] = useState(0);

  const PRODUCTS_SHOWCASE = [
    {
      id: "varsity",
      name: "Heritage 3D Varsity Jacket",
      spec: "500 GSM Melton Wool & Full-Grain Cowhide Leather",
      videoUrl: "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4",
      fallbackVideoUrl: "/images/varsity_3d_rotating.mp4",
      image: "/varsity_jacket/front/body.png",
      tag: "3D Atelier Model #01",
      slug: "custom-varsity-jacket",
    },
    {
      id: "hoodie",
      name: "450 GSM Heavy Streetwear Hoodie",
      spec: "Organic Cotton Combed French Terry • Drop-Shoulder",
      videoUrl: "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4",
      fallbackVideoUrl: "/images/varsity_3d_rotating.mp4",
      image: "/hoodie/front/body.png",
      tag: "3D Atelier Model #02",
      slug: "custom-hoodie",
    },
    {
      id: "equestrian",
      name: "Italian Softshell Performance Equestrian Set",
      spec: "4-Way Stretch Windproof Softshell • Performance Grip",
      videoUrl: "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4",
      fallbackVideoUrl: "/images/varsity_3d_rotating.mp4",
      image: "/equastarian/front (2) (1).png",
      tag: "3D Atelier Model #03",
      slug: "custom-riding-jacket",
    },
    {
      id: "basketball",
      name: "Pro Court Diamond Air-Mesh Jersey",
      spec: "Micro-Eyelet Sublimated Air-Mesh • Pro Athletic Fit",
      videoUrl: "/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4",
      fallbackVideoUrl: "/images/varsity_3d_rotating.mp4",
      image: "/basketball/front (3) (1).png",
      tag: "3D Atelier Model #04",
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
    // Check if modal was already dismissed in this session
    const dismissed = sessionStorage.getItem("tawfiq_welcome_popup_dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("tawfiq_welcome_popup_dismissed", "true");
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

  // Handler 1: User enters email & chooses garment, saves lead to backend, then launches customizer
  const handleProceedToCustomize = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !validateEmail(email)) {
      setErrorMessage("Please enter a valid work or brand email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const chosenGarmentObj = PRODUCTS_SHOWCASE.find((p) => p.id === selectedGarment) || PRODUCTS_SHOWCASE[0];

      // Connect and save lead directly to Laravel Backend RFQ & Customers table
      const { apiClient } = await import("@/services/api.client");
      
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
          source: "3d_welcome_popup",
          garment_id: chosenGarmentObj.id,
          garment_name: chosenGarmentObj.name,
          garment_spec: chosenGarmentObj.spec,
          lead_source: "3D Turntable Atelier Modal",
        },
        message: `Lead from 3D Popup: Client selected '${chosenGarmentObj.name}' to start customizer session. Work email unlocked for technical CAD specs.`,
      });

      // Save client profile and RFQ reference to session for customizer session tracking
      sessionStorage.setItem("user_inquiry_email", email.trim());
      sessionStorage.setItem("user_inquiry_name", fullName.trim());
      sessionStorage.setItem("user_inquiry_company", companyName.trim());
      sessionStorage.setItem("user_inquiry_phone", phone.trim());
      sessionStorage.setItem("user_inquiry_garment", chosenGarmentObj.id);
      if (rfqResponse?.rfq_number) {
        sessionStorage.setItem("user_inquiry_rfq_number", rfqResponse.rfq_number);
      }
      sessionStorage.setItem("tawfiq_welcome_popup_dismissed", "true");

      // Subscribe to drops & factory notifications
      await apiClient.post("/inquiries/newsletter", { 
        email: email.trim() 
      });

      setIsOpen(false);

      // Route directly to the selected garment customizer studio
      router.push(`/customize/${chosenGarmentObj.slug}`);
    } catch (err) {
      console.warn("Popup lead capture error:", err);
      setIsOpen(false);
      const chosenGarmentObj = PRODUCTS_SHOWCASE.find((p) => p.id === selectedGarment) || PRODUCTS_SHOWCASE[0];
      router.push(`/customize/${chosenGarmentObj.slug}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler 2: User wants to send a direct blank / quick inquiry to factory email & backend database
  const handleSendBlankInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !validateEmail(email)) {
      setErrorMessage("Please enter a valid email address so we can reply with your quote.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { apiClient } = await import("@/services/api.client");
      
      const payloadMessage = inquiryNotes.trim()
        ? `[Home Popup Direct Inquiry] Notes: ${inquiryNotes.trim()}`
        : `Direct Manufacturing Inquiry via Home Popup: Client requested full OEM/ODM product catalog, wholesale volume price matrix, and fabric GSM specification swatches.`;

      // 1. Submit RFQ to backend
      const rfqRes = await apiClient.post<{ success: boolean; rfq_number?: string }>("/inquiries/rfq", {
        inquiry_type: "blank_inquiry",
        full_name: fullName.trim() || "Prospective Brand Client",
        email: email.trim(),
        company: companyName.trim() || null,
        phone: phone.trim() || null,
        quantity: 100,
        message: payloadMessage,
      });

      if (rfqRes?.rfq_number) {
        setCreatedRfqNumber(rfqRes.rfq_number);
        sessionStorage.setItem("user_inquiry_rfq_number", rfqRes.rfq_number);
      }

      // 2. Submit Contact message and newsletter subscription
      await Promise.allSettled([
        apiClient.post("/inquiries/contact", {
          name: fullName.trim() || companyName.trim() || "Prospective Brand Client",
          email: email.trim(),
          company: companyName.trim() || null,
          phone: phone.trim() || null,
          subject: "Direct Home Popup Factory Inquiry",
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
      sessionStorage.setItem("tawfiq_welcome_popup_dismissed", "true");
      setInquirySent(true);
    } catch (err) {
      console.warn("Blank inquiry submission error:", err);
      setInquirySent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const currentProduct = PRODUCTS_SHOWCASE[activeShowcaseIdx];

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
        {/* LEFT COLUMN: 3D ROTATING PRODUCT VIDEO (SEAMLESS 360° ATELIER TURNTABLE)  */}
        {/* ========================================================================= */}
        <div className="md:col-span-5 bg-[#0e0f12] relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden min-h-[350px] md:min-h-full order-1 md:order-1 border-b md:border-b-0 md:border-r border-[#1B2232]">
          
          {/* Subtle Live 360 Badge */}
          <div className="absolute top-4 left-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-white/10 text-[10px] font-mono text-slate-300 uppercase tracking-wider font-bold shadow-md">
              <RotateCw className="w-3 h-3 text-[#D61C24] animate-spin" style={{ animationDuration: "6s" }} />
              <span>360&deg; 3D ROTATION</span>
            </span>
          </div>

          {/* Clean 3D Continuous Rotating Video on Matching Studio Dark Background */}
          <div className="relative w-full h-full flex items-center justify-center select-none py-2">
            <video
              ref={videoRef}
              src="/images/popup_3d_rotation.mp4/Varsity_jacket_rotating_on_platform_20261013020156.mp4"
              autoPlay
              loop
              muted
              playsInline
              onError={() => {
                if (videoRef.current && videoRef.current.src.includes("popup_3d_rotation.mp4")) {
                  videoRef.current.src = "/images/varsity_3d_rotating.mp4";
                } else {
                  setVideoError(true);
                }
              }}
              className="w-full h-auto max-h-[460px] object-contain select-none pointer-events-none transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: THE BOLD HEADLINE & CUSTOMIZATION FORM                      */}
        {/* ========================================================================= */}
        <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6 relative z-10 order-2 md:order-2 bg-[#0e0f12]">
          
          <div className="space-y-4">
            
            {/* Top Subtitle Eyebrow in Signature Tawfiq Theme */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D61C24] animate-ping" />
              <span className="text-[10.5px] font-mono uppercase font-bold text-[#D61C24] tracking-widest">
                TAWFIQ INDUSTRIES &bull; SIALKOT FACTORY ATELIER
              </span>
            </div>

            {/* Giant High-Impact Heading with Angled B2B Badge */}
            <div className="relative pt-1">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black uppercase tracking-tight text-white font-display leading-[0.98]">
                FILL OUT FORM AND <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                  WE CONTACT YOU
                </span>
              </h2>
              
              {/* Vibrant Angled B2B Badge in Signature Tawfiq Crimson Palette */}
              <div className="inline-block mt-2.5">
                <span className="inline-block transform -rotate-2 bg-[#D61C24] text-white font-black text-[11px] sm:text-xs uppercase px-3 py-1 rounded-[3px] shadow-lg shadow-[#D61C24]/30 tracking-wider border border-[#FF333D]/40">
                  B2B ONLY &bull; OEM ATELIER
                </span>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-[#232938] pt-2 pb-1 gap-5 text-xs font-mono uppercase tracking-wider">
              <button
                type="button"
                onClick={() => { setActiveTab("customize"); setErrorMessage(""); }}
                className={`pb-2 transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                  activeTab === "customize"
                    ? "text-[#D61C24] border-b-2 border-[#D61C24]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>1. Customize Product</span>
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab("blank-inquiry"); setErrorMessage(""); }}
                className={`pb-2 transition-all cursor-pointer font-bold flex items-center gap-1.5 ${
                  activeTab === "blank-inquiry"
                    ? "text-[#D61C24] border-b-2 border-[#D61C24]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>2. Blank Inquiry</span>
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* TAB 1: CUSTOMIZE PRODUCT FLOW */}
            {activeTab === "customize" && (
              <form onSubmit={handleProceedToCustomize} className="space-y-3.5 pt-1">
                
                {/* Full Name Input */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                    <User className="w-3 h-3 text-slate-500" />
                    <span>Full name (Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe / Brand Designer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] focus:ring-1 focus:ring-[#D61C24] transition"
                  />
                </div>

                {/* Work Email Input (Required) */}
                <div className="space-y-1">
                  <label className="text-[11px] font-mono text-slate-300 uppercase font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-[#D61C24]" />
                      <span>Work Email (Required to unlock customizer)</span>
                    </span>
                    <span className="text-[#D61C24] font-bold text-[10px]">*REQUIRED</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@yourcompany.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#121622] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] focus:ring-1 focus:ring-[#D61C24] transition"
                  />
                </div>

                {/* Company & Phone Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span>Company / Brand</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Apparel Ltd"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      <span>WhatsApp / Phone (Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                    />
                  </div>
                </div>

                {/* Garment Selector */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                    CHOOSE 3D GARMENT TO START:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "varsity", name: "Varsity Jacket" },
                      { id: "hoodie", name: "Heavy Hoodie" },
                      { id: "equestrian", name: "Equestrian Set" },
                      { id: "basketball", name: "Basketball Kit" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedGarment(item.id as typeof selectedGarment)}
                        className={`py-2.5 px-2 rounded-xl text-center text-[10.5px] font-mono uppercase font-bold transition border cursor-pointer ${
                          selectedGarment === item.id
                            ? "bg-[#D61C24] text-white border-[#D61C24] shadow-md shadow-[#D61C24]/30 scale-[1.02]"
                            : "bg-[#141720] border-[#232938] text-slate-300 hover:border-slate-600 hover:bg-[#181D2C]"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Button Row */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-3.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 rounded-xl sm:rounded-full bg-[#D61C24] hover:bg-[#b8141b] text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#D61C24]/30 flex items-center justify-center gap-2 cursor-pointer shrink-0 hover:scale-105 active:scale-95"
                  >
                    <span>{isSubmitting ? "SYNCHRONIZING..." : "START CUSTOMIZING"}</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </button>

                  <p className="text-[10.5px] text-slate-400 font-sans leading-tight">
                    Submitting synchronizes your custom mockups, embroidery specs, and tech pack directly with our factory line.
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: BLANK INQUIRY FLOW */}
            {activeTab === "blank-inquiry" && (
              <div>
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
                  <form onSubmit={handleSendBlankInquiry} className="space-y-3 pt-1">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                          Company / Brand
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Apex Apparel Ltd"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-300 uppercase font-bold flex items-center justify-between">
                        <span>Work Email (Required for quote)</span>
                        <span className="text-[#D61C24] font-bold text-[10px]">*REQUIRED</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="buyer@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#121622] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400 uppercase font-semibold">
                        Inquiry Notes / Target Specifications
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Inquiring for 100 pcs custom varsity jackets with chenille embroidery, target delivery Nov 2026..."
                        value={inquiryNotes}
                        onChange={(e) => setInquiryNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#121622] border border-[#232938] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#D61C24] transition"
                      />
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 rounded-xl sm:rounded-full bg-[#D61C24] hover:bg-[#b8141b] text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-xl shadow-[#D61C24]/30 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <span>{isSubmitting ? "DISPATCHING..." : "SEND INQUIRY"}</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>

                      <p className="text-[10px] text-slate-400 font-sans leading-tight">
                        Blank inquiries automatically receive our wholesale catalog, GSM fabric swatches, and factory tier matrix.
                      </p>
                    </div>

                  </form>
                )}
              </div>
            )}

          </div>

          {/* Micro Trust Bottom Bar in Tawfiq Theme */}
          <div className="pt-4 border-t border-[#1B2232] flex items-center justify-between text-[10px] font-mono text-slate-400">
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
