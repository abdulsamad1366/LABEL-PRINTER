import React from 'react';
import { LabelElement, DataRow, CalibrationSettings } from '../types/label';

interface ElementInspectorProps {
  selectedElement: LabelElement | null;
  onUpdateElement: (updatedProps: Partial<LabelElement>) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  csvData?: DataRow[];
  calibration?: CalibrationSettings;
  onUpdateCalibration?: (newCalibration: CalibrationSettings) => void;
  onOpenPrintModal?: () => void;
  onSaveProject?: () => void;
}

export const ElementInspector: React.FC<ElementInspectorProps> = ({
  selectedElement,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  csvData,
  calibration = { horizontalOffset: 0, verticalOffset: 0 },
  onUpdateCalibration,
  onOpenPrintModal,
  onSaveProject
}) => {
  return (
    <aside className="w-inspector_width bg-surface-container-lowest border-l border-outline-variant flex flex-col shrink-0 z-40 overflow-y-auto h-full shadow-xs">
      
      {/* Properties Section Header */}
      <div className="p-4 border-b border-outline-variant">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">tune</span>
            <span>Properties</span>
          </h3>
          {selectedElement && (
            <span className="font-mono text-[10px] px-2 py-0.5 bg-surface-container-high text-on-surface-variant rounded-md font-medium">
              {selectedElement.type.toUpperCase()}
            </span>
          )}
        </div>

        {selectedElement ? (
          <div className="space-y-3">
            {/* Text Specific Controls */}
            {selectedElement.type === 'text' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-on-surface-variant">Text Content</label>
                  <textarea
                    rows={2}
                    value={selectedElement.content || ''}
                    onChange={(e) => onUpdateElement({ content: e.target.value })}
                    placeholder="Text or {{SKU}}"
                    className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant rounded-md text-xs font-mono focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <span className="font-mono text-[10px] text-on-surface-variant">
                    Tip: Use <code className="bg-surface-container-high px-1 rounded text-primary">{"{{field}}"}</code> for CSV data.
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-on-surface-variant">Font Family</label>
                  <select
                    value={selectedElement.fontFamily || 'Inter'}
                    onChange={(e) => onUpdateElement({ fontFamily: e.target.value })}
                    className="w-full border border-outline-variant rounded-md text-xs h-8 px-2 py-1 bg-surface font-sans"
                  >
                    <option value="Inter">Inter (Sans-Serif)</option>
                    <option value="JetBrains Mono">JetBrains Mono (Monospace)</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-on-surface-variant">Size (pt)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedElement.fontSize || 10}
                      onChange={(e) => onUpdateElement({ fontSize: parseFloat(e.target.value) || 8 })}
                      className="w-full border border-outline-variant rounded-md text-xs font-mono h-8 px-2 py-1 bg-surface"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-on-surface-variant">Align</label>
                    <div className="flex border border-outline-variant rounded-md h-8 bg-surface overflow-hidden">
                      <button
                        onClick={() => onUpdateElement({ textAlign: 'left' })}
                        className={`flex-1 hover:bg-surface-container-high border-r border-outline-variant flex items-center justify-center ${
                          selectedElement.textAlign === 'left' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">format_align_left</span>
                      </button>
                      <button
                        onClick={() => onUpdateElement({ textAlign: 'center' })}
                        className={`flex-1 hover:bg-surface-container-high border-r border-outline-variant flex items-center justify-center ${
                          selectedElement.textAlign === 'center' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">format_align_center</span>
                      </button>
                      <button
                        onClick={() => onUpdateElement({ textAlign: 'right' })}
                        className={`flex-1 hover:bg-surface-container-high flex items-center justify-center ${
                          selectedElement.textAlign === 'right' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">format_align_right</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-on-surface-variant">Color</label>
                  <input
                    type="color"
                    value={selectedElement.color || '#000000'}
                    onChange={(e) => onUpdateElement({ color: e.target.value })}
                    className="w-full h-8 px-1 py-1 bg-surface border border-outline-variant rounded-md cursor-pointer"
                  />
                </div>
              </>
            )}

            {/* Barcode & QR Code Properties */}
            {selectedElement.type === 'barcode' && (
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-on-surface-variant">Barcode Value / Tag</label>
                <input
                  type="text"
                  value={selectedElement.value || ''}
                  onChange={(e) => onUpdateElement({ value: e.target.value })}
                  placeholder="12345678 or {{SKU}}"
                  className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant rounded-md text-xs font-mono"
                />
              </div>
            )}

            {selectedElement.type === 'qrcode' && (
              <div className="flex flex-col gap-1">
                <label className="font-mono text-xs text-on-surface-variant">QR Code Data / URL</label>
                <input
                  type="text"
                  value={selectedElement.value || ''}
                  onChange={(e) => onUpdateElement({ value: e.target.value })}
                  placeholder="https://example.com or {{URL}}"
                  className="w-full px-2.5 py-1.5 bg-surface border border-outline-variant rounded-md text-xs font-mono"
                />
              </div>
            )}

            {/* Position & Geometry Inputs (mm) */}
            <div className="pt-2 border-t border-outline-variant">
              <label className="font-mono text-[11px] font-medium text-on-surface-variant mb-2 block uppercase tracking-wide">
                Coordinates & Size (mm)
              </label>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] text-on-surface-variant">X Pos (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedElement.x}
                    onChange={(e) => onUpdateElement({ x: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-outline-variant rounded-md text-xs font-mono h-8 px-2 py-1 bg-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] text-on-surface-variant">Y Pos (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedElement.y}
                    onChange={(e) => onUpdateElement({ y: parseFloat(e.target.value) || 0 })}
                    className="w-full border border-outline-variant rounded-md text-xs font-mono h-8 px-2 py-1 bg-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] text-on-surface-variant">Width (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedElement.width}
                    onChange={(e) => onUpdateElement({ width: Math.max(1, parseFloat(e.target.value) || 1) })}
                    className="w-full border border-outline-variant rounded-md text-xs font-mono h-8 px-2 py-1 bg-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-mono text-[11px] text-on-surface-variant">Height (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={selectedElement.height}
                    onChange={(e) => onUpdateElement({ height: Math.max(1, parseFloat(e.target.value) || 1) })}
                    className="w-full border border-outline-variant rounded-md text-xs font-mono h-8 px-2 py-1 bg-surface"
                  />
                </div>
              </div>
            </div>

            {/* Element Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={onDuplicateElement}
                className="flex-1 py-1.5 px-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-md font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
                <span>Duplicate</span>
              </button>

              <button
                onClick={onDeleteElement}
                className="flex-1 py-1.5 px-2 bg-error-container text-on-error-container hover:opacity-90 rounded-md font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[32px] text-outline mb-1">ads_click</span>
            <p className="font-medium text-xs text-on-surface">No element selected</p>
            <p className="font-mono text-[10px] text-on-surface-variant mt-1">
              Select an element on canvas to modify its properties.
            </p>
          </div>
        )}
      </div>

      {/* Stitch Data Table Preview Section */}
      <div className="flex-1 flex flex-col p-4 border-b border-outline-variant overflow-hidden">
        <h3 className="font-semibold text-xs text-on-surface mb-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">database</span>
          <span>Data Source Preview</span>
        </h3>

        {csvData && csvData.length > 0 ? (
          <div className="flex-1 overflow-auto border border-outline-variant rounded-md bg-surface">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-[#f8fafc] border-b border-outline-variant z-10 font-mono text-[11px]">
                <tr>
                  {Object.keys(csvData[0]).slice(0, 3).map((col) => (
                    <th key={col} className="p-1.5 text-on-surface-variant border-r border-outline-variant capitalize">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-[11px] text-on-surface">
                {csvData.slice(0, 5).map((row, i) => (
                  <tr key={i} className="border-b border-outline-variant hover:bg-surface-container-low cursor-pointer">
                    {Object.values(row).slice(0, 3).map((val, idx) => (
                      <td key={idx} className="p-1.5 border-r border-outline-variant truncate max-w-[80px]">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-3 bg-surface border border-dashed border-outline-variant rounded-md text-center">
            <p className="font-mono text-[10px] text-on-surface-variant">No CSV data loaded yet.</p>
          </div>
        )}
      </div>

      {/* Stitch Printer Offset Calibration */}
      <div className="p-4 border-b border-outline-variant">
        <h3 className="font-mono text-xs text-on-surface-variant mb-2 flex items-center gap-1 font-medium">
          <span className="material-symbols-outlined text-[16px] text-amber-500">design_services</span>
          <span>Printer Calibration</span>
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-on-surface-variant">Top Offset (mm)</label>
            <input
              type="number"
              step="0.1"
              value={calibration.verticalOffset}
              onChange={(e) => onUpdateCalibration?.({ ...calibration, verticalOffset: parseFloat(e.target.value) || 0 })}
              className="w-full border border-outline-variant rounded-md text-xs font-mono h-7 px-2 py-1 bg-surface"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-on-surface-variant">Left Offset (mm)</label>
            <input
              type="number"
              step="0.1"
              value={calibration.horizontalOffset}
              onChange={(e) => onUpdateCalibration?.({ ...calibration, horizontalOffset: parseFloat(e.target.value) || 0 })}
              className="w-full border border-outline-variant rounded-md text-xs font-mono h-7 px-2 py-1 bg-surface"
            />
          </div>
        </div>
      </div>

      {/* Export Action Buttons */}
      <div className="p-4 space-y-2 mt-auto">
        <button
          onClick={onOpenPrintModal}
          className="w-full py-2 bg-primary-container text-on-primary rounded-lg text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Download PDF</span>
        </button>

        <button
          onClick={onSaveProject}
          className="w-full py-2 bg-surface-container-lowest text-primary border border-primary rounded-lg text-xs font-semibold hover:bg-surface-container-low transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Project</span>
        </button>
      </div>

    </aside>
  );
};
