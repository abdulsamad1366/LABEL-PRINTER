import React from 'react';
import { 
  BarChart3, 
  Printer, 
  Layers, 
  Box, 
  FileSpreadsheet, 
  Target, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Sliders
} from 'lucide-react';
import { LabelTemplate, User } from '../types/label';

interface ERPDashboardProps {
  currentUser: User | null;
  activeTemplate: LabelTemplate;
  onNavigateToStudio: () => void;
  onNavigateToInventory: () => void;
  onOpenMailMerge: () => void;
  onOpenCalibration: () => void;
}

export const ERPDashboard: React.FC<ERPDashboardProps> = ({
  currentUser,
  activeTemplate,
  onNavigateToStudio,
  onNavigateToInventory,
  onOpenMailMerge,
  onOpenCalibration
}) => {
  return (
    <div className="p-6 md:p-8 bg-stitch-bg text-stitch-text h-full overflow-y-auto space-y-8 select-none">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-stitch-panel via-stitch-card to-stitch-panel border border-stitch-border p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold rounded-full border border-blue-500/30">
              ERP CONTROL CENTER
            </span>
            <span className="text-xs text-stitch-muted font-mono">• Active Workspace: Production</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Welcome back, {currentUser ? currentUser.name : 'Operator'}!
          </h1>
          <p className="text-xs text-stitch-muted mt-1">
            Enterprise label production suite initialized. Active template: <code className="text-blue-400 font-mono font-bold">{activeTemplate.sizeCode} ({activeTemplate.widthMm}×{activeTemplate.heightMm}mm)</code>.
          </p>
        </div>

        <button
          onClick={onNavigateToStudio}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Launch Label Studio Editor</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-stitch-panel border border-stitch-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stitch-muted uppercase tracking-wider">Print Batches</span>
            <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">128</div>
          <div className="flex items-center gap-1 text-[11px] text-teal-400 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>+14% this week</span>
          </div>
        </div>

        <div className="p-5 bg-stitch-panel border border-stitch-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stitch-muted uppercase tracking-wider">Printed Sheets</span>
            <div className="w-8 h-8 bg-teal-500/20 text-teal-400 rounded-lg flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">3,840</div>
          <div className="text-[11px] text-stitch-muted font-medium">A4 Self-Adhesive Sheets</div>
        </div>

        <div className="p-5 bg-stitch-panel border border-stitch-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stitch-muted uppercase tracking-wider">Active Catalog Size</span>
            <div className="w-8 h-8 bg-purple-500/20 text-purple-400 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white font-mono">{activeTemplate.sizeCode}</div>
          <div className="text-[11px] text-stitch-muted font-mono">{activeTemplate.across}×{activeTemplate.rows} ({activeTemplate.across * activeTemplate.rows} labels/sheet)</div>
        </div>

        <div className="p-5 bg-stitch-panel border border-stitch-border rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stitch-muted uppercase tracking-wider">Paper Stock level</span>
            <div className="w-8 h-8 bg-amber-500/20 text-amber-400 rounded-lg flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">1,450</div>
          <div className="text-[11px] text-amber-400 font-medium">Uncoated 70 (Healthy)</div>
        </div>
      </div>

      {/* Quick Access Modules */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Quick Action ERP Launchers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={onNavigateToStudio}
            className="p-5 bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-2xl cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stitch-muted group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-sm text-white">Label Design Studio</h3>
            <p className="text-xs text-stitch-muted mt-1 leading-relaxed">
              Open the 1:1 physical millimetre designer with grid snap, alignment tools, barcodes, and QR renderer.
            </p>
          </div>

          <div 
            onClick={onOpenMailMerge}
            className="p-5 bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-2xl cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-teal-600/20 text-teal-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stitch-muted group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-sm text-white">Bulk CSV Mail Merge</h3>
            <p className="text-xs text-stitch-muted mt-1 leading-relaxed">
              Import product catalogs and auto-generate sequential multi-page label sheets with variable data placeholders.
            </p>
          </div>

          <div 
            onClick={onNavigateToInventory}
            className="p-5 bg-stitch-panel hover:bg-stitch-card border border-stitch-border rounded-2xl cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-600/20 text-amber-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Box className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-stitch-muted group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-sm text-white">Materials & Stock Manager</h3>
            <p className="text-xs text-stitch-muted mt-1 leading-relaxed">
              Track paper stock across 9 paper finishes (Uncoated, Fluorescent, Gloss, Kraft, PET Translucent).
            </p>
          </div>
        </div>
      </div>

      {/* Production History Log Table */}
      <div className="bg-stitch-panel border border-stitch-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span>Recent ERP Production Batches</span>
          </h2>
          <span className="text-xs text-stitch-muted">Last updated: Just now</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stitch-text">
            <thead className="bg-stitch-bg text-stitch-muted font-mono uppercase text-[10px] border-b border-stitch-border">
              <tr>
                <th className="p-3">Job ID</th>
                <th className="p-3">Job Name</th>
                <th className="p-3">Size Code</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stitch-border">
              <tr>
                <td className="p-3 font-mono text-blue-400 font-bold">#JOB-9821</td>
                <td className="p-3 font-semibold text-white">Hardware Product Labels (PDL-90)</td>
                <td className="p-3 font-mono">18 (63.5×46.6mm)</td>
                <td className="p-3 font-mono">180 Labels (10 Sheets)</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Printed Clean
                  </span>
                </td>
                <td className="p-3 text-right text-stitch-muted font-mono">Today, 18:45</td>
              </tr>

              <tr>
                <td className="p-3 font-mono text-blue-400 font-bold">#JOB-9820</td>
                <td className="p-3 font-semibold text-white">Shipping Box Barcode Tags</td>
                <td className="p-3 font-mono">12A (63.5×72mm)</td>
                <td className="p-3 font-mono">600 Labels (50 Sheets)</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Printed Clean
                  </span>
                </td>
                <td className="p-3 text-right text-stitch-muted font-mono">Today, 14:20</td>
              </tr>

              <tr>
                <td className="p-3 font-mono text-blue-400 font-bold">#JOB-9819</td>
                <td className="p-3 font-semibold text-white">Small QR Inventory Asset Stickers</td>
                <td className="p-3 font-mono">84 (46×11.11mm)</td>
                <td className="p-3 font-mono">840 Labels (10 Sheets)</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Printed Clean
                  </span>
                </td>
                <td className="p-3 text-right text-stitch-muted font-mono">Yesterday, 11:10</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
