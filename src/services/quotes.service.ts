import { QuoteRequest } from "@/types";
import { delay } from "@/lib/utils";

export const quotesService = {
  async submitQuote(quote: Omit<QuoteRequest, "id" | "referenceNumber" | "createdAt" | "status">): Promise<QuoteRequest> {
    await delay(600);
    const refNum = `TI-RFQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newQuote: QuoteRequest = {
      ...quote,
      id: `quote_${Date.now()}`,
      referenceNumber: refNum,
      createdAt: new Date().toISOString(),
      status: "Pending Review",
    };

    // Store in localStorage if in client
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
    await delay(150);
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
