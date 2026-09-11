import React, { useState } from 'react';
import { Page, Theme } from '../types';
import { Logo } from './Logo';
import { 
  Sun, 
  Moon, 
  Phone, 
  Menu, 
  X, 
  Package, 
  Search, 
  Layers, 
  Briefcase, 
  Info, 
  Mail,
  ArrowRight,
  Box,
  Lock,
  ShieldCheck,
  FileCheck
} from 'lucide-react';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  theme: Theme;
  onToggleTheme: () => void;
  onOpenQuickTrack?: () => void;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  theme,
  onToggleTheme,
  onOpenQuickTrack,
  isAdmin = false,
  onOpenAdminLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { page: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { page: 'home', label: 'Home', icon: Layers },
    { page: 'portfolio', label: 'Portfolio & Work', icon: Briefcase },
    { page: 'services', label: 'Services & Co-Packing', icon: Package },
    { page: 'studio', label: '3D Studio & Tech', icon: Box },
    { page: 'proof', label: 'Proof Sign-Off', icon: FileCheck },
    { page: 'tracking', label: 'Order Tracking', icon: Search },
    { page: 'about', label: 'About & Studio', icon: Info },
    { page: 'contact', label: 'Contact & Quote', icon: Mail }
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200 backdrop-blur-md bg-white/90 dark:bg-neutral-950/90 border-b border-neutral-200/80 dark:border-neutral-800/80">
      {/* Top micro-bar for Qatar contact & quick tracking */}
      <div className="hidden sm:block border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/70 dark:bg-neutral-900/40 text-xs py-1.5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Qatar Packaging & Contract Co-Packing Hub • Doha Zone 57
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span>Same-Day Prototyping & Bulk Contract Packaging</span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:+97477315415" 
              className="flex items-center gap-1.5 font-semibold text-neutral-900 dark:text-neutral-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              title="Call NasPack Qatar directly"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Direct: +974 77315415</span>
            </a>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button 
              onClick={() => handleNavClick('tracking')}
              className="text-xs text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Search className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Live Order Tracker</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button 
              onClick={() => handleNavClick('proof')}
              className="text-xs text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <FileCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Proof Sign-Off</span>
            </button>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <button 
              onClick={() => {
                if (isAdmin) {
                  handleNavClick('admin');
                } else if (onOpenAdminLogin) {
                  onOpenAdminLogin();
                } else {
                  handleNavClick('admin');
                }
              }}
              className="text-xs text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>{isAdmin ? 'Admin Studio' : 'Admin Login'}</span>
              {isAdmin && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="brand-logo-btn"
          onClick={() => handleNavClick('home')}
          className="group focus:outline-none cursor-pointer py-1"
        >
          <Logo variant="header" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.page;
            return (
              <button
                key={item.page}
                id={`nav-link-${item.page}`}
                onClick={() => handleNavClick(item.page)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer relative ${
                  isActive
                    ? 'text-neutral-950 dark:text-white bg-neutral-100/90 dark:bg-neutral-800/80 font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900'
                }`}
              >
                {item.label}
                {item.page === 'studio' && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    3D
                  </span>
                )}
                {item.page === 'tracking' && (
                  <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse align-middle" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-600 dark:bg-amber-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Quick Order Tracking shortcut button */}
          <button
            id="quick-track-nav-btn"
            onClick={() => handleNavClick('tracking')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500/50 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-all cursor-pointer"
            title="Track customer order progress"
          >
            <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Track Order</span>
          </button>

          {/* Quick quote / contact button */}
          <button
            id="get-quote-nav-btn"
            onClick={() => handleNavClick('contact')}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <span>Request Quote</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Admin Studio Quick Entry */}
          <button
            id="nav-admin-portal-btn"
            onClick={() => {
              if (isAdmin) {
                handleNavClick('admin');
              } else if (onOpenAdminLogin) {
                onOpenAdminLogin();
              } else {
                handleNavClick('admin');
              }
            }}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              isAdmin
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:bg-amber-500/25'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500/40'
            }`}
            title="Edit product designs and manage orders"
          >
            <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{isAdmin ? 'Admin Studio' : 'Admin'}</span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle dark/light mode"
            className="p-2.5 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-neutral-700 transition-transform rotate-0 hover:-rotate-12" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="p-3 mb-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <div className="text-xs text-neutral-500 dark:text-neutral-400">Direct Qatar Hotline</div>
            <a 
              href="tel:+97477315415" 
              className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2 mt-0.5 text-amber-600 dark:text-amber-400"
            >
              <Phone className="w-4 h-4" />
              +974 77315415
            </a>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`mobile-nav-${item.page}`}
                  onClick={() => handleNavClick(item.page)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.page === 'studio' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30">
                      3D Lab
                    </span>
                  )}
                  {item.page === 'tracking' && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/30">
                      Live
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('tracking')}
              className="py-2.5 px-3 rounded-lg text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white text-center border border-neutral-200 dark:border-neutral-700"
            >
              Track Order
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="py-2.5 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white text-center"
            >
              Get a Quote
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                if (isAdmin) {
                  handleNavClick('admin');
                } else if (onOpenAdminLogin) {
                  setMobileMenuOpen(false);
                  onOpenAdminLogin();
                } else {
                  handleNavClick('admin');
                }
              }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Open Admin Studio & Orders' : 'Admin Login / Edit Designs'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
