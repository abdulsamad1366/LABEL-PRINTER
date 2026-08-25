import React, { useState } from 'react';
import { Printer, FileDown, Target, X, AlertTriangle, CheckCircle } from 'lucide-react';
import { LabelTemplate, LabelElement, CalibrationSettings, DataRow } from '../types/label';
import { generatePDF, generateTestAlignmentPDF } from '../utils/pdfGenerator';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: LabelTemplate;
  elements: LabelElement[];
  calibration: CalibrationSettings;
  csvData?: DataRow[];
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  template,
  elements,
  calibration,
  csvData
}) => {
  const [showBorders, setShowBorders] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const doc = await generatePDF(template, elements, {
        calibration,
        showBorders,
        csvData
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

  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
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

        <div className="p-6 space-y-6">
          {/* Critical Print Guidelines Callout */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-amber-950 text-sm mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Critical Printer Guidelines (Physical Accuracy):</span>
            </div>
            <ul className="list-disc ml-5 space-y-1 font-medium">
              <li>Set <strong>Scale</strong> to <strong>"100% / Actual Size"</strong> in browser print window.</li>
              <li>Disable <strong>"Fit to Printable Area"</strong> or "Fit to Page".</li>
              <li>Set <strong>Margins</strong> to <strong>"None" / 0</strong>.</li>
            </ul>
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
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>{isGenerating ? 'Exporting PDF...' : 'Download Vector PDF (mm)'}</span>
            </button>

            <button
              onClick={handleDirectPrint}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Print Directly (Browser)</span>
            </button>
          </div>

          {/* Alignment Test Sheet */}
          <div className="pt-4 border-t border-slate-200">
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
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
