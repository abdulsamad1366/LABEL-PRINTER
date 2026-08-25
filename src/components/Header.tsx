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
  Shield
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

  return (
    <header className="h-14 bg-stitch-bg border-b border-stitch-border px-4 flex items-center justify-between text-stitch-text z-40 select-none">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-extrabold text-xs shadow-md">
          LS
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm text-white tracking-tight leading-none">LabelStudio Pro</h1>
            <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold rounded border border-blue-500/30">
              STITCH UI
            </span>
          </div>
          <span className="text-[11px] text-stitch-muted font-medium">{projectName}</span>
        </div>

        {/* Current Active Template Badge */}
        <button 
          onClick={onOpenTemplates}
          className="ml-2 px-3 py-1 bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-full text-xs text-stitch-text flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-semibold text-white font-mono">{currentTemplate.sizeCode}</span>
          <span className="text-stitch-muted text-[11px]">({currentTemplate.widthMm}×{currentTemplate.heightMm}mm • {currentTemplate.across}×{currentTemplate.rows})</span>
        </button>

        {/* View Switcher Segmented Control */}
        <div className="ml-3 flex items-center gap-1 bg-stitch-panel border border-stitch-border p-1 rounded-lg">
          <button
            onClick={() => onChangeTab('editor')}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'editor' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Single Label</span>
          </button>
          <button
            onClick={() => onChangeTab('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Full Sheet Preview</span>
          </button>
        </div>
      </div>

      {/* Header Action Buttons & User Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTemplates}
          className="px-3 py-1.5 text-xs font-semibold text-stitch-text hover:text-white bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Select label sheet template"
        >
          <Grid className="w-3.5 h-3.5 text-blue-400" />
          <span>Templates</span>
        </button>

        <button
          onClick={onOpenMailMerge}
          className="px-3 py-1.5 text-xs font-semibold text-stitch-text hover:text-white bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Upload CSV for mail merge"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
          <span>Mail Merge (CSV)</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="px-3 py-1.5 text-xs font-semibold text-stitch-text hover:text-white bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Create/edit custom template specs"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Template Admin</span>
        </button>

        <button
          onClick={onOpenCalibration}
          className="px-3 py-1.5 text-xs font-semibold text-stitch-text hover:text-white bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Adjust printer offset calibration"
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Calibration</span>
        </button>

        <button
          onClick={onSaveProject}
          className="px-3 py-1.5 text-xs font-semibold text-stitch-text hover:text-white bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Save project locally"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        <button
          onClick={onOpenPrintModal}
          className="ml-1 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT / EXPORT PDF</span>
        </button>

        {/* User Authentication Profile Badge */}
        <div className="ml-2 relative">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-full text-xs transition-all cursor-pointer"
              >
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-white max-w-[100px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stitch-muted mr-1" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-10 w-56 bg-stitch-panel border border-stitch-border rounded-xl shadow-2xl p-3 z-50 space-y-2">
                  <div className="pb-2 border-b border-stitch-border">
                    <span className="font-bold text-xs text-white block">{currentUser.name}</span>
                    <span className="text-[10px] font-mono text-stitch-muted block truncate">{currentUser.email}</span>
                    <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[9px] font-bold">
                      <Shield className="w-3 h-3" />
                      {currentUser.role}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-1.5 px-2 hover:bg-red-950/40 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-400 hover:text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
