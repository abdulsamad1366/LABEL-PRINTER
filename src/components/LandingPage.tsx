import React from 'react';
import { 
  Printer, 
  Grid, 
  FileSpreadsheet, 
  Target, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  Box, 
  BarChart3, 
  User as UserIcon,
  Play,
  ChevronRight,
  TrendingUp,
  FileText,
  Compass,
  Sliders,
  PieChart
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onLaunchDemo
}) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col antialiased">
      
      {/* 1. Top Header Navigation Bar */}
      <nav className="h-20 bg-white border-b border-slate-200 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/20">
            LS
          </div>
          <div>
            <span className="font-extrabold text-base text-slate-900 tracking-tight block leading-tight">
              LabelStudio ERP
            </span>
            <span className="text-[11px] text-slate-500 font-medium block">
              Label Printing & Production ERP
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#modules" className="hover:text-blue-600 transition-colors">Modules</a>
          <a href="#resources" className="hover:text-blue-600 transition-colors">Resources</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchDemo}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Try Live Demo</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In / Launch ERP</span>
          </button>
        </div>
      </nav>

      {/* 2. Hero Section (Split Layout) */}
      <section className="pt-12 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-600">
              <Compass className="w-3.5 h-3.5" />
              <span>Precision 1:1 Millimetre Printing & Inventory Suite</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Complete ERP for Adhesive <span className="text-blue-600">Label Printing</span> & Production
            </h1>

            {/* Subtitle */}
            <p className="text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              Design labels, manage inventory, track paper stock, calibrate printers and streamline your entire label production workflow.
            </p>

            {/* CTA Button Pair */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenLogin}
                className="px-7 py-3.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 flex items-center gap-2.5 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Access ERP Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchDemo}
                className="px-6 py-3.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs flex items-center gap-2.5 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center text-white">
                  <Play className="w-2.5 h-2.5 fill-current translate-x-0.5" />
                </div>
                <span>Launch Quick Demo</span>
              </button>
            </div>

            {/* 4 Feature Pill Cards Container */}
            <div className="pt-4">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block leading-tight">46+</span>
                    <span className="text-[10px] text-slate-500 font-medium">A4 Size Presets</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-2 sm:pl-4">
                  <div className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 block leading-tight">1:1</span>
                    <span className="text-[10px] text-slate-500 font-medium">Precision</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-2 sm:pl-4">
                  <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">Bulk CSV</span>
                    <span className="text-[10px] text-slate-500 font-medium">Auto Mail-Merge</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-l border-slate-100 pl-2 sm:pl-4">
                  <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 block leading-tight">±mm</span>
                    <span className="text-[10px] text-slate-500 font-medium">Offset Calibration</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: App Window Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl overflow-hidden">
              {/* macOS Window Titlebar */}
              <div className="h-9 bg-slate-100 px-4 flex items-center gap-2 border-b border-slate-200">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-amber-400 rounded-full" />
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
              </div>

              {/* App UI Window Interior */}
              <div className="grid grid-cols-12 bg-slate-50 text-slate-800 text-xs min-h-[380px]">
                {/* Left Dark Sidebar */}
                <div className="col-span-3 bg-[#081425] p-3 text-slate-300 space-y-3">
                  <div className="font-bold text-[11px] text-white tracking-tight flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>LabelStudio ERP</span>
                  </div>
                  <div className="space-y-1 text-[11px] pt-1">
                    <div className="px-2 py-1.5 bg-blue-600 text-white font-bold rounded-md flex items-center gap-1.5">
                      <span>Dashboard</span>
                    </div>
                    <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md">Design Studio</div>
                    <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md">Inventory</div>
                    <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md">Paper Stock</div>
                    <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md">Print Jobs</div>
                    <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md">Calibration</div>
                    <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md">Reports</div>
                    <div className="px-2 py-1.5 hover:bg-slate-800 rounded-md">Settings</div>
                  </div>
                </div>

                {/* Right Light Content */}
                <div className="col-span-9 p-3 space-y-3 bg-slate-50">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-medium block">Total Labels</span>
                      <span className="font-bold text-xs text-slate-900 block">12,540</span>
                      <span className="text-[9px] text-emerald-600 font-bold">+12.5%</span>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-medium block">Print Jobs</span>
                      <span className="font-bold text-xs text-slate-900 block">8,632</span>
                      <span className="text-[9px] text-emerald-600 font-bold">+8.1%</span>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-medium block">Inventory Value</span>
                      <span className="font-bold text-xs text-slate-900 block">₹ 18,75,320</span>
                      <span className="text-[9px] text-emerald-600 font-bold">+15.3%</span>
                    </div>

                    <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[9px] text-slate-400 font-medium block">Active Presets</span>
                      <span className="font-bold text-xs text-slate-900 block">46</span>
                      <span className="text-[9px] text-slate-500 font-medium">A4 Sizes</span>
                    </div>
                  </div>

                  {/* Chart & Status Pair */}
                  <div className="grid grid-cols-12 gap-2">
                    {/* Line Chart Box */}
                    <div className="col-span-8 p-2.5 bg-white border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-800">Print Jobs Overview</span>
                        <span className="text-slate-400 border rounded px-1">This Week v</span>
                      </div>
                      <div className="h-16 w-full flex items-end justify-between px-1">
                        <svg className="w-full h-full text-blue-500" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M0 45 Q 30 10, 60 35 T 120 20 T 180 30 T 200 10" fill="none" />
                        </svg>
                      </div>
                    </div>

                    {/* Donut Chart Box */}
                    <div className="col-span-4 p-2.5 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-center">
                      <span className="text-[9px] font-bold text-slate-700 mb-1">Inventory Status</span>
                      <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-emerald-400 flex items-center justify-center font-bold text-[10px] text-slate-800">
                        72%
                      </div>
                      <span className="text-[8px] text-slate-400 mt-1">In Stock</span>
                    </div>
                  </div>

                  {/* Recent Jobs Table */}
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-[10px] text-slate-800 block mb-1">Recent Print Jobs</span>
                    <div className="space-y-1 text-[9px]">
                      <div className="flex justify-between py-0.5 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Product Label - Matte</span>
                        <span className="text-emerald-600 font-bold">Completed</span>
                        <span className="font-mono text-slate-500">12,000</span>
                      </div>
                      <div className="flex justify-between py-0.5 border-b border-slate-100">
                        <span className="font-semibold text-slate-700">Shipping Label - Thermal</span>
                        <span className="text-blue-600 font-bold">In Progress</span>
                        <span className="font-mono text-slate-500">8,500</span>
                      </div>
                      <div className="flex justify-between py-0.5">
                        <span className="font-semibold text-slate-700">Barcode Label - Glossy</span>
                        <span className="text-emerald-600 font-bold">Completed</span>
                        <span className="font-mono text-slate-500">5,200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Bottom Section: Complete Enterprise ERP Modules */}
      <section className="py-16 px-6 md:px-12 bg-white border-t border-slate-200/80" id="modules">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Complete Enterprise ERP Modules
            </h2>
            <p className="text-sm text-slate-600">
              Everything your warehouse, factory, or print shop needs for high-volume label production.
            </p>
          </div>

          {/* 3 Large White Rounded Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div 
              onClick={onOpenLogin}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      1. ERP Dashboard & Analytics
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Monitor print batch metrics, total sheets generated, active size code utilization, and production output logs.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              onClick={onOpenLogin}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      2. Millimetre Designer Studio
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Drag-and-drop text, images, CODE128/EAN barcodes, and QR codes with 0.5mm snap grid precision and live A4 preview.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              onClick={onOpenLogin}
              className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Box className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      3. Inventory & Paper Stock
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Track adhesive paper sheet inventory across finishes (Uncoated 70, Fluorescent 75, Gloss 80, Kraft, PET).
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Footer */}
      <footer className="mt-auto py-8 px-6 md:px-12 border-t border-slate-200 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-[10px]">LS</div>
            <span className="font-bold text-slate-900">LabelStudio ERP Enterprise Suite</span>
          </div>
          <span>© 2026 LabelStudio. All rights reserved. Physical Millimetre Precision Engine.</span>
        </div>
      </footer>

    </div>
  );
};
