import { Order, TrackingStage } from "@/types";
import { delay } from "@/lib/utils";

const DEFAULT_STAGES: TrackingStage[] = [
  { id: "1", name: "CAD Pattern & Precision Cutting", description: "Tech pack approved, CAD graded marker, vacuum-bed CNC cutting active.", percentage: 16, status: "completed", estimatedCompletion: "Day 01", location: "CAD & Cutting Unit 01" },
  { id: "2", name: "Assembly & Stitching", description: "Heavy-duty twin-needle, overlock, and flatlock assembly on automated production lines.", percentage: 33, status: "in_progress", estimatedCompletion: "Day 04", location: "Stitching Line B-3" },
  { id: "3", name: "Garment Washing & Finishing", description: "Silicon soft-wash, enzyme bio-polishing, and dimensional stability cycle.", percentage: 50, status: "pending", estimatedCompletion: "Day 07", location: "Wash Plant 02" },
  { id: "4", name: "AQL 2.5 Quality Inspection", description: "100% metal needle scan, tolerance sweep, and seam tension audit.", percentage: 68, status: "pending", estimatedCompletion: "Day 09", location: "QA Inspection Bay" },
  { id: "5", name: "Packing & Barcoding", description: "Custom polybagging, barcode sticker labeling, desiccant packs, and export cartons.", percentage: 84, status: "pending", estimatedCompletion: "Day 11", location: "Packaging Depot" },
  { id: "6", name: "Customs Freight & Dispatched", description: "Sialkot / Lahore Air Cargo corridor clearance and international flight dispatch.", percentage: 100, status: "pending", estimatedCompletion: "Day 14", location: "Export Logistics Terminal" },
];

const DEMO_ORDERS: Record<string, Order> = {
  "PP-20261012-F245": {
    id: "inq_pp2026",
    orderNumber: "PP-20261012-F245",
    createdAt: "10/12/2026",
    customer: {
      name: "Pickleball Club Procurement",
      company: "Pro Pickleball League",
      email: "email@gmail.com",
      phone: "+1 212 555 0192",
      shippingAddress: {
        street: "742 Evergreen Terrace",
        city: "Austin",
        state: "TX",
        postalCode: "78701",
        country: "United States",
      },
    },
    items: [
      {
        id: "item_1",
        productId: "pb_jersey_1",
        productSlug: "custom-pickleball-jerseys",
        productName: "Custom Pickleball Jerseys - Premium Team Pickleball Shirts",
        sku: "PB-JRS-001",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 24.50,
        quantity: 1,
        color: { id: "c_navy", name: "Team Navy", hex: "#000080" },
        sizeBreakdown: { M: 1 },
        isCustomized: true,
      },
      {
        id: "item_2",
        productId: "pb_bag_1",
        productSlug: "pickleball-bags",
        productName: "Pickleball Bags - Custom Green Sports Backpack for Pickleball Players",
        sku: "PB-BAG-001",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 38.00,
        quantity: 1,
        color: { id: "c_green", name: "Court Green", hex: "#228B22" },
        sizeBreakdown: {},
        isCustomized: true,
      },
      {
        id: "item_3",
        productId: "pb_socks_1",
        productSlug: "pickleball-socks",
        productName: "Pickleball Socks - Custom Performance Sports Socks for Teams & Players",
        sku: "PB-SCK-001",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 6.50,
        quantity: 1,
        color: { id: "c_white", name: "Pure White", hex: "#FFFFFF" },
        sizeBreakdown: {},
        isCustomized: false,
      },
      {
        id: "item_4",
        productId: "pb_apparel_100",
        productSlug: "custom-pickleball-apparel",
        productName: "Custom Pickleball Apparel Manufacturer | Team Uniforms & Sportswear",
        sku: "PB-MAN-100",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 19.00,
        quantity: 100,
        color: { id: "c_custom", name: "Custom Pantone", hex: "#0055A5" },
        sizeBreakdown: { S: 25, M: 50, L: 25 },
        isCustomized: true,
      },
      {
        id: "item_5",
        productId: "pb_backpack_100",
        productSlug: "custom-pickleball-backpack",
        productName: "Custom Pickleball Backpack Manufacturer | Premium Sports Bag Supplier",
        sku: "PB-BPK-100",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 28.50,
        quantity: 100,
        color: { id: "c_custom_bag", name: "Custom Black/Teal", hex: "#008080" },
        sizeBreakdown: {},
        isCustomized: true,
      },
      {
        id: "item_6",
        productId: "pb_jersey_teal",
        productSlug: "custom-pickleball-jerseys-teal",
        productName: "Custom Pickleball Jerseys - Black & Teal Performance Team Shirts",
        sku: "PB-JRS-002",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 24.50,
        quantity: 1,
        color: { id: "c_teal", name: "Black & Teal", hex: "#008080" },
        sizeBreakdown: { L: 1 },
        isCustomized: true,
      },
    ],
    subtotal: 4850,
    shippingCost: 320,
    total: 5170,
    mode: "wholesale",
    status: "Processing",
    paymentMethod: "bank_transfer",
    shippingMethod: "DDP Air Freight",
    trackingNumber: "AWB-PP-20261012-F245",
    stages: DEFAULT_STAGES,
    currentStageIndex: 0,
    estimatedDispatch: "In 10 business days",
  },
  "TI-849201": {
    id: "ord_1",
    orderNumber: "TI-849201",
    createdAt: "10/05/2026",
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
    items: [
      {
        id: "item_ti_1",
        productId: "ti_hoodie",
        productSlug: "heavyweight-vintage-hoodie",
        productName: "Custom Heavyweight Vintage Hoodie - 480 GSM French Terry",
        sku: "CM-CAS-001",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 28.50,
        quantity: 120,
        color: { id: "c_black", name: "Washed Vintage Black", hex: "#1A1A1A" },
        sizeBreakdown: { S: 20, M: 50, L: 50 },
        isCustomized: true,
      },
      {
        id: "item_ti_2",
        productId: "ti_polo",
        productSlug: "performance-moisture-wicking-polo",
        productName: "Performance Moisture-Wicking Polo - Anti-Bacterial Micro-Pique",
        sku: "CM-CAS-002",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 16.50,
        quantity: 200,
        color: { id: "c_navy", name: "Deep Navy", hex: "#0A192F" },
        sizeBreakdown: { M: 100, L: 100 },
        isCustomized: false,
      },
      {
        id: "item_ti_3",
        productId: "ti_fleece",
        productSlug: "thermal-tech-fleece-jacket",
        productName: "Thermal Tech Fleece Zip Jacket - Bonded Sherpa Lining",
        sku: "CM-CAS-003",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 34.00,
        quantity: 80,
        color: { id: "c_olive", name: "Military Olive", hex: "#4B5320" },
        sizeBreakdown: { M: 40, L: 40 },
        isCustomized: true,
      },
    ],
    subtotal: 6125,
    shippingCost: 480,
    total: 6605,
    mode: "wholesale",
    status: "In Production",
    paymentMethod: "bank_transfer",
    shippingMethod: "Air Express Priority (DHL)",
    trackingNumber: "AWB-TI-9840294104",
    stages: DEFAULT_STAGES,
    currentStageIndex: 1,
    estimatedDispatch: "2026-10-22",
  },
  "TI-302194": {
    id: "ord_2",
    orderNumber: "TI-302194",
    createdAt: "10/01/2026",
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
    items: [
      {
        id: "item_cyc_1",
        productId: "ti_gilet",
        productSlug: "pro-cycling-windproof-gilet",
        productName: "Pro Cycling Windproof Gilet - DWR Ripstop Fabric",
        sku: "CM-CYC-001",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 22.00,
        quantity: 150,
        color: { id: "c_yellow", name: "Hi-Vis Lime", hex: "#CCFF00" },
        sizeBreakdown: { S: 50, M: 50, L: 50 },
        isCustomized: true,
      },
      {
        id: "item_cyc_2",
        productId: "ti_jersey",
        productSlug: "aero-race-cycling-jersey",
        productName: "Aero Race Cycling Jersey - Italian Miti Lycra",
        sku: "CM-CYC-002",
        image: "/logo (2).png",
        mode: "wholesale",
        unitPrice: 24.00,
        quantity: 250,
        color: { id: "c_coral", name: "Race Coral", hex: "#FF6F61" },
        sizeBreakdown: { S: 75, M: 100, L: 75 },
        isCustomized: true,
      },
    ],
    subtotal: 4400,
    shippingCost: 350,
    total: 4750,
    mode: "wholesale",
    status: "Processing",
    paymentMethod: "wise",
    shippingMethod: "Consolidated Air Cargo",
    trackingNumber: "SK-CARGO-77491",
    stages: DEFAULT_STAGES,
    currentStageIndex: 0,
    estimatedDispatch: "2026-10-25",
  },
};

// Aliases for backward compatibility
DEMO_ORDERS["SF-849201"] = DEMO_ORDERS["TI-849201"];
DEMO_ORDERS["SF-302194"] = DEMO_ORDERS["TI-302194"];

export const trackingService = {
  async trackOrder(orderNumber: string): Promise<Order | null> {
    await delay(200);
    const clean = orderNumber.trim().toUpperCase();

    // 1. Query live backend API first
    try {
      const { apiClient } = await import("@/services/api.client");
      const res = await apiClient.get<{
        success: boolean;
        data?: {
          order_number: string;
          status: string;
          current_stage: string;
          current_stage_badge?: string;
          current_stage_index?: number;
          total_quantity?: number;
          subtotal?: number;
          shipping_cost?: number;
          total_amount?: number;
          incoterms?: string;
          tracking_number?: string;
          created_at: string;
          customer?: {
            name?: string;
            company?: string;
            email?: string;
            phone?: string;
            shipping_address?: {
              address_line_1?: string;
              city?: string;
              state?: string;
              postal_code?: string;
              country?: string;
            };
          };
          items?: Array<{
            name: string;
            sku: string;
            quantity: number;
            unit_price: number;
            total_price: number;
          }>;
          milestones?: Array<{
            id: string;
            stage: string;
            title: string;
            description: string;
            is_completed: boolean;
            completed_at?: string;
          }>;
        };
      }>(`/track/${clean}`);

      if (res?.success && res.data) {
        const d = res.data;
        const milestones = d.milestones || [];
        const stageIdx = typeof d.current_stage_index === "number" ? d.current_stage_index : 0;

        const mappedStages: TrackingStage[] = milestones.length > 0
          ? milestones.map((m, idx) => ({
              id: String(m.id || idx + 1),
              name: m.stage || m.title,
              description: m.description,
              percentage: Math.round(((idx + 1) / milestones.length) * 100),
              status: m.is_completed
                ? ("completed" as const)
                : idx === stageIdx
                ? ("in_progress" as const)
                : ("pending" as const),
              estimatedCompletion: m.completed_at ? m.completed_at.split("T")[0] : `Phase ${idx + 1}`,
              location: "CM Sports Wear Sialkot Facility",
            }))
          : DEFAULT_STAGES;

        return {
          id: `ord_${d.order_number}`,
          orderNumber: d.order_number,
          createdAt: d.created_at ? d.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
          customer: {
            name: d.customer?.name || "Commercial Partner",
            company: d.customer?.company || "Direct Apparel Label",
            email: d.customer?.email || "buyer@apparelbrand.com",
            phone: d.customer?.phone || "+92 348 4552164",
            shippingAddress: {
              street: d.customer?.shipping_address?.address_line_1 || "Export Hub Way",
              city: d.customer?.shipping_address?.city || "London",
              state: d.customer?.shipping_address?.state || "Greater London",
              postalCode: d.customer?.shipping_address?.postal_code || "EC1A 1BB",
              country: d.customer?.shipping_address?.country || "United Kingdom",
            },
          },
          items: (d.items || []).map((it, idx) => ({
            id: `item_${idx + 1}`,
            productId: it.sku,
            productSlug: it.sku.toLowerCase(),
            productName: it.name,
            sku: it.sku,
            image: "/logo (2).png",
            mode: "wholesale" as const,
            unitPrice: it.unit_price,
            quantity: it.quantity,
            color: { id: "c_black", name: "Factory Spec", hex: "#000000" },
            sizeBreakdown: {},
            isCustomized: false,
          })),
          subtotal: d.subtotal || 3500,
          shippingCost: d.shipping_cost || 250,
          total: d.total_amount || 3750,
          mode: "wholesale",
          status: (["In Production", "Processing", "Quality Check", "Dispatched", "Delivered"].includes(d.status)
            ? d.status
            : "In Production") as Order["status"],
          paymentMethod: "bank_transfer",
          shippingMethod: d.incoterms ? `${d.incoterms} Air Corridor` : "Air Express Priority",
          trackingNumber: d.tracking_number || `AWB-${clean}`,
          stages: mappedStages,
          currentStageIndex: stageIdx,
          estimatedDispatch: "In 10–14 business days",
        };
      }
    } catch (e) {
      console.warn("Backend order tracking fetch fallback:", e);
    }

    // 2. Check predefined demo orders
    if (DEMO_ORDERS[clean]) {
      return DEMO_ORDERS[clean];
    }

    // 3. Dynamic fallback for arbitrary TI- or SF- order numbers
    if (clean.startsWith("TI-") || clean.startsWith("SF-")) {
      return {
        id: `ord_${Date.now()}`,
        orderNumber: clean,
        createdAt: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
        customer: {
          name: "Wholesale Client Partner",
          company: "Private Label Atelier",
          email: "partner@apparelbrand.com",
          phone: "+92 348 4552164",
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
        shippingMethod: "Air Cargo Priority (DDP)",
        trackingNumber: `AWB-TI-${clean.replace(/[^0-9]/g, "")}`,
        stages: DEFAULT_STAGES,
        currentStageIndex: 1,
        estimatedDispatch: "In 10–14 business days",
      };
    }

    return null;
  },
};
