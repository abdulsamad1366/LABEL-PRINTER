import React from 'react';
import { LabelElement } from '../types/label';
import { Trash2, Copy, Move, Sliders, Type, Barcode, QrCode } from 'lucide-react';

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
      <aside className="w-72 bg-stitch-panel border-l border-stitch-border p-6 flex flex-col items-center justify-center text-center text-stitch-muted select-none">
        <div className="w-12 h-12 bg-stitch-card border border-stitch-border rounded-xl flex items-center justify-center mb-3 text-stitch-muted shadow-inner">
          <Sliders className="w-6 h-6 text-blue-400" />
        </div>
        <p className="font-bold text-xs text-stitch-text uppercase tracking-wider">Precision Inspector</p>
        <p className="text-[11px] text-stitch-muted mt-1 leading-relaxed">
          Select an element on the canvas to inspect & edit its exact physical millimetre properties.
        </p>
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-stitch-panel border-l border-stitch-border p-4 flex flex-col h-full overflow-y-auto text-stitch-text select-none">
      {/* Header */}
      <div className="pb-3 mb-4 border-b border-stitch-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedElement.type === 'text' && <Type className="w-4 h-4 text-blue-400" />}
          {selectedElement.type === 'barcode' && <Barcode className="w-4 h-4 text-teal-400" />}
          {selectedElement.type === 'qrcode' && <QrCode className="w-4 h-4 text-purple-400" />}
          <h3 className="font-bold text-xs uppercase tracking-wider text-white">
            {selectedElement.type} Properties
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 bg-stitch-card border border-stitch-border font-mono text-blue-400 rounded">
          #{selectedElement.id.slice(-5)}
        </span>
      </div>

      {/* Text Specific Properties */}
      {selectedElement.type === 'text' && (
        <div className="space-y-3.5 mb-5">
          <div>
            <label className="block text-[11px] font-semibold text-stitch-muted mb-1 uppercase tracking-wider">
              Text Content
            </label>
            <textarea
              rows={3}
              value={selectedElement.content || ''}
              onChange={(e) => onUpdateElement({ content: e.target.value })}
              placeholder="Enter text or {{placeholder}}"
              className="w-full px-3 py-2 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-stitch-muted mt-0.5 block">
              Placeholders: <code className="bg-stitch-bg px-1 rounded text-teal-400">{"{{header}}"}</code>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Font Family</label>
              <select
                value={selectedElement.fontFamily || 'Arial'}
                onChange={(e) => onUpdateElement({ fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs text-stitch-text"
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
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Size (pt)</label>
              <input
                type="number"
                step="0.5"
                value={selectedElement.fontSize || 10}
                onChange={(e) => onUpdateElement({ fontSize: parseFloat(e.target.value) || 8 })}
                className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Weight</label>
              <select
                value={selectedElement.fontWeight || 'normal'}
                onChange={(e) => onUpdateElement({ fontWeight: e.target.value as 'normal' | 'bold' })}
                className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs text-stitch-text"
              >
                <option value="normal">Normal</option>
                <option value="bold">Bold</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Align</label>
              <select
                value={selectedElement.textAlign || 'center'}
                onChange={(e) => onUpdateElement({ textAlign: e.target.value as 'left' | 'center' | 'right' })}
                className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs text-stitch-text"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Text Color</label>
            <input
              type="color"
              value={selectedElement.color || '#000000'}
              onChange={(e) => onUpdateElement({ color: e.target.value })}
              className="w-full h-8 px-1 py-1 bg-stitch-bg border border-stitch-border rounded-md cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Barcode Properties */}
      {selectedElement.type === 'barcode' && (
        <div className="space-y-3.5 mb-5">
          <div>
            <label className="block text-[11px] font-semibold text-stitch-muted mb-1 uppercase tracking-wider">
              Barcode Value / Tag
            </label>
            <input
              type="text"
              value={selectedElement.value || ''}
              onChange={(e) => onUpdateElement({ value: e.target.value })}
              placeholder="12345678 or {{SKU}}"
              className="w-full px-3 py-2 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Barcode Standard</label>
            <select
              value={selectedElement.barcodeType || 'CODE128'}
              onChange={(e) => onUpdateElement({ barcodeType: e.target.value as 'CODE128' | 'CODE39' | 'EAN13' })}
              className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs text-stitch-text"
            >
              <option value="CODE128">CODE128</option>
              <option value="CODE39">CODE39</option>
              <option value="EAN13">EAN13</option>
            </select>
          </div>
        </div>
      )}

      {/* QR Code Properties */}
      {selectedElement.type === 'qrcode' && (
        <div className="space-y-3.5 mb-5">
          <div>
            <label className="block text-[11px] font-semibold text-stitch-muted mb-1 uppercase tracking-wider">
              QR Code Payload / URL
            </label>
            <input
              type="text"
              value={selectedElement.value || ''}
              onChange={(e) => onUpdateElement({ value: e.target.value })}
              placeholder="https://example.com or {{URL}}"
              className="w-full px-3 py-2 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
            />
          </div>
        </div>
      )}

      {/* Physical Coordinates (mm) */}
      <div className="pt-4 border-t border-stitch-border space-y-3">
        <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center justify-between">
          <span>Physical Metrics (mm)</span>
          <span className="text-[10px] font-mono text-teal-400">PRECISION MM</span>
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-stitch-muted mb-1 uppercase">X Position</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={selectedElement.x}
                onChange={(e) => onUpdateElement({ x: parseFloat(e.target.value) || 0 })}
                className="w-full pl-2 pr-6 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-stitch-muted">mm</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-stitch-muted mb-1 uppercase">Y Position</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={selectedElement.y}
                onChange={(e) => onUpdateElement({ y: parseFloat(e.target.value) || 0 })}
                className="w-full pl-2 pr-6 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-stitch-muted">mm</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-stitch-muted mb-1 uppercase">Width</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={selectedElement.width}
                onChange={(e) => onUpdateElement({ width: Math.max(1, parseFloat(e.target.value) || 1) })}
                className="w-full pl-2 pr-6 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-stitch-muted">mm</span>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-stitch-muted mb-1 uppercase">Height</label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={selectedElement.height}
                onChange={(e) => onUpdateElement({ height: Math.max(1, parseFloat(e.target.value) || 1) })}
                className="w-full pl-2 pr-6 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-stitch-muted">mm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto pt-6 flex gap-2">
        <button
          onClick={onDuplicateElement}
          className="flex-1 py-2 px-3 bg-stitch-card hover:bg-slate-700 text-stitch-text font-semibold text-xs rounded-md border border-stitch-border flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Duplicate</span>
        </button>

        <button
          onClick={onDeleteElement}
          className="flex-1 py-2 px-3 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 font-semibold text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </aside>
  );
};
