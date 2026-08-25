import React from 'react';
import { LabelTemplate } from '../types/label';

interface HeaderProps {
  currentTemplate: LabelTemplate;
  projectName: string;
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
  onOpenTemplates,
  onOpenMailMerge,
  onOpenAdmin,
  onOpenCalibration,
  onSaveProject,
  onOpenPrintModal
}) => {
  return (
    <header className="flex justify-between items-center w-full px-6 py-2 h-16 bg-surface-container-lowest border-b border-outline-variant shadow-xs z-50 shrink-0">
      {/* Brand Logo & Active Preset Selector */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
            <span className="material-symbols-outlined text-[20px]">label</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary tracking-tight leading-none">LabelStudio</h1>
            <span className="text-[11px] font-mono text-on-surface-variant">{projectName}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-outline-variant"></div>

        {/* Template Badge Selector Button */}
        <button 
          onClick={onOpenTemplates}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-surface-container-low transition-colors border border-outline-variant text-sm font-medium text-on-surface-variant cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{currentTemplate.sizeCode} ({currentTemplate.widthMm}×{currentTemplate.heightMm}mm • {currentTemplate.across * currentTemplate.rows} Labels)</span>
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </button>
      </div>

      {/* Right Navigation & Action Buttons */}
      <nav className="flex items-center gap-2">
        <button 
          onClick={onOpenMailMerge}
          className="text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-emerald-600">table_chart</span>
          <span>Import CSV</span>
        </button>

        <button 
          onClick={onOpenCalibration}
          className="text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-amber-500">tune</span>
          <span>Calibration</span>
        </button>

        <button 
          onClick={onOpenAdmin}
          className="text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span>Admin Specs</span>
        </button>

        <button 
          onClick={onSaveProject}
          className="text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save</span>
        </button>

        <button 
          onClick={onOpenPrintModal}
          className="bg-primary-container text-on-primary px-4 py-2 rounded-lg text-xs font-semibold shadow-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">print</span>
          <span>Print A4 Sheet</span>
        </button>
      </nav>
    </header>
  );
};
