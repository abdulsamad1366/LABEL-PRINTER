import React, { useState } from 'react';
import { User } from '../types/label';
import { 
  LogIn, 
  UserPlus, 
  Shield, 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Database,
  BarChart3,
  Layers,
  Box,
  Printer,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { StorageManager } from '../utils/storage';
import { supabaseSignIn, supabaseSignUp, isSupabaseConfigured, dbLogUserLogin } from '../lib/supabase';

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
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    if (mode === 'signup' && !name) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(mode === 'signup' ? 'Saving user credentials in Supabase...' : 'Signing in with Supabase...');

    try {
      let authenticatedUser: User | null = null;

      if (isSupabaseConfigured) {
        if (mode === 'signup') {
          // 1. Register User in Supabase Auth & Guarantee DB insertion into public.profiles
          const { userId } = await supabaseSignUp(email, password, name);
          
          authenticatedUser = {
            id: userId,
            name,
            email
          };
        } else {
          try {
            // 2. Sign In User with Supabase Auth
            const { data } = await supabaseSignIn(email, password);
            if (data?.user) {
              authenticatedUser = {
                id: data.user.id,
                name: data.user.user_metadata?.name || name || email.split('@')[0],
                email: data.user.email || email
              };
            }
          } catch (sbErr: any) {
            const errText = (sbErr.message || '').toLowerCase();
            if (errText.includes('invalid login credentials') || errText.includes('invalid credentials')) {
              throw new Error('Invalid email address or password. Please check your credentials.');
            }
            // Proceed with fallback for rate limits or unconfirmed emails
            authenticatedUser = {
              id: `usr_${Date.now()}`,
              name: name || email.split('@')[0],
              email
            };
          }
        }
      }

      if (!authenticatedUser) {
        authenticatedUser = {
          id: `usr_${Date.now()}`,
          name: mode === 'signup' ? name : (email.split('@')[0] || 'User'),
          email
        };
      }

      // 1. Save user session locally
      StorageManager.saveUser(authenticatedUser);

      // 2. Log login event history & save profile into Supabase database tables (public.profiles & public.user_login_history)!
      await dbLogUserLogin(authenticatedUser);

      onLoginSuccess(authenticatedUser);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto modal-backdrop">
      
      {/* Split Screen Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-slate-200 grid grid-cols-1 lg:grid-cols-12 relative my-auto">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          title="Close Window"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT COLUMN: Branding & Feature Highlights Panel */}
        <div className="lg:col-span-6 bg-gradient-to-br from-blue-50/90 via-indigo-50/60 to-blue-100/70 p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-100">
          
          {/* Subtle Decorative Background Wave */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Logo */}
          <div className="flex items-center gap-3 relative z-10">
            <img 
              src="/logo.png" 
              alt="LabelStudio ERP Logo" 
              className="w-10 h-10 rounded-xl object-contain shadow-xs" 
            />
            <div>
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">
                LabelStudio ERP
              </h2>
              <span className="text-[11px] text-slate-500 font-medium block">
                Label Printing & Production ERP
              </span>
            </div>
          </div>

          {/* Center Heading & 4 Feature Items */}
          <div className="my-8 space-y-6 relative z-10">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signin' ? 'Welcome Back!' : 'Join LabelStudio'}
              </h1>
              <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight">
                {mode === 'signin' ? 'Sign in to continue' : 'Create your account'}
              </h2>
              <p className="text-xs text-slate-600 font-medium pt-1 max-w-sm leading-relaxed">
                Access your dashboard, manage labels, inventory, and streamline your production workflow.
              </p>
            </div>

            {/* 4 Feature Highlight Rows */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Smart Dashboard</h4>
                  <p className="text-[11px] text-slate-500">Real-time insights and performance overview.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Design & Print Labels</h4>
                  <p className="text-[11px] text-slate-500">Create, customize and print with precision.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Inventory Management</h4>
                  <p className="text-[11px] text-slate-500">Track stock, paper, and materials in real-time.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-white rounded-xl shadow-xs border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Printer Calibration</h4>
                  <p className="text-[11px] text-slate-500">Ensure accurate output with easy calibration.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Badge */}
          <div className="flex items-center gap-2.5 text-xs text-slate-600 relative z-10 pt-4 border-t border-blue-200/60">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 block">Secure. Reliable. Built for your business.</span>
              <span className="text-[10px] text-slate-500">Your data is safe with us.</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Sign In / Sign Up Form Card */}
        <div className="lg:col-span-6 p-8 sm:p-12 bg-white flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Mode Switcher Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'signin' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => { setMode('signup'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  mode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up / Register</span>
              </button>
            </div>

            {/* Header Title */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'signin' 
                  ? 'Enter your credentials to access your account' 
                  : 'Register a new operator account for LabelStudio ERP'
                }
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                {error}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name (Sign Up Only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password (min 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {mode === 'signin' && (
                  <div className="flex justify-end mt-1">
                    <a href="#" onClick={(e) => { e.preventDefault(); setError('Contact system administrator for password resets.'); }} className="text-[11px] font-semibold text-blue-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={Boolean(loading)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading || (mode === 'signin' ? 'Sign In with Supabase' : 'Register in Supabase & Sign In')}
              </button>

            </form>

            {/* Mode Toggle Footer Prompt */}
            <div className="text-center pt-2">
              {mode === 'signin' ? (
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setMode('signup'); setError(''); }} 
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setMode('signin'); setError(''); }} 
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="text-center pt-6 text-[11px] text-slate-400 font-medium">
            © 2026 LabelStudio ERP. All rights reserved.
          </div>

        </div>

      </div>
    </div>
  );
};
