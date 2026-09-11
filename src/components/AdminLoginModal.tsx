import React, { useState } from 'react';
import { AdminUser } from '../types';
import { loginAdmin } from '../services/api';
import { 
  X, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginAdmin(email, password);
      if (result.success && result.user) {
        onLoginSuccess(result.user);
        onClose();
      } else {
        setErrorMessage(result.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login encountered an unexpected error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutofillDemo = () => {
    setEmail('admin@naspack.qa');
    setPassword('naspack2026');
    setErrorMessage(null);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top brand header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-neutral-900 dark:text-white">
                Admin Management Portal
              </h3>
              <p className="text-[11px] text-neutral-500">
                NasPack Qatar Product & Catalog Studio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Demo Credentials Chip */}
          <div className="p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Default Admin Credentials:
              </span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-neutral-950 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Auto-Fill
              </button>
            </div>
            <div className="font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
              <div>Email: <strong className="text-neutral-900 dark:text-white">admin@naspack.qa</strong></div>
              <div>Password: <strong className="text-neutral-900 dark:text-white">naspack2026</strong></div>
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Admin Email or Username
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@naspack.qa"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            id="admin-login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-amber-500/20"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Studio</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="px-6 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-800 text-center">
          <p className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Full CRUD control: Add/edit product designs, specifications, and orders</span>
          </p>
        </div>
      </div>
    </div>
  );
};
