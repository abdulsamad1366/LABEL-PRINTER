import React from 'react';
import { 
  BarChart3, 
  Printer, 
  Layers, 
  Box, 
  FileSpreadsheet, 
  Target, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Sliders,
  ChevronRight,
  MoreVertical,
  RotateCw
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
  const userName = currentUser?.name || currentUser?.email?.split('@')[0] || 'asamad9280';

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] text-slate-900 h-full overflow-y-auto space-y-8 select-none antialiased">
      
      {/* 1. Hero Control Center Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-blue-100/60 border border-blue-100 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-600/10 text-blue-600 text-[10px] font-mono font-bold rounded-md border border-blue-200">
              ERP CONTROL CENTER
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {userName}! 👋
          </h1>
          
          <p className="text-xs text-slate-600 font-medium">
            Enterprise label production suite initialized.
          </p>

          <p className="text-xs font-mono font-semibold text-slate-700 pt-1">
            Active template: <span className="text-blue-600 font-bold">{activeTemplate.sizeCode} ({activeTemplate.widthMm}×{activeTemplate.heightMm}mm)</span>
          </p>
        </div>

        {/* Right Illustration & CTA */}
        <div className="flex items-center gap-6 z-10 w-full md:w-auto justify-between md:justify-end">
          <div className="hidden lg:block w-44 h-24 relative">
            <svg viewBox="0 0 200 120" className="w-full h-full text-blue-600 drop-shadow-md">
              <rect x="20" y="30" width="100" height="60" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="3"/>
              <rect x="30" y="40" width="80" height="40" rx="4" fill="#eff6ff"/>
              <path d="M40 55 H 100 M 40 65 H 80" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
              <rect x="130" y="40" width="50" height="50" rx="6" fill="#1e293b"/>
              <rect x="140" y="60" width="30" height="20" rx="2" fill="#ffffff"/>
              <path d="M145 65 H 165 M 145 70 H 160" stroke="#000000" strokeWidth="2"/>
            </svg>
          </div>

          <button
            onClick={onNavigateToStudio}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 shrink-0"
          >
            <span>Launch Label Studio Editor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Statistic Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Card 1: Print Batches */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PRINT BATCHES</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900">128</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>14% this week</span>
            </div>
          </div>

          {/* Sparkline Wave */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full text-blue-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 20 Q 25 5, 50 15 T 100 8" />
            </svg>
          </div>
        </div>

        {/* Card 2: Printed Sheets */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PRINTED SHEETS</span>
            <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900">3,840</div>
            <div className="text-[11px] text-slate-500 font-medium mt-0.5">A4 Self-Adhesive Sheets</div>
          </div>

          {/* Sparkline Wave */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full text-teal-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 15 Q 30 22, 60 10 T 100 18" />
            </svg>
          </div>
        </div>

        {/* Card 3: Active Catalog Size */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ACTIVE CATALOG SIZE</span>
            <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900 font-mono">{activeTemplate.sizeCode}</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              {activeTemplate.across}×{activeTemplate.rows} ({activeTemplate.across * activeTemplate.rows} labels/sheet)
            </div>
          </div>

          {/* Sparkline Wave */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full text-purple-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 18 Q 20 8, 50 20 T 100 10" />
            </svg>
          </div>
        </div>

        {/* Card 4: Paper Stock Level */}
        <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-3 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PAPER STOCK LEVEL</span>
            <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Box className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-3xl font-black text-slate-900">1,450</div>
            <div className="text-[11px] text-amber-600 font-bold mt-0.5">Uncoated 70 (Healthy)</div>
          </div>

          {/* Sparkline Wave */}
          <div className="h-8 w-full pt-1">
            <svg className="w-full h-full text-amber-500" viewBox="0 0 100 25" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M0 12 Q 40 22, 70 8 T 100 15" />
            </svg>
          </div>
        </div>

      </div>

      {/* 3. Quick Action ERP Launchers */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">QUICK ACTION ERP LAUNCHERS</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={onNavigateToStudio}
            className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer transition-all group shadow-2xs flex items-start gap-4"
          >
            <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">Label Design Studio</h3>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Open the 1:1 physical millimetre designer with grid snap, alignment tools, barcodes, and QR renderer.
              </p>
            </div>
          </div>

          <div 
            onClick={onOpenMailMerge}
            className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer transition-all group shadow-2xs flex items-start gap-4"
          >
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">Bulk CSV Mail Merge</h3>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Import product catalogs and auto-generate sequential multi-page label sheets with variable data placeholders.
              </p>
            </div>
          </div>

          <div 
            onClick={onNavigateToInventory}
            className="p-5 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer transition-all group shadow-2xs flex items-start gap-4"
          >
            <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">Materials & Stock Manager</h3>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track paper stock across 9 paper finishes (Uncoated, Fluorescent, Gloss, Kraft, PET Translucent).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent ERP Production Batches Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>RECENT ERP PRODUCTION BATCHES</span>
          </h2>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>Last updated: Just now</span>
            <RotateCw className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">JOB ID</th>
                <th className="p-3">JOB NAME</th>
                <th className="p-3">SIZE CODE</th>
                <th className="p-3">QUANTITY</th>
                <th className="p-3">STATUS</th>
                <th className="p-3">TIMESTAMP</th>
                <th className="p-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono text-blue-600 font-bold">#JOB-9821</td>
                <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                  <span>Hardware Product Labels (PDL-90)</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-normal rounded">Product Label</span>
                </td>
                <td className="p-3 font-mono text-slate-600">18 (63.5×46.6mm)</td>
                <td className="p-3 font-mono text-slate-700">180 Labels (10 Sheets)</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Printed Clean
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-500">Today, 18:45</td>
                <td className="p-3 text-right">
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono text-blue-600 font-bold">#JOB-9820</td>
                <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                  <span>Shipping Box Barcode Tags</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-normal rounded">Barcode Label</span>
                </td>
                <td className="p-3 font-mono text-slate-600">12A (63.5×72mm)</td>
                <td className="p-3 font-mono text-slate-700">600 Labels (50 Sheets)</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Printed Clean
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-500">Today, 14:20</td>
                <td className="p-3 text-right">
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-3 font-mono text-blue-600 font-bold">#JOB-9819</td>
                <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                  <span>Small QR Inventory Asset Stickers</span>
                  <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-normal rounded">QR Label</span>
                </td>
                <td className="p-3 font-mono text-slate-600">84 (46×11.11mm)</td>
                <td className="p-3 font-mono text-slate-700">840 Labels (10 Sheets)</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" /> Printed Clean
                  </span>
                </td>
                <td className="p-3 font-mono text-slate-500">Yesterday, 11:10</td>
                <td className="p-3 text-right">
                  <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 text-xs text-slate-400 font-medium">
        © 2026 LabelStudio ERP. All rights reserved.
      </div>

    </div>
  );
};
