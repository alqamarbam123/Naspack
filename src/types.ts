export type Theme = 'dark' | 'light';

export type Page = 'home' | 'portfolio' | 'services' | 'studio' | 'tracking' | 'proof' | 'about' | 'contact' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  token: string;
}

export type ProjectCategory = 
  | 'all' 
  | 'luxury' 
  | 'food' 
  | 'cosmetics' 
  | 'eco' 
  | 'co-packing' 
  | 'retail';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  client: string;
  location: string;
  year: string;
  description: string;
  detailedStory: string;
  primaryImage: string;
  galleryImages: string[];
  tags: string[];
  packagingType: string;
  finishDetails: string;
  dimensions: string;
  photographyCredits: string;
  isFeatured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  features: string[];
  turnaround: string;
  minOrderQty: string;
  tags: string[];
  suitableFor: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  specs: string;
}

export interface TrackingMilestone {
  key: string;
  label: string;
  timestamp: string;
  description: string;
  location: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface ProofAnnotation {
  id: string;
  xPercent: number; // 0 - 100 on image
  yPercent: number; // 0 - 100 on image
  note: string;
  author: string;
  createdAt: string;
  status: 'pending' | 'resolved';
}

export interface ClientProof {
  proofId: string;
  version: string;
  status: 'pending_review' | 'approved' | 'revisions_requested';
  artworkImageUrl: string;
  dielineImageUrl?: string;
  rendering3dUrl?: string;
  colorSpecs: {
    cmyk: string;
    pantone: string[];
    finishingEffects: string[];
  };
  dimensions: string;
  substrate: string;
  bleed: string;
  tolerance: string;
  barcodeVerified: boolean;
  notesFromPrePress?: string;
  annotations?: ProofAnnotation[];
  signOff?: {
    signedBy: string;
    jobTitle: string;
    company: string;
    email: string;
    signatureDataUrl: string;
    signedAt: string;
    approvalCertificateId: string;
    notes?: string;
  };
  revisionsHistory?: {
    requestedAt: string;
    requestedBy: string;
    feedback: string;
    pinsCount: number;
  }[];
}

export interface Order {
  trackingNumber: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  destinationCity: string;
  orderDate: string;
  estimatedDelivery: string;
  status: 'Received' | 'In Production' | 'Co-Packaging' | 'Quality Check' | 'Out for Delivery' | 'Delivered';
  progressPercentage: number;
  currentMilestone: string;
  items: OrderItem[];
  packagingSpecs: {
    boxStyle: string;
    material: string;
    printFinish: string;
    batchSize: string;
  };
  timeline: TrackingMilestone[];
  driverOrHandler?: string;
  vehiclePlate?: string;
  qrCodeSeed?: string;
  proof?: ClientProof;
}

export interface QuoteInquiry {
  id: string;
  customerName: string;
  companyName: string;
  phone: string;
  email: string;
  packagingType: string;
  estimatedQty: string;
  serviceType: string;
  notes: string;
  submittedAt: string;
  assignedTrackingId?: string;
}
