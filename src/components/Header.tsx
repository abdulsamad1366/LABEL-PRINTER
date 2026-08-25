import React from 'react';
import { 
  Printer, 
  FileSpreadsheet, 
  Settings, 
  Save, 
  Grid, 
  Target,
  Layers,
  LayoutGrid
} from 'lucide-react';
import { LabelTemplate } from '../types/label';

interface HeaderProps {
  currentTemplate: LabelTemplate;
  projectName: string;
  activeTab?: 'editor' | 'preview';
  onChangeTab?: (tab: 'editor' | 'preview') => void;
  onOpenTemplates: () => void;
  onOpenMailMerge: () => void;
  onOpenAdmin: () => void;
  onOpenCalibration: () => void;
  onSaveProject: () => void;
  onOpenPrintModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTemplate,
  projectName,
  activeTab,
  onChangeTab,
  onOpenTemplates,
  onOpenMailMerge,
  onOpenAdmin,
  onOpenCalibration,
  onSaveProject,
  onOpenPrintModal
}) => {
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
            onClick={() => onChangeTab?.('editor')}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'editor' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Single Label</span>
          </button>
          <button
            onClick={() => onChangeTab?.('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'preview' ? 'bg-blue-600 text-white shadow-xs' : 'text-stitch-muted hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Full Sheet Preview</span>
          </button>
        </div>
      </div>

      {/* Header Action Buttons */}
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
          className="ml-2 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT / EXPORT PDF</span>
        </button>
      </div>
    </header>
  );
};
