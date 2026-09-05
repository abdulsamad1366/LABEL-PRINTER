import React from 'react';
import { LabelElement } from '../types/label';
import { 
  Trash2, Copy, Move, Sliders, Type, Barcode, QrCode,
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'lucide-react';
import { FONT_OPTIONS, FONT_WEIGHT_OPTIONS } from '../utils/fonts';

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

          {/* Font Family Selector */}
          <div>
            <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">
              Font Family
            </label>
            <select
              value={selectedElement.fontFamily || 'Arial'}
              onChange={(e) => onUpdateElement({ fontFamily: e.target.value })}
              className="w-full px-2.5 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs text-stitch-text font-medium focus:outline-none focus:border-blue-500"
            >
              {Array.from(new Set(FONT_OPTIONS.map(f => f.category))).map(category => (
                <optgroup key={category} label={category} className="bg-slate-900 text-slate-400 font-bold">
                  {FONT_OPTIONS.filter(f => f.category === category).map(font => (
                    <option key={font.name} value={font.name} className="bg-slate-800 text-white font-normal" style={{ fontFamily: font.family }}>
                      {font.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Size (pt)</label>
              <div className="flex items-center">
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="144"
                  value={selectedElement.fontSize || 10}
                  onChange={(e) => onUpdateElement({ fontSize: parseFloat(e.target.value) || 8 })}
                  className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Weight</label>
              <select
                value={selectedElement.fontWeight || 'normal'}
                onChange={(e) => onUpdateElement({ fontWeight: e.target.value })}
                className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs text-stitch-text"
              >
                {FONT_WEIGHT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Style Formatting Quick Toggles */}
          <div>
            <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">
              Font Styling
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-stitch-bg border border-stitch-border rounded-md">
              <button
                type="button"
                title="Bold"
                onClick={() => {
                  const isBold = selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === '700';
                  onUpdateElement({ fontWeight: isBold ? 'normal' : 'bold' });
                }}
                className={`py-1.5 flex items-center justify-center rounded text-xs transition-colors ${
                  selectedElement.fontWeight === 'bold' || selectedElement.fontWeight === '700'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <Bold className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                title="Italic"
                onClick={() => {
                  onUpdateElement({ fontStyle: selectedElement.fontStyle === 'italic' ? 'normal' : 'italic' });
                }}
                className={`py-1.5 flex items-center justify-center rounded text-xs transition-colors ${
                  selectedElement.fontStyle === 'italic'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <Italic className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                title="Underline"
                onClick={() => {
                  const hasUnderline = selectedElement.textDecoration?.includes('underline');
                  onUpdateElement({ textDecoration: hasUnderline ? 'none' : 'underline' });
                }}
                className={`py-1.5 flex items-center justify-center rounded text-xs transition-colors ${
                  selectedElement.textDecoration?.includes('underline')
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                title="Strikethrough"
                onClick={() => {
                  const hasLineThrough = selectedElement.textDecoration?.includes('line-through');
                  onUpdateElement({ textDecoration: hasLineThrough ? 'none' : 'line-through' });
                }}
                className={`py-1.5 flex items-center justify-center rounded text-xs transition-colors ${
                  selectedElement.textDecoration?.includes('line-through')
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">
              Alignment
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-stitch-bg border border-stitch-border rounded-md">
              <button
                type="button"
                title="Align Left"
                onClick={() => onUpdateElement({ textAlign: 'left' })}
                className={`py-1.5 flex items-center justify-center rounded transition-colors ${
                  (selectedElement.textAlign || 'center') === 'left'
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                title="Align Center"
                onClick={() => onUpdateElement({ textAlign: 'center' })}
                className={`py-1.5 flex items-center justify-center rounded transition-colors ${
                  (selectedElement.textAlign || 'center') === 'center'
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                title="Align Right"
                onClick={() => onUpdateElement({ textAlign: 'right' })}
                className={`py-1.5 flex items-center justify-center rounded transition-colors ${
                  (selectedElement.textAlign || 'center') === 'right'
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                title="Justify"
                onClick={() => onUpdateElement({ textAlign: 'justify' })}
                className={`py-1.5 flex items-center justify-center rounded transition-colors ${
                  selectedElement.textAlign === 'justify'
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Text Case Transform */}
          <div>
            <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">
              Text Case
            </label>
            <div className="grid grid-cols-4 gap-1 p-1 bg-stitch-bg border border-stitch-border rounded-md text-[10px] font-semibold">
              <button
                type="button"
                title="As Typed"
                onClick={() => onUpdateElement({ textTransform: 'none' })}
                className={`py-1 rounded transition-colors ${
                  (!selectedElement.textTransform || selectedElement.textTransform === 'none')
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                Aa
              </button>
              <button
                type="button"
                title="UPPERCASE"
                onClick={() => onUpdateElement({ textTransform: 'uppercase' })}
                className={`py-1 rounded transition-colors ${
                  selectedElement.textTransform === 'uppercase'
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                AA
              </button>
              <button
                type="button"
                title="lowercase"
                onClick={() => onUpdateElement({ textTransform: 'lowercase' })}
                className={`py-1 rounded transition-colors ${
                  selectedElement.textTransform === 'lowercase'
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                aa
              </button>
              <button
                type="button"
                title="Capitalize"
                onClick={() => onUpdateElement({ textTransform: 'capitalize' })}
                className={`py-1 rounded transition-colors ${
                  selectedElement.textTransform === 'capitalize'
                    ? 'bg-blue-600 text-white'
                    : 'text-stitch-muted hover:text-white hover:bg-stitch-card'
                }`}
              >
                Ab
              </button>
            </div>
          </div>

          {/* Spacing Controls (Letter Spacing & Line Height) */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">
                Letter Space
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.2"
                  value={selectedElement.letterSpacing || 0}
                  onChange={(e) => onUpdateElement({ letterSpacing: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text pr-6"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-stitch-muted font-mono">px</span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">
                Line Height
              </label>
              <input
                type="number"
                step="0.1"
                min="0.8"
                max="3"
                value={selectedElement.lineHeight || 1.1}
                onChange={(e) => onUpdateElement({ lineHeight: parseFloat(e.target.value) || 1.1 })}
                className="w-full px-2 py-1.5 bg-stitch-bg border border-stitch-border rounded-md text-xs font-mono text-stitch-text"
              />
            </div>
          </div>

          {/* Color & Highlight */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Text Color</label>
              <div className="flex items-center gap-1.5 bg-stitch-bg border border-stitch-border p-1 rounded-md">
                <input
                  type="color"
                  value={selectedElement.color || '#000000'}
                  onChange={(e) => onUpdateElement({ color: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[10px] font-mono text-stitch-text uppercase">
                  {selectedElement.color || '#000000'}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stitch-muted mb-1 uppercase tracking-wider">Highlight</label>
              <div className="flex items-center gap-1.5 bg-stitch-bg border border-stitch-border p-1 rounded-md">
                <input
                  type="color"
                  value={selectedElement.backgroundColor || '#ffffff'}
                  onChange={(e) => onUpdateElement({ backgroundColor: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => onUpdateElement({ backgroundColor: undefined })}
                  className="text-[9px] text-stitch-muted hover:text-red-400 font-mono ml-auto"
                >
                  Clear
                </button>
              </div>
            </div>
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
