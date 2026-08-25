import React from 'react';
import { 
  Printer, 
  FileSpreadsheet, 
  Settings, 
  Save, 
  Grid, 
  Target,
  FileDown
} from 'lucide-react';
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
    <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 shadow-md z-40 border-b border-slate-800">
      {/* Brand & Project Info */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-extrabold text-sm shadow">
          LS
        </div>
        <div>
          <h1 className="font-bold text-base tracking-tight leading-none text-white">LabelStudio</h1>
          <span className="text-xs text-slate-400 font-medium">{projectName}</span>
        </div>

        {/* Current Active Template Badge */}
        <button 
          onClick={onOpenTemplates}
          className="ml-3 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-white">{currentTemplate.sizeCode}</span>
          <span className="text-slate-400">({currentTemplate.widthMm}×{currentTemplate.heightMm}mm • {currentTemplate.across}×{currentTemplate.rows})</span>
        </button>
      </div>

      {/* Header Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenTemplates}
          className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Select label sheet template"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Templates</span>
        </button>

        <button
          onClick={onOpenMailMerge}
          className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Upload CSV for mail merge"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Mail Merge (CSV)</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Create/edit custom template specs"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Template Admin</span>
        </button>

        <button
          onClick={onOpenCalibration}
          className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Adjust printer offset calibration"
        >
          <Target className="w-3.5 h-3.5 text-amber-400" />
          <span>Calibration</span>
        </button>

        <button
          onClick={onSaveProject}
          className="px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Save project locally"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        <button
          onClick={onOpenPrintModal}
          className="ml-2 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>PRINT / EXPORT PDF</span>
        </button>
      </div>
    </header>
  );
};
