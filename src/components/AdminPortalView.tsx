import React, { useState, useEffect } from 'react';
import { Project, Order, ProjectCategory, AdminUser } from '../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Eye, 
  LogOut, 
  Layers, 
  Box, 
  Truck, 
  Sparkles, 
  Save, 
  X, 
  ArrowLeft, 
  ExternalLink,
  RotateCcw,
  Tag,
  MapPin,
  Calendar,
  Ruler,
  Camera,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Clock,
  HelpCircle,
  FileText
} from 'lucide-react';

interface AdminPortalViewProps {
  currentUser: AdminUser;
  projects: Project[];
  orders: Order[];
  initialProjectToEdit?: Project | null;
  onSaveProject: (project: Partial<Project>, isNew: boolean) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onResetProjects: () => Promise<void>;
  onSaveOrder: (order: Partial<Order>, isNew: boolean) => Promise<void>;
  onDeleteOrder: (trackingNumber: string) => Promise<void>;
  onLogout: () => void;
  onNavigateToPublic: (page?: string) => void;
  onOpenProjectModal: (project: Project) => void;
}

const SAMPLE_IMAGE_PRESETS = [
  { label: 'Luxury Oud Flacon Box', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Black Magnetic Rigid Box', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gourmet Stand-Up Pouch', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Minimalist Skincare Carton', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Eco-Friendly Kraft Packaging', url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Artisanal Chocolatier Box', url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Gold Embossed Perfume Box', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Automated Co-Packing Line', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80' }
];

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  currentUser,
  projects,
  orders,
  initialProjectToEdit,
  onSaveProject,
  onDeleteProject,
  onResetProjects,
  onSaveOrder,
  onDeleteOrder,
  onLogout,
  onNavigateToPublic,
  onOpenProjectModal
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'orders' | 'help'>('projects');
  const [searchProject, setSearchProject] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Project editing state
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isNewProject, setIsNewProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({});
  const [galleryInputs, setGalleryInputs] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Order editing state
  const [searchOrder, setSearchOrder] = useState('');
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [isNewOrder, setIsNewOrder] = useState(false);
  const [orderFormData, setOrderFormData] = useState<Partial<Order>>({});

  // Reset confirmation state
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Filtered projects
  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const q = searchProject.toLowerCase();
    const matchesQuery = 
      p.title.toLowerCase().includes(q) ||
      p.client.toLowerCase().includes(q) ||
      p.packagingType.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const q = searchOrder.toLowerCase();
    return (
      o.trackingNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.company.toLowerCase().includes(q) ||
      o.status.toLowerCase().includes(q)
    );
  });

  // Open project form for new design
  const handleAddNewProject = () => {
    setIsNewProject(true);
    setProjectFormData({
      id: '',
      title: '',
      category: 'luxury',
      client: '',
      location: 'Doha, Qatar',
      year: new Date().getFullYear().toString(),
      description: '',
      detailedStory: '',
      primaryImage: SAMPLE_IMAGE_PRESETS[0].url,
      galleryImages: [SAMPLE_IMAGE_PRESETS[0].url],
      tags: ['Bespoke Box', 'Made in Qatar', 'Rigid Packaging'],
      packagingType: 'Shoulder & Neck Magnetic Rigid Box',
      finishDetails: 'Soft-Touch Velvet Matte + 24k Gold Kurz Hot Foil Stamping',
      dimensions: '180mm x 180mm x 70mm',
      photographyCredits: 'Studio NasPack Qatar Commercial Unit',
      isFeatured: true
    });
    setGalleryInputs([SAMPLE_IMAGE_PRESETS[0].url]);
    setTagInput('');
    setIsEditingProject(true);
  };

  // Open project form for editing existing design
  const handleEditProject = (project: Project) => {
    setIsNewProject(false);
    setProjectFormData({ ...project });
    setGalleryInputs(project.galleryImages || [project.primaryImage]);
    setTagInput('');
    setIsEditingProject(true);
  };

  // Automatically open edit form if initialProjectToEdit is provided
  useEffect(() => {
    if (initialProjectToEdit) {
      setActiveTab('projects');
      handleEditProject(initialProjectToEdit);
    }
  }, [initialProjectToEdit]);

  // Clone project
  const handleDuplicateProject = (project: Project) => {
    setIsNewProject(true);
    setProjectFormData({
      ...project,
      id: '',
      title: `${project.title} (Copy)`,
      client: `${project.client} Variant`,
      isFeatured: false
    });
    setGalleryInputs(project.galleryImages || [project.primaryImage]);
    setTagInput('');
    setIsEditingProject(true);
  };

  // Submit project form
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectFormData.title) {
      alert('Product title is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload: Partial<Project> = {
        ...projectFormData,
        galleryImages: galleryInputs.filter((url) => url.trim().length > 0),
        primaryImage: projectFormData.primaryImage || galleryInputs[0] || SAMPLE_IMAGE_PRESETS[0].url
      };

      await onSaveProject(payload, isNewProject);
      setIsEditingProject(false);
      setSaveSuccessMsg(`Product "${payload.title}" saved successfully!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Error saving project: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete project confirmation
  const handleDeleteProjectClick = async (p: Project) => {
    if (confirm(`Are you sure you want to permanently delete "${p.title}" from the catalog?`)) {
      await onDeleteProject(p.id);
    }
  };

  // Order Handlers
  const handleAddNewOrder = () => {
    setIsNewOrder(true);
    const tracking = `NP-QA-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderFormData({
      trackingNumber: tracking,
      customerName: '',
      company: '',
      phone: '77315415',
      email: '',
      destinationCity: 'Doha, Qatar',
      orderDate: new Date().toISOString().split('T')[0],
      estimatedDelivery: 'In 5-7 Business Days',
      status: 'In Production',
      progressPercentage: 45,
      currentMilestone: 'Precision Hot Foil Stamping & Assembly',
      items: [
        {
          id: 'item-1',
          name: 'Custom Luxury Rigid Boxes',
          quantity: 2000,
          specs: '1400gsm Board + Matte Soft-Touch Slate'
        }
      ],
      packagingSpecs: {
        boxStyle: 'Book-Style Magnetic Catch',
        material: '1400gsm Dutch Greyboard',
        printFinish: '24k Kurz Gold Hot Stamping',
        batchSize: '2,000 Units'
      },
      driverOrHandler: 'NasPack Logistics Fleet Lead',
      vehiclePlate: 'QA-TRK-7731'
    });
    setIsEditingOrder(true);
  };

  const handleEditOrder = (order: Order) => {
    setIsNewOrder(false);
    setOrderFormData({ ...order });
    setIsEditingOrder(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderFormData.customerName || !orderFormData.company) {
      alert('Client Name and Company are required');
      return;
    }

    setIsSaving(true);
    try {
      await onSaveOrder(orderFormData, isNewOrder);
      setIsEditingOrder(false);
      setSaveSuccessMsg(`Order #${orderFormData.trackingNumber} updated!`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      alert(`Error saving order: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans pb-24">
      {/* Top Admin Navigation Bar */}
      <div className="sticky top-0 z-40 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-black text-base shadow-md shadow-amber-500/20">
              NP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-white text-base tracking-tight">
                  NasPack Admin Studio
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Live Backend Connected
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Logged in as <strong className="text-neutral-200">{currentUser.name}</strong> ({currentUser.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigateToPublic('portfolio')}
              className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-700"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>View Public Portfolio</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </button>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-red-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">
        {/* Success Alert Banner */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5 font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>{saveSuccessMsg}</span>
            </div>
            <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Executive Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <span className="text-xs text-neutral-400 font-medium">Product Designs In Catalog</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{projects.length}</span>
              <span className="text-xs text-amber-400 font-semibold">Live on Web</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <span className="text-xs text-neutral-400 font-medium">Active Client Production Orders</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-amber-400">{orders.length}</span>
              <span className="text-xs text-neutral-400 font-semibold">Trackable in Qatar</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <span className="text-xs text-neutral-400 font-medium">Featured Showcases</span>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-black text-white">{projects.filter(p => p.isFeatured).length}</span>
              <span className="text-xs text-neutral-400 font-semibold">Homepage Hero</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <span className="text-xs text-neutral-400 font-medium">Direct Factory Dispatch Contact</span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-emerald-400">77315415</span>
              <span className="text-xs text-neutral-400 font-semibold">Qatar Hotline</span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Product Designs & Portfolio ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Client Orders & Live Tracking ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'help'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>How To Edit Guide</span>
            </button>
          </div>

          {activeTab === 'projects' && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowResetConfirm(true)}
                className="px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-neutral-800"
                title="Reset projects to initial Qatar showcase portfolio"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Seed</span>
              </button>

              <button
                id="admin-add-product-btn"
                onClick={handleAddNewProject}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product Design</span>
              </button>
            </div>
          )}

          {activeTab === 'orders' && (
            <button
              id="admin-add-order-btn"
              onClick={handleAddNewOrder}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Production Order</span>
            </button>
          )}
        </div>

        {/* TAB 1: PRODUCT DESIGNS MANAGEMENT */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchProject}
                  onChange={(e) => setSearchProject(e.target.value)}
                  placeholder="Search product designs by name, client, or packaging style..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {['all', 'luxury', 'food', 'cosmetics', 'eco', 'co-packing', 'retail'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-neutral-950 text-neutral-400 hover:bg-neutral-800 border border-neutral-800'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Designs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden flex flex-col hover:border-neutral-700 transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-16/10 bg-neutral-900 overflow-hidden">
                    <img
                      src={project.primaryImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', SAMPLE_IMAGE_PRESETS[0].url);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-amber-400 border border-amber-500/30 backdrop-blur-xs">
                        {project.category}
                      </span>
                      {project.isFeatured && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-neutral-950">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-neutral-300">
                      <span>{project.client}</span>
                      <span>{project.year}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-heading text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-neutral-900 text-[11px] text-neutral-400">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Packaging Type:</span>
                        <span className="text-neutral-300 font-medium truncate max-w-[180px]">{project.packagingType}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Dimensions:</span>
                        <span className="text-neutral-300 font-medium">{project.dimensions}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onOpenProjectModal(project)}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="Preview Public Modal"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Preview</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleDuplicateProject(project)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
                          title="Duplicate Design"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleEditProject(project)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-500/30"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProjectClick(project)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-colors cursor-pointer border border-red-500/20"
                          title="Delete Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProjects.length === 0 && (
              <div className="py-16 text-center space-y-3 bg-neutral-950 rounded-2xl border border-neutral-800">
                <Box className="w-12 h-12 text-neutral-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No product designs match your filter</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Try clearing your search query or click "Add New Product Design" to add your bespoke work.
                </p>
                <button
                  onClick={handleAddNewProject}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold"
                >
                  Create Product Design Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLIENT PRODUCTION ORDERS & LIVE TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchOrder}
                  onChange={(e) => setSearchOrder(e.target.value)}
                  placeholder="Search orders by tracking number, client, company, or status..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="text-xs text-neutral-400">
                Showing <strong className="text-white">{filteredOrders.length}</strong> active client production orders
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-900/90 text-neutral-400 font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="px-5 py-3.5">Tracking ID</th>
                      <th className="px-5 py-3.5">Client & Company</th>
                      <th className="px-5 py-3.5">Order Status</th>
                      <th className="px-5 py-3.5">Current Production Milestone</th>
                      <th className="px-5 py-3.5">Progress</th>
                      <th className="px-5 py-3.5">Est. Delivery</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {filteredOrders.map((order) => (
                      <tr key={order.trackingNumber} className="hover:bg-neutral-900/50 transition-colors">
                        <td className="px-5 py-4 font-mono font-bold text-amber-400">
                          {order.trackingNumber}
                        </td>
                        <td className="px-5 py-4">
                          <div className="font-bold text-white">{order.customerName}</div>
                          <div className="text-[11px] text-neutral-400">{order.company}</div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : order.status === 'Out for Delivery'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-neutral-300 max-w-xs truncate">
                          {order.currentMilestone}
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-24">
                            <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                              <span>{order.progressPercentage}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full" 
                                style={{ width: `${order.progressPercentage}%` }} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-neutral-400">
                          {order.estimatedDelivery}
                        </td>
                        <td className="px-5 py-4 text-right space-x-1.5">
                          <button
                            onClick={() => onNavigateToPublic('tracking')}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                            title="Test Tracking Search in Public Portal"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete order ${order.trackingNumber}?`)) {
                                onDeleteOrder(order.trackingNumber);
                              }
                            }}
                            className="p-1 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOW TO EDIT GUIDE */}
        {activeTab === 'help' && (
          <div className="p-8 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-6 max-w-4xl">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NasPack Management Documentation</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mt-2">
                How to Edit Your Product Designs & Manage Work on this Website
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                Everything you configure here updates the live front-end immediately and persists safely in the backend.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs text-neutral-300">
              <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Box className="w-4 h-4" />
                  <span>1. Adding & Editing Product Designs</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Go to the <strong>Product Designs & Portfolio</strong> tab and click <strong>"Add New Product Design"</strong>.
                  You can specify:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-300">
                  <li><strong>Product Title & Category</strong> (Luxury Oud, Food & Gourmet, Cosmetics, Eco-Kraft, etc.)</li>
                  <li><strong>Client Name & Location</strong> in Qatar (Lusail, Doha, Industrial Area)</li>
                  <li><strong>Dimensions & Packaging Style</strong> (Rigid magnetic box, Gusseted pouch, etc.)</li>
                  <li><strong>Luxury Finishing Specs</strong> (24K Gold foil, Soft-touch matte, Embossed UV)</li>
                  <li><strong>Photos & Gallery</strong> (Use custom URLs or click preset images)</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Truck className="w-4 h-4" />
                  <span>2. Managing Production Orders & Tracking</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  When a client places an order with NasPack Qatar:
                </p>
                <ul className="list-disc list-inside space-y-1 text-neutral-300">
                  <li>Generate or edit their unique tracking number (e.g. <code>NP-QA-8941</code>)</li>
                  <li>Update their live status: <em>Received &rarr; In Production &rarr; Co-Packaging &rarr; Out for Delivery</em></li>
                  <li>Set real-time completion percentage (0-100%) and vehicle delivery details</li>
                  <li>Your clients can search this code directly in the public <strong>Order Tracking</strong> page!</li>
                </ul>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Save className="w-4 h-4" />
                  <span>3. Backend & Frontend Architecture</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  The website runs on an integrated <strong>Express + Vite full-stack backend</strong>.
                  Data is automatically stored and synced in <code>data/store.json</code> on the server with browser cache backup.
                  Any changes you save reflect immediately across the public Portfolio, Homepage showcase, and modal popups.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Eye className="w-4 h-4" />
                  <span>4. Instant Live Preview</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Click the <strong>"View Public Portfolio"</strong> button at any time in the top-right corner to see how your newly added packaging looks to prospective clients. You can always return to the Admin Portal using the top Admin link.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================== */}
      {/* PRODUCT DESIGN EDIT / CREATE MODAL         */}
      {/* ========================================== */}
      {isEditingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  {isNewProject ? <Plus className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {isNewProject ? 'Add New Product Design' : `Edit Product: ${projectFormData.title}`}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Saves to live catalog & backend database
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditingProject(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleProjectSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-semibold text-neutral-300">Product Title *</label>
                  <input
                    type="text"
                    value={projectFormData.title || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                    placeholder="e.g. Royal Oud Al-Qasr Presentation Box"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Category *</label>
                  <select
                    value={projectFormData.category || 'luxury'}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value as ProjectCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="luxury">Luxury & Oud Boxes</option>
                    <option value="food">Food & Hospitality</option>
                    <option value="cosmetics">Cosmetics & Skincare</option>
                    <option value="eco">Sustainable Kraft</option>
                    <option value="co-packing">Co-Packaging Lines</option>
                    <option value="retail">Retail & Fashion</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Client & Location & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Client / Brand Name</label>
                  <input
                    type="text"
                    value={projectFormData.client || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, client: e.target.value })}
                    placeholder="e.g. Al Noor Parfums Qatar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Location</label>
                  <input
                    type="text"
                    value={projectFormData.location || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, location: e.target.value })}
                    placeholder="Doha, Qatar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Production Year</label>
                  <input
                    type="text"
                    value={projectFormData.year || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, year: e.target.value })}
                    placeholder="2025"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Row 3: Packaging Type & Dimensions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Packaging Type / Structural Style</label>
                  <input
                    type="text"
                    value={projectFormData.packagingType || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, packagingType: e.target.value })}
                    placeholder="e.g. Magnetic Book-Style Rigid Box"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Dimensions (L x W x H)</label>
                  <input
                    type="text"
                    value={projectFormData.dimensions || ''}
                    onChange={(e) => setProjectFormData({ ...projectFormData, dimensions: e.target.value })}
                    placeholder="e.g. 180mm x 180mm x 65mm"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Finish Details */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Finishes, Inks & Tooling</label>
                <input
                  type="text"
                  value={projectFormData.finishDetails || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, finishDetails: e.target.value })}
                  placeholder="e.g. Matte Soft-Touch Lamination + 24k Gold Kurz Hot Foil Stamping + Embossed Monogram"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Short Description */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Summary Description</label>
                <textarea
                  rows={2}
                  value={projectFormData.description || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Brief summary of the packaging project for portfolio cards..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Detailed Story */}
              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Detailed Story / Technical Engineering Story</label>
                <textarea
                  rows={3}
                  value={projectFormData.detailedStory || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, detailedStory: e.target.value })}
                  placeholder="In-depth details about substrate thickness, moisture barrier, tolerance, and client requirements..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Primary Image & Preset Picker */}
              <div className="space-y-2">
                <label className="font-semibold text-neutral-300 flex items-center justify-between">
                  <span>Primary Image URL</span>
                  <span className="text-[11px] text-neutral-500 font-normal">Click a sample preset or paste your URL</span>
                </label>
                <input
                  type="url"
                  value={projectFormData.primaryImage || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, primaryImage: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-hidden focus:border-amber-500"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {SAMPLE_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setProjectFormData({ ...projectFormData, primaryImage: preset.url })}
                      className="shrink-0 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[10px] text-neutral-300 border border-neutral-700 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  id="featured-checkbox"
                  type="checkbox"
                  checked={Boolean(projectFormData.isFeatured)}
                  onChange={(e) => setProjectFormData({ ...projectFormData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 bg-neutral-950 border-neutral-800 focus:ring-amber-500"
                />
                <label htmlFor="featured-checkbox" className="font-semibold text-neutral-200 cursor-pointer">
                  Feature this product on Homepage Hero Showcase
                </label>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProject(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  id="save-product-design-btn"
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold flex items-center gap-2 shadow-md shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Product Design'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* ORDER EDIT / CREATE MODAL                  */}
      {/* ========================================== */}
      {isEditingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-white">
                    {isNewOrder ? 'Create Client Production Order' : `Edit Order: ${orderFormData.trackingNumber}`}
                  </h3>
                  <p className="text-[11px] text-neutral-400">Live Client Tracking in Qatar</p>
                </div>
              </div>
              <button onClick={() => setIsEditingOrder(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Tracking Number *</label>
                  <input
                    type="text"
                    value={orderFormData.trackingNumber || ''}
                    onChange={(e) => setOrderFormData({ ...orderFormData, trackingNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-400 font-mono font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Order Status</label>
                  <select
                    value={orderFormData.status || 'Received'}
                    onChange={(e) => setOrderFormData({ ...orderFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  >
                    <option value="Received">Received</option>
                    <option value="In Production">In Production</option>
                    <option value="Co-Packaging">Co-Packaging</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Customer Name *</label>
                  <input
                    type="text"
                    value={orderFormData.customerName || ''}
                    onChange={(e) => setOrderFormData({ ...orderFormData, customerName: e.target.value })}
                    placeholder="Sheikh / Director Name"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Company / Brand *</label>
                  <input
                    type="text"
                    value={orderFormData.company || ''}
                    onChange={(e) => setOrderFormData({ ...orderFormData, company: e.target.value })}
                    placeholder="e.g. Al Noor Parfums"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Current Production Milestone Text</label>
                <input
                  type="text"
                  value={orderFormData.currentMilestone || ''}
                  onChange={(e) => setOrderFormData({ ...orderFormData, currentMilestone: e.target.value })}
                  placeholder="e.g. Kurz 24k Gold Hot Foil Stamping on Press 3"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Progress: {orderFormData.progressPercentage || 0}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={orderFormData.progressPercentage || 0}
                    onChange={(e) => setOrderFormData({ ...orderFormData, progressPercentage: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-neutral-300">Estimated Delivery Date</label>
                  <input
                    type="text"
                    value={orderFormData.estimatedDelivery || ''}
                    onChange={(e) => setOrderFormData({ ...orderFormData, estimatedDelivery: e.target.value })}
                    placeholder="e.g. May 20, 2025"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-300">Destination Address (Qatar)</label>
                <input
                  type="text"
                  value={orderFormData.destinationCity || ''}
                  onChange={(e) => setOrderFormData({ ...orderFormData, destinationCity: e.target.value })}
                  placeholder="Lusail Marina, Doha, Qatar"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingOrder(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  {isSaving ? 'Saving...' : 'Save Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 max-w-sm space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="text-center">
              <h4 className="font-heading font-bold text-white text-base">Reset Catalog to Factory Seed?</h4>
              <p className="text-xs text-neutral-400 mt-1">
                This will restore the default NasPack Qatar portfolio projects. Any custom products you created will be replaced by the factory defaults.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowResetConfirm(false);
                  await onResetProjects();
                }}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 text-neutral-950 text-xs font-bold"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
