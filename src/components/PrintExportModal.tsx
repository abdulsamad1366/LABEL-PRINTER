import React, { useState, useEffect } from 'react';
import { Printer, FileDown, Target, X, AlertTriangle, CheckSquare, Square, Grid } from 'lucide-react';
import { LabelTemplate, LabelElement, CalibrationSettings, DataRow } from '../types/label';
import { generatePDF, generateTestAlignmentPDF } from '../utils/pdfGenerator';
import { preparePrintDOM } from '../utils/printDOM';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: LabelTemplate;
  elements: LabelElement[];
  calibration: CalibrationSettings;
  csvData?: DataRow[];
}

export type SelectionMode = 'all' | 'quantity' | 'startPosition' | 'custom';

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  template,
  elements,
  calibration,
  csvData
}) => {
  const totalCells = template.across * template.rows;
  
  const [showBorders, setShowBorders] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('all');
  
  const [quantity, setQuantity] = useState<number>(totalCells);
  const [startPos, setStartPos] = useState<number>(1);
  const [selectedCells, setSelectedCells] = useState<Set<number>>(
    new Set(Array.from({ length: totalCells }, (_, i) => i))
  );

  // Synchronize selection when mode, quantity, or startPos changes
  useEffect(() => {
    if (selectionMode === 'all') {
      setSelectedCells(new Set(Array.from({ length: totalCells }, (_, i) => i)));
    } else if (selectionMode === 'quantity') {
      const q = Math.min(totalCells, Math.max(1, quantity));
      setSelectedCells(new Set(Array.from({ length: q }, (_, i) => i)));
    } else if (selectionMode === 'startPosition') {
      const startIdx = Math.min(totalCells - 1, Math.max(0, startPos - 1));
      setSelectedCells(new Set(Array.from({ length: totalCells - startIdx }, (_, i) => startIdx + i)));
    }
  }, [selectionMode, quantity, startPos, totalCells]);

  if (!isOpen) return null;

  const toggleCell = (index: number) => {
    setSelectionMode('custom');
    const updated = new Set(selectedCells);
    if (updated.has(index)) {
      updated.delete(index);
    } else {
      updated.add(index);
    }
    setSelectedCells(updated);
  };

  const selectAll = () => {
    setSelectionMode('all');
    setSelectedCells(new Set(Array.from({ length: totalCells }, (_, i) => i)));
  };

  const clearAll = () => {
    setSelectionMode('custom');
    setSelectedCells(new Set());
  };

  const selectedArray = Array.from(selectedCells);

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const doc = await generatePDF(template, elements, {
        calibration,
        showBorders,
        csvData,
        selectedGridIndices: selectedArray
      });
      doc.save(`labelstudio_${template.sizeCode}_${Date.now()}.pdf`);
    } catch (e) {
      console.error('PDF Generation Error:', e);
      alert('Error generating PDF. Check console.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadTestSheet = () => {
    const doc = generateTestAlignmentPDF(template, calibration);
    doc.save(`alignment_test_${template.sizeCode}.pdf`);
  };

  const handleDirectPrint = async () => {
    setIsGenerating(true);
    try {
      await preparePrintDOM(template, elements, {
        calibration,
        showBorders,
        csvData,
        selectedGridIndices: selectedArray
      });
      window.print();
    } catch (e) {
      console.error('Direct Print Error:', e);
      alert('Error preparing print document.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 modal-backdrop">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200 modal-container max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Print & PDF Export</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          {/* Critical Print Guidelines Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs mb-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Critical Printer Guidelines (Physical Accuracy):</span>
            </div>
            <ul className="list-disc ml-5 space-y-0.5 font-medium">
              <li>Set <strong>Scale</strong> to <strong>"100% / Actual Size"</strong> in browser print window.</li>
              <li>Disable <strong>"Fit to Printable Area"</strong> or "Fit to Page".</li>
              <li>Set <strong>Margins</strong> to <strong>"None" / 0</strong>.</li>
            </ul>
          </div>

          {/* Print Range & Position Selection Section */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-blue-600" />
                <span>Print Range & Grid Cell Selector</span>
              </label>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {selectedCells.size} of {totalCells} Selected
              </span>
            </div>

            {/* Selection Mode Segmented Control */}
            <div className="grid grid-cols-4 gap-1 bg-slate-200 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setSelectionMode('all')}
                className={`py-1.5 rounded-md transition-all cursor-pointer ${
                  selectionMode === 'all' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Labels
              </button>
              <button
                onClick={() => setSelectionMode('quantity')}
                className={`py-1.5 rounded-md transition-all cursor-pointer ${
                  selectionMode === 'quantity' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quantity
              </button>
              <button
                onClick={() => setSelectionMode('startPosition')}
                className={`py-1.5 rounded-md transition-all cursor-pointer ${
                  selectionMode === 'startPosition' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Start Pos
              </button>
              <button
                onClick={() => setSelectionMode('custom')}
                className={`py-1.5 rounded-md transition-all cursor-pointer ${
                  selectionMode === 'custom' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Custom Grid
              </button>
            </div>

            {/* Mode Controls */}
            {selectionMode === 'quantity' && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-slate-700">Print Quantity:</span>
                <input
                  type="number"
                  min={1}
                  max={totalCells}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800"
                />
                <span className="text-xs text-slate-500">labels sequentially from start</span>
              </div>
            )}

            {selectionMode === 'startPosition' && (
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-medium text-slate-700">Start from Label #:</span>
                <input
                  type="number"
                  min={1}
                  max={totalCells}
                  value={startPos}
                  onChange={(e) => setStartPos(parseInt(e.target.value, 10) || 1)}
                  className="w-20 px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800"
                />
                <span className="text-xs text-slate-500">(Skipping used/peeled top labels)</span>
              </div>
            )}

            {/* Interactive Visual A4 Grid Picker */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                <span>Click cells on the sheet layout below to toggle:</span>
                <div className="flex items-center gap-2">
                  <button onClick={selectAll} className="text-blue-600 hover:underline font-semibold cursor-pointer">Select All</button>
                  <span>•</span>
                  <button onClick={clearAll} className="text-slate-500 hover:underline font-semibold cursor-pointer">Clear</button>
                </div>
              </div>

              <div 
                className="grid gap-1.5 p-3 bg-white border border-slate-300 rounded-lg shadow-inner max-h-48 overflow-y-auto"
                style={{ gridTemplateColumns: `repeat(${template.across}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: totalCells }).map((_, idx) => {
                  const isSelected = selectedCells.has(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleCell(idx)}
                      className={`h-8 border rounded flex items-center justify-center font-mono text-[11px] font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                          : 'bg-slate-50 border-slate-300 text-slate-400 hover:border-slate-400 hover:bg-slate-100'
                      }`}
                      title={`Label Position #${idx + 1} - ${isSelected ? 'Selected' : 'Skipped'}`}
                    >
                      #{idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={showBorders}
                onChange={(e) => setShowBorders(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Show printable label borders (Helper outline)</span>
            </label>
          </div>

          {/* Calibration Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-600">Active Calibration Offsets:</span>
            <span className="font-mono font-bold text-slate-800">
              H: {calibration.horizontalOffset}mm | V: {calibration.verticalOffset}mm
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating || selectedCells.size === 0}
              className="py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGenerating ? 'Exporting PDF...' : `Export PDF (${selectedCells.size} Labels)`}</span>
            </button>

            <button
              onClick={handleDirectPrint}
              disabled={isGenerating || selectedCells.size === 0}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>{isGenerating ? 'Preparing...' : `Print Browser (${selectedCells.size} Labels)`}</span>
            </button>
          </div>

          {/* Alignment Test Sheet */}
          <div className="pt-2 border-t border-slate-200">
            <button
              onClick={handleDownloadTestSheet}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 border border-slate-300 hover:border-amber-300 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Target className="w-4 h-4 text-amber-600" />
              <span>Download Alignment Test Sheet (100mm Ruler & Crosshairs)</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
