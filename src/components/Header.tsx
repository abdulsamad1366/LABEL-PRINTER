import React, { useState } from 'react';
import { 
  Printer, 
  FileSpreadsheet, 
  Settings, 
  Save, 
  Grid, 
  Target,
  Layers,
  LayoutGrid,
  User as UserIcon,
  LogOut,
  LogIn,
  ChevronDown,
  Shield,
  Menu
} from 'lucide-react';
import { LabelTemplate, User } from '../types/label';

interface HeaderProps {
  currentTemplate: LabelTemplate;
  projectName: string;
  activeTab: 'editor' | 'preview';
  currentUser: User | null;
  onChangeTab: (tab: 'editor' | 'preview') => void;
  onOpenTemplates: () => void;
  onOpenMailMerge: () => void;
  onOpenAdmin: () => void;
  onOpenCalibration: () => void;
  onSaveProject: () => void;
  onOpenPrintModal: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTemplate,
  projectName,
  activeTab,
  currentUser,
  onChangeTab,
  onOpenTemplates,
  onOpenMailMerge,
  onOpenAdmin,
  onOpenCalibration,
  onSaveProject,
  onOpenPrintModal,
  onOpenLogin,
  onLogout
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'AS';
  };

  const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'asamad9280';

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between text-slate-900 z-40 select-none antialiased shadow-xs">
      
      {/* 1. Left Brand & Project Title */}
      <div className="flex items-center gap-3">
        <button className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer lg:hidden">
          <Menu className="w-5 h-5" />
        </button>

        <img 
          src="/logo.png" 
          alt="LabelStudio ERP Logo" 
          className="w-9 h-9 rounded-xl object-contain shadow-2xs" 
        />
        
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-sm text-slate-900 tracking-tight leading-none">LabelStudio Pro</h1>
            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-mono font-bold rounded-md border border-blue-200">
              STITCH UI
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium block mt-0.5">{projectName}</span>
        </div>
      </div>

      {/* 2. Center Workspace Controls Toolbar */}
      <div className="hidden xl:flex items-center gap-3">
        {/* Active Template Specs Badge */}
        <button 
          onClick={onOpenTemplates}
          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{currentTemplate.sizeCode}</span>
          <span className="text-slate-400 font-normal">({currentTemplate.widthMm}×{currentTemplate.heightMm}mm • {currentTemplate.across}×{currentTemplate.rows})</span>
        </button>

        {/* View Switcher Segmented Control */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => onChangeTab('editor')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'editor' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Single Label</span>
          </button>
          <button
            onClick={() => onChangeTab('preview')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Full Sheet Preview</span>
          </button>
        </div>

        {/* Action Tools */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
          <button 
            onClick={onOpenTemplates}
            className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Grid className="w-4 h-4 text-slate-400" />
            <span>Templates</span>
          </button>

          <button 
            onClick={onOpenMailMerge}
            className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Mail Merge (CSV)</span>
          </button>

          <button 
            onClick={onOpenAdmin}
            className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Template Admin</span>
          </button>

          <button 
            onClick={onOpenCalibration}
            className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Target className="w-4 h-4 text-amber-500" />
            <span>Calibration</span>
          </button>

          <button 
            onClick={onSaveProject}
            className="px-2.5 py-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-blue-500" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* 3. Right Action Group & User Profile Dropdown */}
      <div className="flex items-center gap-3">
        
        {/* Primary Export Print Button */}
        <button
          onClick={onOpenPrintModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT / EXPORT PDF</span>
        </button>

        {/* User Account Dropdown */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
            >
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt="Avatar" className="w-7 h-7 rounded-lg object-cover" />
              ) : (
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {getInitials(currentUser.name, currentUser.email)}
                </div>
              )}
              <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate hidden sm:block">
                {displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-slate-100">
                  <span className="font-bold text-slate-900 block truncate">{currentUser.name}</span>
                  <span className="text-[11px] text-slate-400 block font-mono truncate">{currentUser.email}</span>
                </div>
                <button
                  onClick={() => { setIsUserMenuOpen(false); onLogout(); }}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>

    </header>
  );
};
