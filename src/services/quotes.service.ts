import { QuoteRequest } from "@/types";
import { delay } from "@/lib/utils";
import { apiClient } from "@/services/api.client";

export const quotesService = {
  async submitQuote(quote: Omit<QuoteRequest, "id" | "referenceNumber" | "createdAt" | "status">): Promise<QuoteRequest> {
    await delay(300);
    const refNum = `TI-RFQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newQuote: QuoteRequest = {
      ...quote,
      id: `quote_${Date.now()}`,
      referenceNumber: refNum,
      createdAt: new Date().toISOString(),
      status: "Pending Review",
    };

    // Forward to Laravel backend RFQ endpoint
    try {
      const backendPayload = {
        inquiry_type: "bulk_manufacturing",
        full_name: quote.customer?.fullName || "Client Representative",
        email: quote.customer?.email || "",
        company: quote.customer?.companyName || null,
        phone: quote.customer?.phone || null,
        country: quote.customer?.country || quote.deliveryCountry || "International",
        quantity: quote.quantity || 100,
        target_price: quote.estimatedUnitPrice || null,
        target_lead_days: 21,
        incoterm: "FOB",
        message: quote.notes || `RFQ for ${quote.productName}`,
        items: [{
          name: quote.productName,
          category: quote.category,
          quantity: quote.quantity,
          sizes: quote.sizes,
          colors: quote.colors,
          fabric: quote.fabric,
          gsm: quote.gsm,
        }],
        requirements: {
          customizationMethods: quote.customizationMethods,
          privateLabel: quote.privateLabel,
          packaging: quote.packaging,
        },
      };

      const backendResponse = await apiClient.post<{ success: boolean; rfq_number?: string }>(
        "/inquiries/rfq",
        backendPayload
      );

      if (backendResponse?.rfq_number) {
        newQuote.referenceNumber = backendResponse.rfq_number;
      }
    } catch (e) {
      console.warn("Backend RFQ dispatch fallback to local:", e);
    }

    // Store in localStorage if in client for offline resilience
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("tawfiq-industry-quotes") || "[]");
        stored.unshift(newQuote);
        localStorage.setItem("tawfiq-industry-quotes", JSON.stringify(stored));
      } catch (err) {
        console.error("Failed to persist quote locally", err);
      }
    }

    return newQuote;
  },

  async getQuotes(): Promise<QuoteRequest[]> {
    await delay(100);
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("tawfiq-industry-quotes") || "[]");
      } catch {
        return [];
      }
    }
    return [];
  },
};
