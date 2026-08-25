import React from 'react';
import { LabelElement } from '../types/label';
import { Trash2, Copy } from 'lucide-react';

interface ElementInspectorProps {
  selectedElement: LabelElement | null;
  onUpdateElement: (updatedProps: Partial<LabelElement>) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
}

export const ElementInspector: React.FC<ElementInspectorProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement
}) => {
  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-slate-200 p-6 flex flex-col items-center justify-center text-center text-slate-400">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
          👆
        </div>
        <p className="font-semibold text-sm text-slate-600">No Element Selected</p>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          Click an element on the label editor canvas to customize its physical properties.
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-slate-200 p-4 flex flex-col h-full overflow-y-auto">
      <div className="pb-3 mb-4 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
          {selectedElement.type} Properties
        </h3>
        <span className="text-[10px] px-2 py-0.5 bg-slate-100 font-mono text-slate-600 rounded">
          {selectedElement.id.slice(-6)}
        </span>
      </div>

      {/* Text Specific Editor */}
      {selectedElement.type === 'text' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Text Content</label>
            <textarea
              rows={3}
              value={selectedElement.content || ''}
              onChange={(e) => onUpdateElement({ content: e.target.value })}
              placeholder="Enter text or {{placeholder}}"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Tip: Use <code className="bg-slate-100 px-1 rounded text-blue-600">{"{{header}}"}</code> for CSV mail merge fields.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Font Family</label>
              <select
                value={selectedElement.fontFamily || 'Arial'}
                onChange={(e) => onUpdateElement({ fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times</option>
                <option value="Courier New">Courier</option>
                <option value="Impact">Impact</option>
                <option value="Inter">Inter</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Size (pt)</label>
              <input
                type="number"
                step="0.5"
                value={selectedElement.fontSize || 10}
                onChange={(e) => onUpdateElement({ fontSize: parseFloat(e.target.value) || 8 })}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weight</label>
              <select
                value={selectedElement.fontWeight || 'normal'}
                onChange={(e) => onUpdateElement({ fontWeight: e.target.value as 'normal' | 'bold' })}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Align</label>
              <select
                value={selectedElement.textAlign || 'center'}
                onChange={(e) => onUpdateElement({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Color</label>
            <input
              type="color"
              value={selectedElement.color || '#000000'}
              onChange={(e) => onUpdateElement({ color: e.target.value })}
              className="w-full h-8 px-1 py-1 bg-slate-50 border border-slate-300 rounded-md cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Barcode Specific Editor */}
      {selectedElement.type === 'barcode' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Barcode Value / Tag</label>
            <input
              type="text"
              value={selectedElement.value || ''}
              onChange={(e) => onUpdateElement({ value: e.target.value })}
              placeholder="12345678 or {{SKU}}"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Barcode Format</label>
            <select
              value={selectedElement.barcodeType || 'CODE128'}
              onChange={(e) => onUpdateElement({ barcodeType: e.target.value as 'CODE128' | 'CODE39' | 'EAN13' })}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs"
            >
              <option value="CODE128">CODE128</option>
              <option value="CODE39">CODE39</option>
              <option value="EAN13">EAN13</option>
            </select>
          </div>
        </div>
      )}

      {/* QR Specific Editor */}
      {selectedElement.type === 'qrcode' && (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">QR Code Data / URL</label>
            <input
              type="text"
              value={selectedElement.value || ''}
              onChange={(e) => onUpdateElement({ value: e.target.value })}
              placeholder="https://example.com or {{URL}}"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* Physical Position & Geometry (mm) */}
      <div className="pt-4 border-t border-slate-200 space-y-4">
        <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wide">
          Position & Size (mm)
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">X Position (mm)</label>
            <input
              type="number"
              step="0.1"
              value={selectedElement.x}
              onChange={(e) => onUpdateElement({ x: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Y Position (mm)</label>
            <input
              type="number"
              step="0.1"
              value={selectedElement.y}
              onChange={(e) => onUpdateElement({ y: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Width (mm)</label>
            <input
              type="number"
              step="0.1"
              value={selectedElement.width}
              onChange={(e) => onUpdateElement({ width: Math.max(1, parseFloat(e.target.value) || 1) })}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Height (mm)</label>
            <input
              type="number"
              step="0.1"
              value={selectedElement.height}
              onChange={(e) => onUpdateElement({ height: Math.max(1, parseFloat(e.target.value) || 1) })}
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="mt-auto pt-6 flex gap-2">
        <button
          onClick={onDuplicateElement}
          className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate</span>
        </button>

        <button
          onClick={onDeleteElement}
          className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
