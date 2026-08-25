import React, { useState } from 'react';
import { Settings, X, Plus, Check } from 'lucide-react';
import { LabelTemplate, FinishType } from '../types/label';

interface TemplateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (template: LabelTemplate) => void;
}

export const TemplateAdminModal: React.FC<TemplateAdminModalProps> = ({
  isOpen,
  onClose,
  onSaveTemplate
}) => {
  const [sizeCode, setSizeCode] = useState('');
  const [widthMm, setWidthMm] = useState<number>(63.5);
  const [heightMm, setHeightMm] = useState<number>(38.1);
  const [across, setAcross] = useState<number>(3);
  const [rows, setRows] = useState<number>(7);
  const [marginTopMm, setMarginTopMm] = useState<number>(15.15);
  const [marginLeftMm, setMarginLeftMm] = useState<number>(9.75);
  const [colGapMm, setColGapMm] = useState<number>(0);
  const [rowGapMm, setRowGapMm] = useState<number>(0);
  const [finish, setFinish] = useState<FinishType>('Uncoated 70');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeCode) {
      alert('Please enter a Size Code (e.g. 12A, CUSTOM_1).');
      return;
    }

    const newTemplate: LabelTemplate = {
      id: `custom_${sizeCode.toLowerCase()}_${Date.now()}`,
      sizeCode: sizeCode.toUpperCase(),
      widthMm,
      heightMm,
      across,
      rows,
      marginTopMm,
      marginLeftMm,
      colGapMm,
      rowGapMm,
      sheetWidthMm: 210,
      sheetHeightMm: 297,
      finish,
      color: 'Default',
      verified: true
    };

    onSaveTemplate(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Template Admin (Create Custom Size)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Size Code / SKU Name</label>
            <input
              type="text"
              placeholder="e.g. 12A, 24A, CUSTOM_50"
              value={sizeCode}
              onChange={(e) => setSizeCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Label Width (mm)</label>
              <input
                type="number"
                step="0.1"
                value={widthMm}
                onChange={(e) => setWidthMm(parseFloat(e.target.value) || 10)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Label Height (mm)</label>
              <input
                type="number"
                step="0.1"
                value={heightMm}
                onChange={(e) => setHeightMm(parseFloat(e.target.value) || 10)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Columns Across</label>
              <input
                type="number"
                min="1"
                value={across}
                onChange={(e) => setAcross(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Rows Down</label>
              <input
                type="number"
                min="1"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Top Margin (mm)</label>
              <input
                type="number"
                step="0.1"
                value={marginTopMm}
                onChange={(e) => setMarginTopMm(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Left Margin (mm)</label>
              <input
                type="number"
                step="0.1"
                value={marginLeftMm}
                onChange={(e) => setMarginLeftMm(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horizontal Gap (mm)</label>
              <input
                type="number"
                step="0.1"
                value={colGapMm}
                onChange={(e) => setColGapMm(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vertical Gap (mm)</label>
              <input
                type="number"
                step="0.1"
                value={rowGapMm}
                onChange={(e) => setRowGapMm(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Finish / Material</label>
            <select
              value={finish}
              onChange={(e) => setFinish(e.target.value as FinishType)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
            >
              <option value="Uncoated 70">Uncoated 70 Paper</option>
              <option value="Fluorescent 75">Fluorescent 75 Paper</option>
              <option value="Gloss Paper 80">Gloss Paper 80</option>
              <option value="Kraft">Kraft Paper</option>
              <option value="Pet Translucent">Pet Translucent Film</option>
              <option value="Pet Gloss PU">Pet Gloss PU</option>
              <option value="Inkjet Matte 60">Inkjet Matte 60</option>
              <option value="Pet Silver Matte">Pet Silver Matte Film</option>
              <option value="Pet White Gloss">Pet White Gloss Film</option>
            </select>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Size Code Template</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
