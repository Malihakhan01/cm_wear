export type StoreMode = "wholesale" | "retail";

export interface ProductColor {
  id: string;
  name: string;
  hex: string;
  pantone?: string;
}

export interface GarmentPart {
  id: string;
  name: string;
  defaultColor: string;
}

export type MainCategoryId =
  | "casual-wear"
  | "streetwear"
  | "equestrian-clothing"
  | "ice-hockey"
  | "cycling"
  | "rugby"
  | "basketball"
  | "ski-wear"
  | "go-karting-racing";

export interface Subcategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface Category {
  id: MainCategoryId;
  slug: string;
  name: string;
  number: string; // e.g. "01", "02"
  shortDescription: string;
  description: string;
  heroImage: string;
  subcategories: Subcategory[];
  technicalHighlights: string[];
  capabilities: string[];
  faqs?: { question: string; answer: string }[];
}

export interface WholesaleTier {
  minQty: number;
  maxQty?: number;
  unitPrice: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  category: MainCategoryId;
  subcategory: string;
  shortDescription: string;
  description: string;
  images: string[];
  retailPrice: number;
  wholesalePrice: number;
  wholesaleTiers?: WholesaleTier[];
  MOQ: number;
  sizes: string[];
  colors: ProductColor[];
  fabric: string;
  material: string;
  materials?: string[];
  GSM?: number;
  fit: string;
  technicalFeatures: string[];
  customizable: boolean;
  customizerId?: string;
  sampleAvailable: boolean;
  sampleLeadTime?: string;
  leadTime: string;
  decorationMethods: string[];
  featured?: boolean;
  bestseller?: boolean;
  isNew?: boolean;
  threeDModel?: string;
  specifications: { label: string; value: string }[];
  garmentParts?: GarmentPart[];
  washOptions?: string[];
}

export type GarmentView = "front" | "back" | "left" | "right" | "threeD";

export interface ArtworkLayer {
  id: string;
  name: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scale: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  view: GarmentView;
  isLocked: boolean;
  isVisible: boolean;
  flippedH?: boolean;
}

export interface TextLayer {
  id: string;
  name: string;
  text: string;
  font: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  letterSpacing: number;
  lineHeight: number;
  rotation: number;
  x: number;
  y: number;
  zIndex: number;
  view: GarmentView;
  alignment: "left" | "center" | "right";
  isLocked: boolean;
  isVisible: boolean;
  outlineColor?: string;
  shadowColor?: string;
}

export interface ConfigurableGarmentPart {
  id: string;
  label: string;
  mask?: string;
  defaultColor: string;
  availableColors?: string[];
  texture?: string;
  material?: string;
}

export interface ConfigurableProductDef {
  id: string;
  slug: string;
  name: string;
  category: MainCategoryId;
  description: string;
  basePrice: number;
  wholesaleBasePrice: number;
  moq: number;
  availableViews: GarmentView[];
  parts: ConfigurableGarmentPart[];
  printAreas: {
    view: GarmentView;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
  availableFabrics: {
    id: string;
    name: string;
    gsm: number;
    composition: string;
    description: string;
  }[];
  availableColors: {
    id: string;
    name: string;
    hex: string;
    pantone?: string;
    category?: "neutral" | "athletic" | "earth" | "olive";
  }[];
  sizes: string[];
  decorations: string[];
  trims?: {
    id: string;
    name: string;
    options: { id: string; label: string; hex?: string }[];
  }[];
}

export interface CustomizerState {
  productId: string;
  view: GarmentView;
  activeGarmentPart: string;
  partColors: Record<string, string>;
  fabricId: string;
  gsm: number;
  washId?: string;
  construction?: any;
  decorationMethodId: string;
  trims: any;
  artworkLayers: ArtworkLayer[];
  textLayers: TextLayer[];
  quantity: number;
  sizeBreakdown: Record<string, number>;
}

export interface SavedDesign {
  id: string;
  productId: string;
  productName: string;
  thumbnail: string;
  createdAt: string;
  updatedAt: string;
  partColors: Record<string, string>;
  fabricName: string;
  gsm: number;
  decorationMethod: string;
  artworkLayersCount: number;
  textLayersCount: number;
  washName?: string;
  customizerState: CustomizerState;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  image: string;
  mode: StoreMode;
  unitPrice: number;
  quantity: number;
  color: ProductColor;
  size?: string;
  sizeBreakdown?: Record<string, number>;
  fabric?: string;
  gsm?: number;
  customDesignId?: string;
  isCustomized?: boolean;
  customSummary?: string;
  notes?: string;
  decorationMethods?: string[];
  customColorHex?: string;
  artworkFileUrl?: string;
  artworkFileName?: string;
  totalPrice?: number;
  customizerState?: CustomizerState;
  customLetters?: any;
  customLogo?: any;
}

export interface SizeBreakdown {
  [size: string]: number;
}

export interface WholesaleConfiguration {
  quantity: number;
  sizeBreakdown: SizeBreakdown;
  selectedColorHex: string;
  customColorHex?: string;
  artworkFileUrl?: string;
  artworkFileName?: string;
  customizationMethods: string[];
  notes?: string;
}

export interface QuoteRequest {
  id: string;
  referenceNumber: string;
  createdAt: string;
  status: "Pending Review" | "Under Specification" | "Quotation Ready" | "Approved";
  customer: {
    fullName: string;
    companyName: string;
    email: string;
    phone: string;
    whatsApp?: string;
    website?: string;
    country: string;
  };
  category: MainCategoryId | string;
  productId?: string;
  productName: string;
  quantity: number;
  sizes: SizeBreakdown;
  colors: string[];
  fabric: string;
  gsm?: number;
  customizationMethods: string[];
  artworkUploaded?: boolean;
  artworkUrl?: string;
  privateLabel: {
    neckLabels: boolean;
    careLabels: boolean;
    hangTags: boolean;
    customPackaging: boolean;
  };
  packaging: string;
  deliveryCountry: string;
  deadline?: string;
  notes?: string;
  estimatedUnitPrice?: number;
  estimatedTotal?: number;
}

export interface Inquiry {
  id: string;
  referenceNumber: string;
  createdAt: string;
  productId: string;
  productName: string;
  sku: string;
  customerName: string;
  email: string;
  phone?: string;
  message: string;
  quantity?: number;
}

export interface TrackingStage {
  id: string;
  name: string;
  description: string;
  percentage: number;
  status: "pending" | "in_progress" | "completed";
  estimatedCompletion: string;
  location?: string;
  completedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    name: string;
    company?: string;
    email: string;
    phone?: string;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  mode: StoreMode;
  status: "Processing" | "In Production" | "Quality Check" | "Dispatched" | "Delivered";
  paymentMethod: PaymentMethod;
  shippingMethod: string;
  trackingNumber?: string;
  stages: TrackingStage[];
  currentStageIndex: number;
  estimatedDispatch: string;
}

export type PaymentMethod =
  | "credit_card"
  | "paypal"
  | "bank_transfer"
  | "wise"
  | "manual_invoice";

export interface NotificationPreference {
  email: boolean;
  whatsApp: boolean;
  stages: {
    orderPlaced: boolean;
    orderConfirmed: boolean;
    paymentReceived: boolean;
    quoteReady: boolean;
    sampleReady: boolean;
    productionStarted: boolean;
    productionUpdate: boolean;
    qualityCheckComplete: boolean;
    orderShipped: boolean;
    delivered: boolean;
  };
}

export interface FilterState {
  category?: MainCategoryId;
  subcategory?: string;
  size?: string;
  color?: string;
  material?: string;
  fabric?: string;
  fit?: string;
  customizableOnly?: boolean;
  sampleAvailableOnly?: boolean;
  threeDOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minMoq?: number;
  maxMoq?: number;
  decorationMethod?: string;
  sortBy?: "featured" | "price-asc" | "price-desc" | "newest" | "moq-asc";
  searchQuery?: string;
}

export interface CustomizationService {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  bestUses: string[];
  compatibleGarments: string[];
  durability: string;
  moq: number;
  setupTime: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  composition: string;
  gsmRange: string;
  textureImage: string;
  stretch: "None" | "2-Way Low" | "2-Way Medium" | "4-Way High" | "4-Way Maximum";
  breathability: "Moderate" | "High" | "Maximum Aeration";
  waterResistance: "None" | "DWR Water Repellent" | "10,000mm Waterproof" | "20,000mm Extreme";
  windResistance: "Low" | "Medium" | "100% Windproof";
  recommendedProducts: string[];
  bestCategories: MainCategoryId[];
}

export interface Wash {
  id: string;
  name: string;
  slug: string;
  description: string;
  characteristics: string[];
  imageBefore: string;
  imageAfter: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeDesc?: string;
  afterDesc?: string;
}

export interface DecorationMethod {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  recommendedFor: string[];
  complexity: "Standard" | "Intermediate" | "High-End / Luxury";
  moq: number;
  durability: string;
}

export interface Embellishment {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  recommendedGarments: string[];
  estimatedComplexity: "Moderate" | "Advanced" | "Artisanal / Haute";
}

export interface TrimOption {
  id: string;
  name: string;
  category: "zipper" | "button" | "drawcord" | "hardware" | "label" | "packaging";
  description: string;
  image: string;
  finishes: string[];
}

export interface PackagingOption {
  id: string;
  name: string;
  type: "polybag" | "box" | "hangtag" | "mailer";
  description: string;
  moq: number;
  ecoRating: "Standard" | "Recycled" | "100% Biodegradable";
  image: string;
}
