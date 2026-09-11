import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { PROJECTS_DATA } from './src/data/projectsData';
import { INITIAL_ORDERS } from './src/data/ordersData';
import { Project, Order, QuoteInquiry } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Persistent JSON Store Directory
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface DataStore {
  projects: Project[];
  orders: Order[];
  quotes: QuoteInquiry[];
  admin: {
    email: string;
    passwordHash: string; // Plain/simple hash for prototype management
    name: string;
    role: 'admin' | 'editor';
  };
}

const DEFAULT_STORE: DataStore = {
  projects: PROJECTS_DATA,
  orders: INITIAL_ORDERS,
  quotes: [
    {
      id: 'quote-seed-1',
      customerName: 'Hamad Al-Kuwari',
      companyName: 'Al-Kuwari Oud & Amber',
      phone: '77315415',
      email: 'hamad@alkuwari-oud.qa',
      packagingType: 'Luxury Rigid Magnetic Box',
      estimatedQty: '1000 - 5000 units',
      serviceType: 'Luxury Rigid Boxes & Hot Foil',
      notes: 'Need sample prototype with gold Kurz foil and velvet insert in Doha.',
      submittedAt: '2025-05-12T10:30:00Z',
      assignedTrackingId: 'NP-QA-8941'
    }
  ],
  admin: {
    email: 'admin@naspack.qa',
    passwordHash: 'naspack2026',
    name: 'NasPack Director (Qatar)',
    role: 'admin'
  }
};

function loadStore(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      const ordersList = (parsed.orders && parsed.orders.length > 0 ? parsed.orders : DEFAULT_STORE.orders).map((o: Order) => {
        if (!o.proof) {
          const match = INITIAL_ORDERS.find(init => init.trackingNumber === o.trackingNumber);
          if (match?.proof) {
            return { ...o, proof: match.proof };
          }
        }
        return o;
      });
      return {
        projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : DEFAULT_STORE.projects,
        orders: ordersList,
        quotes: parsed.quotes || DEFAULT_STORE.quotes,
        admin: parsed.admin || DEFAULT_STORE.admin
      };
    } else {
      saveStore(DEFAULT_STORE);
      return DEFAULT_STORE;
    }
  } catch (err) {
    console.error('Error loading store from disk, using fallback in-memory store:', err);
    return DEFAULT_STORE;
  }
}

function saveStore(store: DataStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store to disk:', err);
  }
}

let store = loadStore();

// ==========================================
// API ROUTES
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    totalProjects: store.projects.length,
    totalOrders: store.orders.length
  });
});

// Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const inputPassword = String(password).trim();

  // Validate credentials: match admin record or fallback master demo credentials
  const isValidAdmin = 
    (normalizedEmail === store.admin.email.toLowerCase() && inputPassword === store.admin.passwordHash) ||
    (normalizedEmail === 'admin@naspack.qa' && inputPassword === 'naspack2026') ||
    (normalizedEmail === 'admin' && inputPassword === 'admin') ||
    (normalizedEmail === 'admin' && inputPassword === 'naspack2026');

  if (!isValidAdmin) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
  }

  const token = `naspack_token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  res.json({
    success: true,
    token,
    user: {
      id: 'admin-naspack-qa',
      email: store.admin.email,
      name: store.admin.name,
      role: store.admin.role
    }
  });
});

app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }
  const token = authHeader.split(' ')[1];
  if (token && token.startsWith('naspack_token_')) {
    return res.json({
      authenticated: true,
      user: {
        id: 'admin-naspack-qa',
        email: store.admin.email,
        name: store.admin.name,
        role: store.admin.role
      }
    });
  }
  res.status(401).json({ authenticated: false });
});

// ==========================================
// PROJECTS / PRODUCT DESIGNS API
// ==========================================

// GET all projects
app.get('/api/projects', (req, res) => {
  res.json({
    projects: store.projects,
    count: store.projects.length
  });
});

// GET single project by ID
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = store.projects.find((p) => p.id === id);
  if (!project) {
    return res.status(404).json({ error: 'Product design not found' });
  }
  res.json({ project });
});

// CREATE a new project / product design
app.post('/api/projects', (req, res) => {
  const newProject: Partial<Project> = req.body;

  if (!newProject.title || !newProject.category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }

  const generatedId = newProject.id || newProject.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

  const fullProject: Project = {
    id: generatedId,
    title: newProject.title,
    category: newProject.category || 'luxury',
    client: newProject.client || 'NasPack Studio Client',
    location: newProject.location || 'Doha, Qatar',
    year: newProject.year || new Date().getFullYear().toString(),
    description: newProject.description || '',
    detailedStory: newProject.detailedStory || newProject.description || '',
    primaryImage: newProject.primaryImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
    galleryImages: Array.isArray(newProject.galleryImages) && newProject.galleryImages.length > 0 
      ? newProject.galleryImages 
      : [newProject.primaryImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80'],
    tags: Array.isArray(newProject.tags) ? newProject.tags : ['Bespoke Packaging', 'Qatar Made'],
    packagingType: newProject.packagingType || 'Custom Rigid Packaging Box',
    finishDetails: newProject.finishDetails || 'Matte Lamination + Hot Foil Stamping',
    dimensions: newProject.dimensions || '200mm x 150mm x 60mm',
    photographyCredits: newProject.photographyCredits || 'NasPack Commercial Studio (Zone 57, Doha)',
    isFeatured: Boolean(newProject.isFeatured)
  };

  // Prepend to catalog so newly created designs show up first
  store.projects = [fullProject, ...store.projects];
  saveStore(store);

  res.status(201).json({
    success: true,
    project: fullProject,
    message: 'Product design added successfully'
  });
});

// UPDATE an existing project / product design
app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const updates: Partial<Project> = req.body;

  const index = store.projects.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product design not found' });
  }

  store.projects[index] = {
    ...store.projects[index],
    ...updates,
    id // Ensure ID remains immutable
  };

  saveStore(store);

  res.json({
    success: true,
    project: store.projects[index],
    message: 'Product design updated successfully'
  });
});

// DELETE a project / product design
app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const initialCount = store.projects.length;
  store.projects = store.projects.filter((p) => p.id !== id);

  if (store.projects.length === initialCount) {
    return res.status(404).json({ error: 'Product design not found' });
  }

  saveStore(store);

  res.json({
    success: true,
    message: 'Product design deleted successfully',
    remainingCount: store.projects.length
  });
});

// RESET projects to factory preset
app.post('/api/projects/reset', (req, res) => {
  store.projects = [...PROJECTS_DATA];
  saveStore(store);
  res.json({
    success: true,
    projects: store.projects,
    message: 'Catalog reset to original NasPack portfolio defaults'
  });
});

// ==========================================
// ORDERS & TRACKING API
// ==========================================

// GET all orders
app.get('/api/orders', (req, res) => {
  res.json({
    orders: store.orders,
    count: store.orders.length
  });
});

// GET single order by tracking number
app.get('/api/orders/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const cleanQuery = trackingNumber.toLowerCase().replace(/\s+/g, '');
  const order = store.orders.find((o) => o.trackingNumber.toLowerCase().replace(/\s+/g, '') === cleanQuery);

  if (!order) {
    return res.status(404).json({ error: 'Order tracking record not found' });
  }
  res.json({ order });
});

// CREATE new production order
app.post('/api/orders', (req, res) => {
  const orderData: Partial<Order> = req.body;

  const trackingNumber = orderData.trackingNumber || `NP-QA-${Math.floor(1000 + Math.random() * 9000)}`;

  const newOrder: Order = {
    trackingNumber,
    customerName: orderData.customerName || 'Valued Qatar Client',
    company: orderData.company || 'Private Client',
    phone: orderData.phone || '77315415',
    email: orderData.email || 'client@example.qa',
    destinationCity: orderData.destinationCity || 'Doha, Qatar',
    orderDate: orderData.orderDate || new Date().toISOString().split('T')[0],
    estimatedDelivery: orderData.estimatedDelivery || 'In 7-10 Business Days',
    status: orderData.status || 'Received',
    progressPercentage: orderData.progressPercentage ?? 20,
    currentMilestone: orderData.currentMilestone || 'Die-Line Verification & Material Allocation',
    items: orderData.items && orderData.items.length > 0 ? orderData.items : [
      {
        id: 'item-1',
        name: 'Custom Packaging Production Batch',
        quantity: 1000,
        specs: 'Standard Production Specs'
      }
    ],
    packagingSpecs: orderData.packagingSpecs || {
      boxStyle: 'Custom Box Packaging',
      material: '350gsm Food-Grade SBS Board',
      printFinish: 'CMYK + Matte Lamination',
      batchSize: '1,000 Units'
    },
    timeline: orderData.timeline && orderData.timeline.length > 0 ? orderData.timeline : [
      {
        key: 'received',
        label: 'Order Confirmed & Sign-off',
        timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        description: 'CAD die-line approved. Initial press run scheduled.',
        location: 'NasPack Industrial Studio, Zone 57, Doha',
        isCompleted: true,
        isCurrent: false
      },
      {
        key: 'production',
        label: 'Production & Finishing',
        timestamp: 'In Progress',
        description: 'Tooling, printing, and automated scoring.',
        location: 'Main Press Floor, Doha',
        isCompleted: false,
        isCurrent: true
      }
    ],
    driverOrHandler: orderData.driverOrHandler || 'NasPack Logistics Dispatch Unit',
    vehiclePlate: orderData.vehiclePlate || 'QA-TRK-7731'
  };

  store.orders = [newOrder, ...store.orders];
  saveStore(store);

  res.status(201).json({
    success: true,
    order: newOrder
  });
});

// UPDATE order status and milestone
app.put('/api/orders/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const updates: Partial<Order> = req.body;
  const cleanTracking = trackingNumber.toLowerCase().replace(/\s+/g, '');

  const index = store.orders.findIndex((o) => o.trackingNumber.toLowerCase().replace(/\s+/g, '') === cleanTracking);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  store.orders[index] = {
    ...store.orders[index],
    ...updates,
    trackingNumber: store.orders[index].trackingNumber // Immutable key
  };

  saveStore(store);

  res.json({
    success: true,
    order: store.orders[index],
    message: 'Order updated successfully'
  });
});

// DELETE order
app.delete('/api/orders/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;
  const cleanTracking = trackingNumber.toLowerCase().replace(/\s+/g, '');
  const initialLength = store.orders.length;
  store.orders = store.orders.filter((o) => o.trackingNumber.toLowerCase().replace(/\s+/g, '') !== cleanTracking);

  if (store.orders.length === initialLength) {
    return res.status(404).json({ error: 'Order not found' });
  }

  saveStore(store);
  res.json({ success: true, message: 'Order record deleted' });
});

// ==========================================
// CLIENT PROOF APPROVAL & REVISION APIS
// ==========================================

// SIGN-OFF & APPROVE PROOF
app.post('/api/orders/:trackingNumber/proof/sign-off', (req, res) => {
  const { trackingNumber } = req.params;
  const { signedBy, jobTitle, company, email, signatureDataUrl, notes } = req.body;
  const cleanTracking = trackingNumber.toLowerCase().replace(/\s+/g, '');

  const index = store.orders.findIndex(
    (o) => o.trackingNumber.toLowerCase().replace(/\s+/g, '') === cleanTracking
  );
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = store.orders[index];
  const certId = `CERT-NP-QA-${order.trackingNumber.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString().slice(-6)}`;
  const signedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Qatar'
  }) + ' (AST Doha)';

  const updatedProof: any = {
    ...(order.proof || {
      proofId: `PRF-${order.trackingNumber}-V1`,
      version: 'v1.0 - Production Proof',
      status: 'approved',
      artworkImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=85',
      colorSpecs: {
        cmyk: 'Euroscale 4-Color Process',
        pantone: ['Pantone Standard'],
        finishingEffects: ['Matte Finish']
      },
      dimensions: 'Standard Dimensions',
      substrate: 'Premium Board',
      bleed: '3.0mm',
      tolerance: '±0.25mm',
      barcodeVerified: true
    }),
    status: 'approved',
    signOff: {
      signedBy: signedBy || order.customerName,
      jobTitle: jobTitle || 'Authorized Representative',
      company: company || order.company,
      email: email || order.email,
      signatureDataUrl: signatureDataUrl || '',
      signedAt,
      approvalCertificateId: certId,
      notes: notes || 'Approved for plate making and press run.'
    }
  };

  order.proof = updatedProof;
  order.currentMilestone = 'Client Proof Approved & Released for Press Run';
  order.progressPercentage = Math.max(order.progressPercentage, 40);

  // Prepend to timeline
  order.timeline = [
    {
      key: `proof-approved-${Date.now()}`,
      label: 'Client Proof Approved & Signed Off',
      timestamp: signedAt,
      description: `Digitally authorized by ${signedBy || order.customerName} (${company || order.company}). Certificate: ${certId}`,
      location: 'NasPack Client Digital Portal (Qatar)',
      isCompleted: true,
      isCurrent: false
    },
    ...order.timeline
  ];

  store.orders[index] = order;
  saveStore(store);

  res.json({
    success: true,
    order,
    certificateId: certId,
    message: 'Client proof approved and signed off successfully'
  });
});

// REQUEST REVISIONS
app.post('/api/orders/:trackingNumber/proof/revisions', (req, res) => {
  const { trackingNumber } = req.params;
  const { requestedBy, feedback, annotations } = req.body;
  const cleanTracking = trackingNumber.toLowerCase().replace(/\s+/g, '');

  const index = store.orders.findIndex(
    (o) => o.trackingNumber.toLowerCase().replace(/\s+/g, '') === cleanTracking
  );
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const order = store.orders[index];
  const requestedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Qatar'
  }) + ' (AST Doha)';

  if (!order.proof) {
    order.proof = {
      proofId: `PRF-${order.trackingNumber}-V1`,
      version: 'v1.0',
      status: 'revisions_requested',
      artworkImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=85',
      colorSpecs: {
        cmyk: 'Euroscale 4-Color Process',
        pantone: [],
        finishingEffects: []
      },
      dimensions: 'Standard Dimensions',
      substrate: 'Standard Board',
      bleed: '3.0mm',
      tolerance: '±0.25mm',
      barcodeVerified: true
    };
  }

  order.proof.status = 'revisions_requested';
  if (Array.isArray(annotations)) {
    order.proof.annotations = annotations;
  }

  const revisionItem = {
    requestedAt,
    requestedBy: requestedBy || order.customerName,
    feedback: feedback || 'Client requested design and die-line adjustments.',
    pinsCount: Array.isArray(annotations) ? annotations.length : 0
  };

  order.proof.revisionsHistory = [
    revisionItem,
    ...(order.proof.revisionsHistory || [])
  ];

  order.currentMilestone = 'Client Requested Pre-Press Design Adjustments';

  store.orders[index] = order;
  saveStore(store);

  res.json({
    success: true,
    order,
    message: 'Proof revisions submitted to pre-press engineering team'
  });
});

// UPDATE ANNOTATIONS
app.post('/api/orders/:trackingNumber/proof/annotations', (req, res) => {
  const { trackingNumber } = req.params;
  const { annotations } = req.body;
  const cleanTracking = trackingNumber.toLowerCase().replace(/\s+/g, '');

  const index = store.orders.findIndex(
    (o) => o.trackingNumber.toLowerCase().replace(/\s+/g, '') === cleanTracking
  );
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (store.orders[index].proof) {
    store.orders[index].proof!.annotations = annotations;
    saveStore(store);
  }

  res.json({
    success: true,
    order: store.orders[index]
  });
});

// ==========================================
// QUOTE INQUIRIES API
// ==========================================
app.get('/api/quotes', (req, res) => {
  res.json({ quotes: store.quotes, count: store.quotes.length });
});

app.post('/api/quotes', (req, res) => {
  const quoteData: Partial<QuoteInquiry> = req.body;
  const newQuote: QuoteInquiry = {
    id: `quote-${Date.now()}`,
    customerName: quoteData.customerName || 'Prospective Client',
    companyName: quoteData.companyName || 'Business Inquiry',
    phone: quoteData.phone || '77315415',
    email: quoteData.email || 'client@example.qa',
    packagingType: quoteData.packagingType || 'Rigid Box',
    estimatedQty: quoteData.estimatedQty || '1,000 - 5,000',
    serviceType: quoteData.serviceType || 'Packaging & Co-Packing',
    notes: quoteData.notes || '',
    submittedAt: new Date().toISOString()
  };

  store.quotes = [newQuote, ...store.quotes];
  saveStore(store);

  res.status(201).json({ success: true, quote: newQuote });
});

// ==========================================
// VITE MIDDLEWARE & FRONTEND SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NasPack Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
