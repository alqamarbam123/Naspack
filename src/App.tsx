import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Page, Theme, Project, Order, AdminUser } from './types';
import { PROJECTS_DATA } from './data/projectsData';
import { SAMPLE_ORDERS } from './data/ordersData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { PortfolioView } from './components/PortfolioView';
import { ServicesView } from './components/ServicesView';
import { PackagingStudioView } from './components/PackagingStudioView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { ProjectModal } from './components/ProjectModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminPortalView } from './components/AdminPortalView';
import { ClientProofPortalView } from './components/ClientProofPortalView';
import { 
  fetchProjects, 
  saveProject, 
  deleteProject, 
  resetProjectsCatalog, 
  fetchOrders, 
  saveOrder, 
  deleteOrder, 
  signOffProofApi,
  requestProofRevisionsApi,
  getStoredAuth, 
  logoutAdmin 
} from './services/api';
import { Phone, MessageSquare, ExternalLink, Search, Lock, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  // Theme state: defaults to dark or light based on localStorage/prefers-color-scheme
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('naspack_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'dark'; // Elegant dark mode default for luxury packaging
  });

  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [prefilledQuoteService, setPrefilledQuoteService] = useState<string>('');
  const [trackingInitialQuery, setTrackingInitialQuery] = useState<string>('NP-QA-8941');

  // Admin & Data persistence state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => getStoredAuth());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  // Synchronize theme class on HTML element
  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('naspack_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Load backend or persisted data on application mount
  useEffect(() => {
    let isMounted = true;
    const loadAppData = async () => {
      try {
        const [loadedProjects, loadedOrders] = await Promise.all([
          fetchProjects(),
          fetchOrders()
        ]);
        if (isMounted) {
          if (loadedProjects && loadedProjects.length > 0) {
            setProjects(loadedProjects);
          }
          if (loadedOrders && loadedOrders.length > 0) {
            setOrders(loadedOrders);
          }
        }
      } catch (err) {
        console.warn('Initial project/order fetch completed with local cache fallback');
      }
    };

    loadAppData();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleInquireProject = (project: Project) => {
    setPrefilledQuoteService(`${project.title} (${project.packagingType})`);
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectServiceForQuote = (serviceTitle: string) => {
    setPrefilledQuoteService(serviceTitle);
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchOrder = (trackingId: string) => {
    setTrackingInitialQuery(trackingId);
    setCurrentPage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Project CRUD
  const handleSaveProject = async (projectData: Partial<Project>, isNew: boolean) => {
    const saved = await saveProject(projectData, isNew);
    setProjects(prev => {
      if (isNew) {
        return [saved, ...prev.filter(p => p.id !== saved.id)];
      }
      return prev.map(p => (p.id === saved.id ? saved : p));
    });
    // Sync active modal if inspecting same project
    setSelectedProject(prev => (prev && prev.id === saved.id ? saved : prev));
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject(null);
    }
  };

  const handleResetProjects = async () => {
    const reset = await resetProjectsCatalog();
    setProjects(reset);
  };

  // Admin Order CRUD
  const handleSaveOrder = async (orderData: Partial<Order>, isNew: boolean) => {
    const saved = await saveOrder(orderData, isNew);
    setOrders(prev => {
      const idx = prev.findIndex(o => o.trackingNumber === saved.trackingNumber);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
  };

  const handleDeleteOrder = async (trackingNumber: string) => {
    await deleteOrder(trackingNumber);
    setOrders(prev => prev.filter(o => o.trackingNumber !== trackingNumber));
  };

  // Auth
  const handleLoginSuccess = (user: AdminUser) => {
    setCurrentUser(user);
    setIsLoginModalOpen(false);
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    logoutAdmin();
    setCurrentUser(null);
    if (currentPage === 'admin') {
      setCurrentPage('home');
    }
  };

  // Direct editing of a project from portfolio or modal
  const handleEditProjectFromSite = (project: Project) => {
    setProjectToEdit(project);
    if (!currentUser) {
      setIsLoginModalOpen(true);
    } else {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddNewProjectFromSite = () => {
    setProjectToEdit(null);
    if (!currentUser) {
      setIsLoginModalOpen(true);
    } else {
      setCurrentPage('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveProofSignOff = async (
    trackingNumber: string,
    payload: {
      signedBy: string;
      jobTitle: string;
      company: string;
      email: string;
      signatureDataUrl: string;
      notes?: string;
    }
  ) => {
    const res = await signOffProofApi(trackingNumber, payload);
    if (res.success) {
      setOrders(prev => prev.map(o => o.trackingNumber === res.order.trackingNumber ? res.order : o));
    }
    return res;
  };

  const handleRequestRevisions = async (
    trackingNumber: string,
    payload: {
      requestedBy: string;
      feedback: string;
      annotations: any[];
    }
  ) => {
    const res = await requestProofRevisionsApi(trackingNumber, payload);
    if (res.success) {
      setOrders(prev => prev.map(o => o.trackingNumber === res.order.trackingNumber ? res.order : o));
    }
    return res;
  };

  const handleNavigateToProof = (trackingNumber?: string) => {
    if (trackingNumber) {
      setTrackingInitialQuery(trackingNumber);
    }
    setCurrentPage('proof');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-amber-500 selection:text-white transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        isAdmin={!!currentUser}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Admin Mode Bar indicator when logged in */}
      {currentUser && currentPage !== 'admin' && (
        <div className="bg-amber-500 text-neutral-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shadow-sm z-30">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <ShieldCheck className="w-4 h-4 text-neutral-950" />
            <span>Admin Active ({currentUser.name})</span>
            <span className="opacity-50">|</span>
            <span className="hidden sm:inline font-normal">Direct design editing & live catalog modification enabled</span>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => handleNavigate('admin')}
                className="px-2.5 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-[11px] transition-colors cursor-pointer"
              >
                Go to Admin Studio
              </button>
              <button
                onClick={handleLogout}
                className="px-2 py-0.5 rounded bg-black/10 hover:bg-black/20 text-neutral-950 font-medium text-[11px] transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Router with Motion Transitions */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {currentPage === 'home' && (
              <HomeView
                projects={projects}
                onNavigate={handleNavigate}
                onOpenProject={handleOpenProject}
                onSearchOrder={handleSearchOrder}
              />
            )}

            {currentPage === 'portfolio' && (
              <PortfolioView
                projects={projects}
                isAdmin={!!currentUser}
                onOpenProject={handleOpenProject}
                onRequestQuote={() => handleNavigate('contact')}
                onEditProject={handleEditProjectFromSite}
                onAddNewProject={handleAddNewProjectFromSite}
              />
            )}

            {currentPage === 'services' && (
              <ServicesView
                onSelectServiceForQuote={handleSelectServiceForQuote}
                onNavigateToStudio={() => handleNavigate('studio')}
              />
            )}

            {currentPage === 'studio' && (
              <PackagingStudioView
                onSendToQuote={handleSelectServiceForQuote}
                onNavigateToTracking={handleSearchOrder}
              />
            )}

            {currentPage === 'proof' && (
              <ClientProofPortalView
                orders={orders}
                initialTrackingNumber={trackingInitialQuery}
                onSaveProofSignOff={handleSaveProofSignOff}
                onRequestRevisions={handleRequestRevisions}
                onNavigateToTracking={handleSearchOrder}
                onNavigateToContact={() => handleNavigate('contact')}
              />
            )}

            {currentPage === 'tracking' && (
              <OrderTrackingView
                initialSearchQuery={trackingInitialQuery}
                onNavigateToQuote={() => handleNavigate('contact')}
                onNavigateToProof={handleNavigateToProof}
              />
            )}

            {currentPage === 'about' && (
              <AboutView
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'contact' && (
              <ContactView
                prefilledService={prefilledQuoteService}
                onNavigateToTracking={handleSearchOrder}
              />
            )}

            {currentPage === 'admin' && (
              currentUser ? (
                <AdminPortalView
                  currentUser={currentUser}
                  projects={projects}
                  orders={orders}
                  initialProjectToEdit={projectToEdit}
                  onSaveProject={handleSaveProject}
                  onDeleteProject={handleDeleteProject}
                  onResetProjects={handleResetProjects}
                  onSaveOrder={handleSaveOrder}
                  onDeleteOrder={handleDeleteOrder}
                  onLogout={handleLogout}
                  onNavigateToPublic={(page) => handleNavigate((page as Page) || 'home')}
                  onOpenProjectModal={handleOpenProject}
                />
              ) : (
                <div className="max-w-md mx-auto my-20 p-8 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-6 shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Admin Authentication Required</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Sign in to edit your product designs, customize finishes, upload photography, and oversee live production orders.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-left text-xs space-y-1">
                    <div className="font-semibold text-neutral-800 dark:text-neutral-200">Demo Administrator Credentials:</div>
                    <div className="text-neutral-500 dark:text-neutral-400">Email: <span className="text-amber-600 dark:text-amber-400 font-mono">admin@naspack.qa</span></div>
                    <div className="text-neutral-500 dark:text-neutral-400">Password: <span className="text-amber-600 dark:text-amber-400 font-mono">naspack2026</span></div>
                  </div>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    Open Admin Sign In Modal
                  </button>
                  <button
                    onClick={() => handleNavigate('home')}
                    className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    Return to Public Website
                  </button>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onSearchOrder={handleSearchOrder}
      />

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        isAdmin={!!currentUser}
        onClose={() => setSelectedProject(null)}
        onInquireProject={handleInquireProject}
        onEditProject={handleEditProjectFromSite}
      />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Floating Qatar Direct Assistance Widget */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        <a
          href="https://wa.me/97477315415?text=Hello%20NasPack%20Qatar%2C%20I%20would%20like%20to%20inquire%20about%20packaging%20services."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
          title="Direct WhatsApp: +974 77315415"
        >
          <MessageSquare className="w-4 h-4 text-white" />
          <span className="text-xs font-bold tracking-wide">
            WhatsApp 77315415
          </span>
        </a>

        <a
          href="tel:+97477315415"
          className="group hidden sm:flex items-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 px-3.5 py-2 rounded-full shadow-md text-xs font-semibold hover:opacity-90 transition-opacity"
          title="Direct Phone Call: 77315415"
        >
          <Phone className="w-3.5 h-3.5 text-amber-500 dark:text-amber-600" />
          <span>Call: +974 77315415</span>
        </a>
      </div>
    </div>
  );
}
