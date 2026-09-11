import { Project, Order, QuoteInquiry, AdminUser } from '../types';
import { PROJECTS_DATA } from '../data/projectsData';
import { INITIAL_ORDERS } from '../data/ordersData';

const STORAGE_KEYS = {
  PROJECTS: 'naspack_projects_cache_v2',
  ORDERS: 'naspack_orders_v1',
  AUTH: 'naspack_admin_auth_v1'
};

// ==========================================
// Authentication APIs
// ==========================================

export const getStoredAuth = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading auth from storage', err);
  }
  return null;
};

export const setStoredAuth = (user: AdminUser | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  } catch (err) {
    console.error('Error writing auth to storage', err);
  }
};

export const loginAdmin = async (email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok && data.success) {
      const user: AdminUser = {
        ...data.user,
        token: data.token
      };
      setStoredAuth(user);
      return { success: true, user };
    } else {
      return { success: false, error: data.error || 'Authentication failed' };
    }
  } catch (err) {
    // Local fallback authentication for offline/local prototype mode
    const normEmail = email.trim().toLowerCase();
    const pass = password.trim();
    if (
      (normEmail === 'admin@naspack.qa' && pass === 'naspack2026') ||
      (normEmail === 'admin' && pass === 'naspack2026') ||
      (normEmail === 'admin' && pass === 'admin')
    ) {
      const fallbackUser: AdminUser = {
        id: 'admin-local',
        email: 'admin@naspack.qa',
        name: 'NasPack Director (Local Admin)',
        role: 'admin',
        token: `naspack_token_local_${Date.now()}`
      };
      setStoredAuth(fallbackUser);
      return { success: true, user: fallbackUser };
    }
    return { success: false, error: 'Could not connect to backend server. Check connection.' };
  }
};

export const logoutAdmin = () => {
  setStoredAuth(null);
};

// ==========================================
// Projects / Product Designs API
// ==========================================

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch('/api/projects');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.projects) && data.projects.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
        return data.projects;
      }
    }
  } catch (err) {
    console.warn('API /api/projects unreachable, reading local storage or static seed', err);
  }

  // Fallback to cache or static seed
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading cached projects', e);
  }

  return PROJECTS_DATA;
};

export const saveProject = async (project: Partial<Project>, isNew: boolean): Promise<Project> => {
  const token = getStoredAuth()?.token;

  if (isNew) {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const data = await res.json();
        return data.project;
      }
    } catch (err) {
      console.warn('Backend POST failed, applying local fallback', err);
    }

    // Local fallback
    const newId = project.id || (project.title || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);

    const created: Project = {
      id: newId,
      title: project.title || 'Untitled Product Design',
      category: project.category || 'luxury',
      client: project.client || 'NasPack Studio Client',
      location: project.location || 'Doha, Qatar',
      year: project.year || '2025',
      description: project.description || '',
      detailedStory: project.detailedStory || project.description || '',
      primaryImage: project.primaryImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
      galleryImages: project.galleryImages && project.galleryImages.length > 0 
        ? project.galleryImages 
        : [project.primaryImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80'],
      tags: project.tags || ['Bespoke Box', 'Qatar Made'],
      packagingType: project.packagingType || 'Custom Rigid Packaging Box',
      finishDetails: project.finishDetails || 'Matte Lamination + Hot Foil Stamping',
      dimensions: project.dimensions || '200mm x 150mm x 60mm',
      photographyCredits: project.photographyCredits || 'NasPack Commercial Photography',
      isFeatured: Boolean(project.isFeatured)
    };

    const existing = await fetchProjects();
    const updated = [created, ...existing];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    return created;
  } else {
    // Update existing
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const data = await res.json();
        return data.project;
      }
    } catch (err) {
      console.warn('Backend PUT failed, applying local fallback', err);
    }

    const existing = await fetchProjects();
    const updated = existing.map((p) => p.id === project.id ? { ...p, ...project } as Project : p);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
    return project as Project;
  }
};

export const deleteProject = async (projectId: string): Promise<boolean> => {
  const token = getStoredAuth()?.token;
  try {
    const res = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (res.ok) {
      // Sync local cache
      const existing = await fetchProjects();
      const updated = existing.filter((p) => p.id !== projectId);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
      return true;
    }
  } catch (err) {
    console.warn('Backend DELETE failed, applying local fallback', err);
  }

  const existing = await fetchProjects();
  const updated = existing.filter((p) => p.id !== projectId);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(updated));
  return true;
};

export const resetProjectsCatalog = async (): Promise<Project[]> => {
  const token = getStoredAuth()?.token;
  try {
    const res = await fetch('/api/projects/reset', {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(data.projects));
      return data.projects;
    }
  } catch (err) {
    console.warn('Backend reset failed', err);
  }
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(PROJECTS_DATA));
  return PROJECTS_DATA;
};

// ==========================================
// Orders & Tracking APIs
// ==========================================

export const fetchOrders = async (): Promise<Order[]> => {
  try {
    const res = await fetch('/api/orders');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.orders) && data.orders.length > 0) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(data.orders));
        return data.orders;
      }
    }
  } catch (err) {
    console.warn('Backend /api/orders unreachable, fallback to localStorage', err);
  }

  try {
    const cached = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ORDERS;
};

export const saveOrder = async (order: Partial<Order>, isNew: boolean): Promise<Order> => {
  if (isNew) {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch (err) {
      console.warn('Failed to POST order to server', err);
    }
  } else {
    try {
      const res = await fetch(`/api/orders/${order.trackingNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
      if (res.ok) {
        const data = await res.json();
        return data.order;
      }
    } catch (err) {
      console.warn('Failed to PUT order to server', err);
    }
  }

  // Local fallback
  const existing = await fetchOrders();
  let updated: Order[];
  if (isNew) {
    const newTracking = order.trackingNumber || `NP-QA-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrder: Order = {
      ...(order as Order),
      trackingNumber: newTracking
    };
    updated = [fullOrder, ...existing];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return fullOrder;
  } else {
    updated = existing.map((o) => o.trackingNumber === order.trackingNumber ? { ...o, ...order } as Order : o);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    return order as Order;
  }
};

export const deleteOrder = async (trackingNumber: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/orders/${trackingNumber}`, { method: 'DELETE' });
    if (res.ok) {
      const existing = await fetchOrders();
      const updated = existing.filter((o) => o.trackingNumber !== trackingNumber);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return true;
    }
  } catch (err) {
    console.warn('Backend DELETE order failed', err);
  }

  const existing = await fetchOrders();
  const updated = existing.filter((o) => o.trackingNumber !== trackingNumber);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  return true;
};

// ==========================================
// Client Proof Approval & Sign-Off APIs
// ==========================================

export interface SignOffPayload {
  signedBy: string;
  jobTitle: string;
  company: string;
  email: string;
  signatureDataUrl: string;
  notes?: string;
}

export const signOffProofApi = async (
  trackingNumber: string,
  payload: SignOffPayload
): Promise<{ success: boolean; order: Order; certificateId: string }> => {
  try {
    const res = await fetch(`/api/orders/${trackingNumber}/proof/sign-off`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      // Sync local storage
      const existing = await fetchOrders();
      const next = existing.map(o => o.trackingNumber === data.order.trackingNumber ? data.order : o);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
      return { success: true, order: data.order, certificateId: data.certificateId };
    }
  } catch (err) {
    console.warn('Backend sign-off failed, applying local fallback', err);
  }

  // Local fallback
  const existing = await fetchOrders();
  const certId = `CERT-NP-QA-${trackingNumber.replace(/[^A-Za-z0-9]/g, '')}-${Date.now().toString().slice(-6)}`;
  const signedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) + ' (AST Doha)';

  let updatedOrder: Order | null = null;
  const next = existing.map(o => {
    if (o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()) {
      const updated: Order = {
        ...o,
        status: o.status === 'Received' ? 'In Production' : o.status,
        currentMilestone: 'Client Proof Approved & Released for Press Run',
        proof: {
          ...(o.proof || {
            proofId: `PRF-${o.trackingNumber}-V1`,
            version: 'v1.0',
            status: 'approved',
            artworkImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=85',
            colorSpecs: { cmyk: 'Euroscale', pantone: [], finishingEffects: [] },
            dimensions: 'Standard Dimensions',
            substrate: 'Premium Board',
            bleed: '3.0mm',
            tolerance: '±0.25mm',
            barcodeVerified: true
          }),
          status: 'approved',
          signOff: {
            ...payload,
            signedAt,
            approvalCertificateId: certId
          }
        },
        timeline: [
          {
            key: `proof-approved-${Date.now()}`,
            label: 'Client Proof Approved & Signed',
            timestamp: signedAt,
            description: `Digitally authorized by ${payload.signedBy}. Certificate: ${certId}`,
            location: 'NasPack Client Digital Portal (Qatar)',
            isCompleted: true,
            isCurrent: false
          },
          ...o.timeline
        ]
      };
      updatedOrder = updated;
      return updated;
    }
    return o;
  });

  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
  return {
    success: true,
    order: updatedOrder || next[0],
    certificateId: certId
  };
};

export interface RevisionsPayload {
  requestedBy: string;
  feedback: string;
  annotations: any[];
}

export const requestProofRevisionsApi = async (
  trackingNumber: string,
  payload: RevisionsPayload
): Promise<{ success: boolean; order: Order }> => {
  try {
    const res = await fetch(`/api/orders/${trackingNumber}/proof/revisions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      const existing = await fetchOrders();
      const next = existing.map(o => o.trackingNumber === data.order.trackingNumber ? data.order : o);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
      return { success: true, order: data.order };
    }
  } catch (err) {
    console.warn('Backend revisions request failed, applying local fallback', err);
  }

  // Local fallback
  const existing = await fetchOrders();
  const requestedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) + ' (AST Doha)';

  let updatedOrder: Order | null = null;
  const next = existing.map(o => {
    if (o.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()) {
      const updated: Order = {
        ...o,
        currentMilestone: 'Client Requested Pre-Press Design Adjustments',
        proof: {
          ...(o.proof || {
            proofId: `PRF-${o.trackingNumber}-V1`,
            version: 'v1.0',
            status: 'revisions_requested',
            artworkImageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1400&q=85',
            colorSpecs: { cmyk: 'Euroscale', pantone: [], finishingEffects: [] },
            dimensions: 'Standard Dimensions',
            substrate: 'Premium Board',
            bleed: '3.0mm',
            tolerance: '±0.25mm',
            barcodeVerified: true
          }),
          status: 'revisions_requested',
          annotations: payload.annotations,
          revisionsHistory: [
            {
              requestedAt,
              requestedBy: payload.requestedBy,
              feedback: payload.feedback,
              pinsCount: payload.annotations.length
            },
            ...(o.proof?.revisionsHistory || [])
          ]
        }
      };
      updatedOrder = updated;
      return updated;
    }
    return o;
  });

  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(next));
  return { success: true, order: updatedOrder || next[0] };
};

