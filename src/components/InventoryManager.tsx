import React, { useState } from 'react';
import { Box, Plus, Minus, CheckCircle2, AlertTriangle, RefreshCw, Layers } from 'lucide-react';
import { FinishType } from '../types/label';

interface StockItem {
  id: string;
  finish: FinishType;
  sheetCount: number;
  minThreshold: number;
  unitCost: string;
  status: 'In Stock' | 'Low Stock' | 'Critical';
}

export const InventoryManager: React.FC = () => {
  const [stock, setStock] = useState<StockItem[]>([
    { id: 'st_1', finish: 'Uncoated 70', sheetCount: 1450, minThreshold: 200, unitCost: '₹4.50 / A4 sheet', status: 'In Stock' },
    { id: 'st_2', finish: 'Fluorescent 75', sheetCount: 420, minThreshold: 100, unitCost: '₹6.20 / A4 sheet', status: 'In Stock' },
    { id: 'st_3', finish: 'Gloss Paper 80', sheetCount: 890, minThreshold: 150, unitCost: '₹5.80 / A4 sheet', status: 'In Stock' },
    { id: 'st_4', finish: 'Kraft', sheetCount: 95, minThreshold: 100, unitCost: '₹5.00 / A4 sheet', status: 'Low Stock' },
    { id: 'st_5', finish: 'Pet Translucent', sheetCount: 310, minThreshold: 50, unitCost: '₹12.00 / A4 sheet', status: 'In Stock' },
    { id: 'st_6', finish: 'Pet Silver Matte', sheetCount: 30, minThreshold: 50, unitCost: '₹15.00 / A4 sheet', status: 'Critical' },
    { id: 'st_7', finish: 'Inkjet Matte 60', sheetCount: 650, minThreshold: 100, unitCost: '₹4.80 / A4 sheet', status: 'In Stock' }
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setStock(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newCount = Math.max(0, item.sheetCount + delta);
      let status: 'In Stock' | 'Low Stock' | 'Critical' = 'In Stock';
      if (newCount <= item.minThreshold / 2) status = 'Critical';
      else if (newCount <= item.minThreshold) status = 'Low Stock';
      return { ...item, sheetCount: newCount, status };
    }));
  };

  return (
    <div className="p-6 md:p-8 bg-stitch-bg text-stitch-text h-full overflow-y-auto space-y-6 select-none">
      {/* Module Title */}
      <div className="flex items-center justify-between pb-4 border-b border-stitch-border">
        <div>
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl font-black text-white tracking-tight">Adhesive Paper & Materials Stock ERP</h1>
          </div>
          <p className="text-xs text-stitch-muted mt-1">
            Track A4 self-adhesive raw sheet inventories across 9 specialized surface finishes.
          </p>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stock.map((item) => (
          <div key={item.id} className="bg-stitch-panel border border-stitch-border rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{item.finish}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                item.status === 'In Stock' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' :
                item.status === 'Low Stock' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {item.status}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-3xl font-black text-white font-mono">{item.sheetCount}</span>
                <span className="text-xs text-stitch-muted ml-1">A4 Sheets</span>
              </div>
              <span className="text-xs font-mono text-stitch-muted">{item.unitCost}</span>
            </div>

            <div className="pt-3 border-t border-stitch-border flex items-center justify-between">
              <span className="text-[11px] text-stitch-muted">Min Threshold: {item.minThreshold} sheets</span>
              
              <div className="flex items-center gap-1.5 bg-stitch-bg p-1 rounded-lg border border-stitch-border">
                <button
                  onClick={() => updateQuantity(item.id, -50)}
                  className="p-1 text-stitch-muted hover:text-white hover:bg-stitch-card rounded transition-colors cursor-pointer"
                  title="Remove 50 sheets"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => updateQuantity(item.id, 50)}
                  className="p-1 text-stitch-muted hover:text-white hover:bg-stitch-card rounded transition-colors cursor-pointer"
                  title="Add 50 sheets"
                >
                  <Plus className="w-3.5 h-3.5 text-teal-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
