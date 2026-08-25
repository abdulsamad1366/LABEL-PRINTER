import React, { useState } from 'react';
import { Target, X, Check } from 'lucide-react';
import { CalibrationSettings } from '../types/label';

interface CalibrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  calibration: CalibrationSettings;
  onSaveCalibration: (settings: CalibrationSettings) => void;
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  isOpen,
  onClose,
  calibration,
  onSaveCalibration
}) => {
  const [hOffset, setHOffset] = useState<number>(calibration.horizontalOffset || 0);
  const [vOffset, setVOffset] = useState<number>(calibration.verticalOffset || 0);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveCalibration({
      horizontalOffset: hOffset,
      verticalOffset: vOffset
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-slate-800">Printer Calibration Offsets</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            If your printer slightly shifts print output horizontally or vertically, enter calibration offsets below. Values will shift the entire A4 print layout in millimetres.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Horizontal Offset (+/- mm)</label>
              <input
                type="number"
                step="0.5"
                value={hOffset}
                onChange={(e) => setHOffset(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">+ moves right, - moves left</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vertical Offset (+/- mm)</label>
              <input
                type="number"
                step="0.5"
                value={vOffset}
                onChange={(e) => setVOffset(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">+ moves down, - moves up</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Calibration</span>
          </button>
        </div>

      </div>
    </div>
  );
};
