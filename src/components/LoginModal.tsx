import React, { useState } from 'react';
import { User } from '../types/label';
import { LogIn, UserPlus, Shield, Sparkles, X, Lock, Mail, User as UserIcon, Database } from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { supabaseSignIn, supabaseSignUp, isSupabaseConfigured } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Production Manager' | 'Label Designer'>('Production Manager');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  if (!isOpen) return null;

  const handleQuickDemoLogin = (demoType: 'admin' | 'designer') => {
    const demoUser: User = demoType === 'admin' ? {
      id: 'usr_admin_1',
      name: 'Sarah Connor',
      email: 'admin@labelstudio.com',
      role: 'Production Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    } : {
      id: 'usr_designer_1',
      name: 'Alex Rivera',
      email: 'designer@labelstudio.com',
      role: 'Label Designer',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };

    StorageManager.saveUser(demoUser);
    onLoginSuccess(demoUser);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (mode === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }

    setLoading('Authenticating...');

    try {
      if (isSupabaseConfigured) {
        if (mode === 'login') {
          const { data, error: sbErr } = await supabaseSignIn(email, password);
          if (sbErr) throw sbErr;
          if (data?.user) {
            const user: User = {
              id: data.user.id,
              name: data.user.user_metadata?.name || email.split('@')[0],
              email: data.user.email || email,
              role: data.user.user_metadata?.role || 'Production Manager'
            };
            StorageManager.saveUser(user);
            onLoginSuccess(user);
            onClose();
            return;
          }
        } else {
          const { data, error: sbErr } = await supabaseSignUp(email, password, name, role);
          if (sbErr) throw sbErr;
          if (data?.user) {
            const user: User = {
              id: data.user.id,
              name,
              email,
              role
            };
            StorageManager.saveUser(user);
            onLoginSuccess(user);
            onClose();
            return;
          }
        }
      }

      // Local / Offline Fallback Auth
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: mode === 'signup' ? name : (email.split('@')[0] || 'User'),
        email,
        role: mode === 'signup' ? role : 'Production Manager'
      };

      StorageManager.saveUser(newUser);
      onLoginSuccess(newUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error. Falling back to local session.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 modal-backdrop">
      <div className="bg-stitch-panel rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-stitch-border text-stitch-text">
        
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-stitch-border flex items-center justify-between bg-stitch-bg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              LS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">LabelStudio Account</h2>
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded flex items-center gap-1 border ${
                  isSupabaseConfigured ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  <Database className="w-3 h-3" />
                  {isSupabaseConfigured ? 'Supabase Active' : 'Offline Session'}
                </span>
              </div>
              <p className="text-xs text-stitch-muted">Sign in to save and sync label ERP templates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stitch-muted hover:text-white rounded-lg hover:bg-stitch-card transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Logins Callout */}
        <div className="p-6 space-y-5">
          <div className="bg-stitch-card border border-stitch-border rounded-xl p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-stitch-muted uppercase tracking-wider block">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2.5 bg-stitch-bg hover:bg-slate-800 border border-blue-500/30 hover:border-blue-500 rounded-lg text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-white group-hover:text-blue-400">
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>Production Manager</span>
                </div>
                <span className="text-[10px] text-stitch-muted block mt-0.5 font-mono">admin@labelstudio.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('designer')}
                className="p-2.5 bg-stitch-bg hover:bg-slate-800 border border-teal-500/30 hover:border-teal-500 rounded-lg text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-1.5 font-bold text-xs text-white group-hover:text-teal-400">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Label Designer</span>
                </div>
                <span className="text-[10px] text-stitch-muted block mt-0.5 font-mono">designer@labelstudio.com</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-stitch-bg p-1 rounded-xl border border-stitch-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'login' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'signup' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {error && (
            <div className="p-2.5 bg-red-950/40 border border-red-800/50 rounded-lg text-xs text-red-400 font-medium">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-stitch-muted mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stitch-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-9 pr-3 py-2 bg-stitch-bg border border-stitch-border rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-stitch-muted mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stitch-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 bg-stitch-bg border border-stitch-border rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stitch-muted mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stitch-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-stitch-bg border border-stitch-border rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-stitch-muted mb-1 uppercase tracking-wider">
                  Select Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'Production Manager' | 'Label Designer')}
                  className="w-full px-3 py-2 bg-stitch-bg border border-stitch-border rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Production Manager">Production Manager</option>
                  <option value="Label Designer">Label Designer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={Boolean(loading)}
              className="w-full py-2.5 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {loading || (mode === 'login' ? 'Sign In with Supabase' : 'Create Supabase Account')}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stitch-border bg-stitch-bg flex items-center justify-between text-xs text-stitch-muted">
          <span>Backend: {isSupabaseConfigured ? 'Supabase Auth' : 'LocalStorage Offline'}</span>
          <button onClick={onClose} className="hover:text-white underline cursor-pointer">
            Continue as Guest
          </button>
        </div>

      </div>
    </div>
  );
};
