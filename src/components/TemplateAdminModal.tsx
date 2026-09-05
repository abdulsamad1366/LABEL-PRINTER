import React, { useState, useEffect } from 'react';
import { Settings, X, Plus, Edit, Check } from 'lucide-react';
import { LabelTemplate, FinishType } from '../types/label';

interface TemplateAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (template: LabelTemplate) => void;
  editingTemplate?: LabelTemplate | null;
}

export const TemplateAdminModal: React.FC<TemplateAdminModalProps> = ({
  isOpen,
  onClose,
  onSaveTemplate,
  editingTemplate
}) => {
  const [sizeCode, setSizeCode] = useState('');
  const [widthMm, setWidthMm] = useState<number>(63.5);
  const [heightMm, setHeightMm] = useState<number>(38.1);
  const [across, setAcross] = useState<number>(3);
  const [rows, setRows] = useState<number>(7);
  const [marginTopMm, setMarginTopMm] = useState<number>(15.15);
  const [marginBottomMm, setMarginBottomMm] = useState<number>(15.15);
  const [marginLeftMm, setMarginLeftMm] = useState<number>(9.75);
  const [marginRightMm, setMarginRightMm] = useState<number>(9.75);
  const [colGapMm, setColGapMm] = useState<number>(0);
  const [rowGapMm, setRowGapMm] = useState<number>(0);
  const [finish, setFinish] = useState<FinishType>('Uncoated 70');

  useEffect(() => {
    if (editingTemplate) {
      setSizeCode(editingTemplate.sizeCode);
      setWidthMm(editingTemplate.widthMm);
      setHeightMm(editingTemplate.heightMm);
      setAcross(editingTemplate.across);
      setRows(editingTemplate.rows);
      setMarginTopMm(editingTemplate.marginTopMm);
      setMarginBottomMm(editingTemplate.marginBottomMm || editingTemplate.marginTopMm);
      setMarginLeftMm(editingTemplate.marginLeftMm);
      setMarginRightMm(editingTemplate.marginRightMm || editingTemplate.marginLeftMm);
      setColGapMm(editingTemplate.colGapMm);
      setRowGapMm(editingTemplate.rowGapMm);
      setFinish(editingTemplate.finish || 'Uncoated 70');
    } else {
      setSizeCode('');
      setWidthMm(63.5);
      setHeightMm(38.1);
      setAcross(3);
      setRows(7);
      setMarginTopMm(15.15);
      setMarginBottomMm(15.15);
      setMarginLeftMm(9.75);
      setMarginRightMm(9.75);
      setColGapMm(0);
      setRowGapMm(0);
      setFinish('Uncoated 70');
    }
  }, [editingTemplate, isOpen]);

  if (!isOpen) return null;

  const handleAutoCalculateGaps = () => {
    // A4 dimensions: 210mm x 297mm
    const sheetWidth = 210;
    const sheetHeight = 297;
    const availWidth = sheetWidth - marginLeftMm - marginRightMm - (across * widthMm);
    const calculatedColGap = across > 1 ? Math.max(0, availWidth / (across - 1)) : 0;

    const availHeight = sheetHeight - marginTopMm - marginBottomMm - (rows * heightMm);
    const calculatedRowGap = rows > 1 ? Math.max(0, availHeight / (rows - 1)) : 0;

    setColGapMm(parseFloat(calculatedColGap.toFixed(2)));
    setRowGapMm(parseFloat(calculatedRowGap.toFixed(2)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sizeCode) {
      alert('Please enter a Size Code (e.g. 12A, CUSTOM_1).');
      return;
    }

    const savedTemplate: LabelTemplate = {
      id: editingTemplate ? editingTemplate.id : `custom_${sizeCode.toLowerCase()}_${Date.now()}`,
      sizeCode: sizeCode.toUpperCase(),
      widthMm,
      heightMm,
      across,
      rows,
      marginTopMm,
      marginBottomMm,
      marginLeftMm,
      marginRightMm,
      colGapMm,
      rowGapMm,
      sheetWidthMm: 210,
      sheetHeightMm: 297,
      finish,
      color: 'Default',
      verified: true
    };

    onSaveTemplate(savedTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            {editingTemplate ? <Edit className="w-5 h-5 text-blue-600" /> : <Settings className="w-5 h-5 text-blue-600" />}
            <div>
              <h2 className="text-base font-bold text-slate-800">
                {editingTemplate ? `Edit Template Specs (${editingTemplate.sizeCode})` : 'Template Admin (Create Custom Size)'}
              </h2>
              <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Saved Permanently to Supabase Cloud & Synced Across Browsers</span>
              </p>
            </div>
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

          {/* Page Margins Grid */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Sheet Margins (mm)</label>
              <button
                type="button"
                onClick={handleAutoCalculateGaps}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                title="Auto-calculate column & row gaps from margins and sheet size"
              >
                Auto-calculate Gaps
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Top Margin</label>
                <input
                  type="number"
                  step="0.1"
                  value={marginTopMm}
                  onChange={(e) => setMarginTopMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Bottom Margin</label>
                <input
                  type="number"
                  step="0.1"
                  value={marginBottomMm}
                  onChange={(e) => setMarginBottomMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Left Margin</label>
                <input
                  type="number"
                  step="0.1"
                  value={marginLeftMm}
                  onChange={(e) => setMarginLeftMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Right Margin</label>
                <input
                  type="number"
                  step="0.1"
                  value={marginRightMm}
                  onChange={(e) => setMarginRightMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500 text-blue-600 font-bold"
                />
              </div>
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
              {editingTemplate ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingTemplate ? 'Update Template Specs' : 'Save Size Code Template'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
