export type AnalyticsEvent =
  | "view_product"
  | "view_category"
  | "change_store_mode"
  | "select_size"
  | "select_color"
  | "start_customization"
  | "upload_design"
  | "save_design"
  | "add_to_cart"
  | "request_quote"
  | "whatsapp_inquiry"
  | "begin_checkout"
  | "purchase"
  | "track_order";

export const analyticsService = {
  track(eventName: AnalyticsEvent, params: Record<string, any> = {}) {
    if (typeof window !== "undefined") {
      // Future GA4 / GTM dataLayer dispatch
      const w = window as any;
      if (w.dataLayer) {
        w.dataLayer.push({ event: eventName, ...params });
      }
      // Console telemetry for developer inspection
      if (process.env.NODE_ENV !== "production") {
        console.log(`[TAWFIQ INDUSTRY Analytics] Event: ${eventName}`, params);
      }
    }
  },
};
