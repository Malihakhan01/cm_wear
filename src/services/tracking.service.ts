import { Order, TrackingStage } from "@/types";
import { delay } from "@/lib/utils";

const DEFAULT_STAGES: TrackingStage[] = [
  { id: "1", name: "Order Confirmed & Commercial Spec Locked", description: "Tech pack approved, CAD graded, raw materials requisitioned.", percentage: 10, status: "completed", estimatedCompletion: "Day 01" },
  { id: "2", name: "Yarn & Raw Fabric Milling / Lab-Dip Matching", description: "Spectrophotometer Delta-E < 0.5 color check completed.", percentage: 20, status: "completed", estimatedCompletion: "Day 03" },
  { id: "3", name: "Computerized CNC Precision Fabric Cutting", description: "Multi-ply vacuum bed cutting with sub-millimeter tolerances.", percentage: 35, status: "completed", estimatedCompletion: "Day 06" },
  { id: "4", name: "Embellishment, Sublimation & Tajima Embroidery", description: "Italian Monti Antonio sublimation press & 15-needle embroidery active.", percentage: 50, status: "in_progress", estimatedCompletion: "Day 09", location: "Print & Embroidery Facility 02" },
  { id: "5", name: "Precision Assembly & Line Stitching", description: "Twin-needle feed-off-the-arm and heavy 6-thread flatlock assembly.", percentage: 65, status: "pending", estimatedCompletion: "Day 13" },
  { id: "6", name: "Garment Wash, Softening & Surface Treatment", description: "Enzyme bio-polishing and silicone softening wash cycle.", percentage: 75, status: "pending", estimatedCompletion: "Day 15" },
  { id: "7", name: "100% Needle Scan & 11-Point AQL 2.5 Inspection", description: "Individual measurement tolerance verification and safety sweep.", percentage: 85, status: "pending", estimatedCompletion: "Day 16" },
  { id: "8", name: "Custom Branded Polybagging & Master Export Carton", description: "Barcode tagging, desiccant packs, and export carton strapping.", percentage: 92, status: "pending", estimatedCompletion: "Day 17" },
  { id: "9", name: "Customs Clearance & International Air Dispatch", description: "Sialkot Airport / Lahore Air Cargo corridor export departure.", percentage: 98, status: "pending", estimatedCompletion: "Day 19" },
  { id: "10", name: "Final Port Clearance & Delivery Destination", description: "Delivered to buyer designated commercial warehouse facility.", percentage: 100, status: "pending", estimatedCompletion: "Day 22" },
];

const DEMO_ORDERS: Record<string, Order> = {
  "SF-849201": {
    id: "ord_1",
    orderNumber: "SF-849201",
    createdAt: "2026-09-20",
    customer: {
      name: "Marcus Vance",
      company: "Vance Atelier Corp",
      email: "procurement@vanceatelier.com",
      phone: "+1 212 555 0192",
      shippingAddress: {
        street: "482 Broadway 4th Floor",
        city: "New York",
        state: "NY",
        postalCode: "10013",
        country: "United States",
      },
    },
    items: [],
    subtotal: 6125,
    shippingCost: 480,
    total: 6605,
    mode: "wholesale",
    status: "In Production",
    paymentMethod: "bank_transfer",
    shippingMethod: "Air Express Priority (DHL)",
    trackingNumber: "DHL-9840294104",
    stages: DEFAULT_STAGES,
    currentStageIndex: 3,
    estimatedDispatch: "2026-10-12",
  },
  "SF-302194": {
    id: "ord_2",
    orderNumber: "SF-302194",
    createdAt: "2026-09-28",
    customer: {
      name: "Henrik Lindqvist",
      company: "Nordic Athletic AB",
      email: "buyer@nordicathletic.se",
      phone: "+46 8 123 4567",
      shippingAddress: {
        street: "Hamngatan 12",
        city: "Stockholm",
        state: "Stockholm",
        postalCode: "111 47",
        country: "Sweden",
      },
    },
    items: [],
    subtotal: 4400,
    shippingCost: 350,
    total: 4750,
    mode: "wholesale",
    status: "Processing",
    paymentMethod: "wise",
    shippingMethod: "Consolidated Air Cargo",
    trackingNumber: "SK-CARGO-77491",
    stages: DEFAULT_STAGES,
    currentStageIndex: 1,
    estimatedDispatch: "2026-10-22",
  },
};

export const trackingService = {
  async trackOrder(orderNumber: string): Promise<Order | null> {
    await delay(500);
    const clean = orderNumber.trim().toUpperCase();
    if (DEMO_ORDERS[clean]) {
      return DEMO_ORDERS[clean];
    }
    // Return dynamic simulated live order for arbitrary order numbers
    if (clean.startsWith("SF-")) {
      return {
        id: `ord_${Date.now()}`,
        orderNumber: clean,
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
        customer: {
          name: "Wholesale Client Partner",
          email: "partner@apparelbrand.com",
          phone: "+44 20 7946 0912",
          shippingAddress: {
            street: "Commercial Logistics Way",
            city: "London",
            state: "Greater London",
            postalCode: "EC1A 1BB",
            country: "United Kingdom",
          },
        },
        items: [],
        subtotal: 3500,
        shippingCost: 290,
        total: 3790,
        mode: "wholesale",
        status: "In Production",
        paymentMethod: "bank_transfer",
        shippingMethod: "Air Cargo Priority",
        trackingNumber: `AWB-${Math.floor(10000000 + Math.random() * 90000000)}`,
        stages: DEFAULT_STAGES,
        currentStageIndex: 4,
        estimatedDispatch: "In 10 business days",
      };
    }
    return null;
  },
};
