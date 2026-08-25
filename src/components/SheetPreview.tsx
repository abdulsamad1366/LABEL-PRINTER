import React, { useState } from 'react';
import { LabelTemplate, LabelElement, DataRow } from '../types/label';
import { mmToPx } from '../utils/mmToPx';

interface SheetPreviewProps {
  template: LabelTemplate;
  elements: LabelElement[];
  applyToAll: boolean;
  individualOverrides?: Record<number, LabelElement[]>;
  csvData?: DataRow[];
  selectedLabelIndex: number;
  onSelectLabelIndex: (index: number) => void;
}

export const SheetPreview: React.FC<SheetPreviewProps> = ({
  template,
  elements,
  applyToAll,
  individualOverrides,
  csvData,
  selectedLabelIndex,
  onSelectLabelIndex
}) => {
  const [zoom, setZoom] = useState<number>(0.85);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showGridOverlay, setShowGridOverlay] = useState<boolean>(true);

  const {
    widthMm, heightMm, across, rows,
    marginTopMm, marginLeftMm, colGapMm, rowGapMm,
    sheetWidthMm = 210, sheetHeightMm = 297, cornerRadius = 2
  } = template;

  const labelsPerPage = across * rows;
  const totalItems = csvData && csvData.length > 0 ? csvData.length : labelsPerPage;
  const totalPages = Math.ceil(totalItems / labelsPerPage);

  const sheetWidthPx = mmToPx(sheetWidthMm, zoom);
  const sheetHeightPx = mmToPx(sheetHeightMm, zoom);

  return (
    <div className="flex flex-col h-full bg-[#f1f5f9] relative overflow-hidden">
      {/* Stitch Batch Secondary Control Bar */}
      <div className="h-11 bg-surface-container-lowest border-b border-outline-variant px-6 flex items-center justify-between shadow-xs z-20 text-xs shrink-0">
        
        {/* Left Page & Total Label Indicators */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-on-surface flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px] text-primary">grid_view</span>
            <span>Batch Print Preview</span>
          </span>
          <span className="font-mono text-[11px] bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-md">
            {across}×{rows} Grid • {across * rows} Labels/Sheet
          </span>
        </div>

        {/* Multi-Page Navigation for CSV Data */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1 rounded-full border border-outline-variant">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="hover:text-primary disabled:opacity-30 flex items-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="font-mono text-xs font-medium text-on-surface">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="hover:text-primary disabled:opacity-30 flex items-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        )}

        {/* Grid Overlay Toggle & Zoom Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium flex items-center gap-1 transition-all cursor-pointer ${
              showGridOverlay ? 'bg-primary-container text-on-primary' : 'bg-surface border border-outline-variant text-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grid_on</span>
            <span>Grid Overlay</span>
          </button>

          <div className="flex items-center gap-1 bg-surface border border-outline-variant rounded-lg p-0.5">
            <button
              onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
              className="p-1 hover:bg-surface-container-high rounded-md text-on-surface-variant transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_out</span>
            </button>

            <span className="font-mono text-xs w-12 text-center text-on-surface font-medium">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="p-1 hover:bg-surface-container-high rounded-md text-on-surface-variant transition-colors cursor-pointer"
              title="Zoom In"
            >
              <span className="material-symbols-outlined text-[16px]">zoom_in</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Viewport Area */}
      <div className="flex-1 overflow-auto p-10 flex items-center justify-center relative select-none">
        <div
          className="bg-surface-container-lowest shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative border border-outline-variant transition-all duration-100 ease-out"
          style={{ width: `${sheetWidthPx}px`, height: `${sheetHeightPx}px` }}
        >
          {/* Render Label Grid */}
          {Array.from({ length: rows }).map((_, r) => (
            Array.from({ length: across }).map((_, c) => {
              const gridIndex = r * across + c;
              const globalIndex = currentPage * labelsPerPage + gridIndex;

              if (globalIndex >= totalItems && csvData) return null;

              const xMm = marginLeftMm + c * (widthMm + colGapMm);
              const yMm = marginTopMm + r * (heightMm + rowGapMm);

              const xPx = mmToPx(xMm, zoom);
              const yPx = mmToPx(yMm, zoom);
              const wPx = mmToPx(widthMm, zoom);
              const hPx = mmToPx(heightMm, zoom);
              const radPx = mmToPx(cornerRadius, zoom);

              const isSelected = selectedLabelIndex === gridIndex;

              // Elements for this label
              let currentElements = elements;
              if (csvData && csvData[globalIndex]) {
                currentElements = applyRowDataToElements(elements, csvData[globalIndex]);
              } else if (!applyToAll && individualOverrides && individualOverrides[gridIndex]) {
                currentElements = individualOverrides[gridIndex];
              }

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => onSelectLabelIndex(gridIndex)}
                  className={`absolute box-border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-2 border-primary bg-surface-container-lowest shadow-md'
                      : showGridOverlay
                      ? 'border border-dashed border-primary/40 bg-surface-container-lowest/90 hover:border-primary'
                      : 'border border-outline-variant/30 bg-surface-container-lowest hover:border-outline-variant'
                  }`}
                  style={{
                    left: `${xPx}px`,
                    top: `${yPx}px`,
                    width: `${wPx}px`,
                    height: `${hPx}px`,
                    borderRadius: `${radPx}px`
                  }}
                >
                  {/* Sequence Badge Tag */}
                  <span className="absolute top-0.5 left-1 font-mono text-[8px] font-bold text-outline pointer-events-none opacity-60">
                    #{globalIndex + 1}
                  </span>

                  {/* Render Elements Inside Label Cell */}
                  {currentElements.map(el => {
                    const elXPx = mmToPx(el.x, zoom);
                    const elYPx = mmToPx(el.y, zoom);
                    const elWPx = mmToPx(el.width, zoom);
                    const elHPx = mmToPx(el.height, zoom);

                    return (
                      <div
                        key={el.id}
                        className="absolute overflow-hidden pointer-events-none"
                        style={{
                          left: `${elXPx}px`,
                          top: `${elYPx}px`,
                          width: `${elWPx}px`,
                          height: `${elHPx}px`,
                          transform: `rotate(${el.rotation || 0}deg)`
                        }}
                      >
                        <PreviewElementInner el={el} zoom={zoom} />
                      </div>
                    );
                  })}
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

const PreviewElementInner: React.FC<{ el: LabelElement; zoom: number }> = ({ el, zoom }) => {
  if (el.type === 'text') {
    const fontSizePx = (el.fontSize || 10) * 1.333 * (zoom / 2);
    return (
      <div
        className="w-full h-full flex items-center overflow-hidden leading-tight whitespace-pre-wrap break-words"
        style={{
          fontFamily: el.fontFamily || 'Inter',
          fontSize: `${fontSizePx}px`,
          fontWeight: el.fontWeight || 'normal',
          fontStyle: el.fontStyle || 'normal',
          color: el.color || '#000000',
          justifyContent: el.textAlign === 'left' ? 'flex-start' : (el.textAlign === 'right' ? 'flex-end' : 'center')
        }}
      >
        {el.content || ''}
      </div>
    );
  }

  if (el.type === 'image' && el.src) {
    return <img src={el.src} alt="img" className="w-full h-full object-contain" />;
  }

  if (el.type === 'barcode') {
    return <div className="w-full h-full border border-on-surface/40 bg-surface-container-low text-[8px] flex items-center justify-center font-mono text-on-surface">||||| {el.value}</div>;
  }

  if (el.type === 'qrcode') {
    return <div className="w-full h-full border border-on-surface/40 bg-surface-container-low text-[8px] flex items-center justify-center font-mono text-on-surface">QR</div>;
  }

  return null;
};

function applyRowDataToElements(elements: LabelElement[], row: DataRow): LabelElement[] {
  return elements.map(el => {
    const copy = { ...el };
    if (copy.content) copy.content = replacePlaceholders(copy.content, row);
    if (copy.value) copy.value = replacePlaceholders(copy.value, row);
    return copy;
  });
}

function replacePlaceholders(str: string, data: DataRow): string {
  return str.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
    const trimmed = key.trim();
    return data[trimmed] !== undefined ? data[trimmed] : `{{${trimmed}}}`;
  });
}
