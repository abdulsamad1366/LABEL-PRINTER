import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-stitch-bg relative overflow-hidden select-none">
      {/* Top Precision Toolbar */}
      <div className="h-10 bg-stitch-panel border-b border-stitch-border px-4 flex items-center justify-between text-stitch-text text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-stitch-muted">A4 Live Sheet Preview</span>
          <span className="bg-stitch-card text-blue-400 border border-stitch-border px-2 py-0.5 rounded font-mono text-[11px]">
            {sheetWidthMm} × {sheetHeightMm} mm
          </span>
        </div>

        {/* Multi-Page Navigation for CSV Data */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 bg-stitch-card border border-stitch-border px-3 py-1 rounded-full text-stitch-text">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-semibold text-xs text-white">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
            className="p-1 hover:bg-stitch-card rounded text-stitch-muted hover:text-white cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-xs w-12 text-center text-blue-400 font-bold">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
            className="p-1 hover:bg-stitch-card rounded text-stitch-muted hover:text-white cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Viewport Area (Stitch Workspace Overlay) */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[#f8fafc] grid-bg-overlay">
        <div
          className="bg-white a4-paper-shadow relative transition-all duration-100 ease-out"
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
                    isSelected ? 'border-2 border-blue-600 bg-white ring-2 ring-blue-500/20' : 'border border-dashed border-slate-300 hover:border-blue-400 bg-white/90'
                  }`}
                  style={{
                    left: `${xPx}px`,
                    top: `${yPx}px`,
                    width: `${wPx}px`,
                    height: `${hPx}px`,
                    borderRadius: `${radPx}px`
                  }}
                >
                  {/* Grid Cell Sequence Tag */}
                  <span className="absolute top-0.5 left-1 text-[8px] font-bold text-slate-400 font-mono pointer-events-none">
                    #{globalIndex + 1}
                  </span>

                  {/* Render Elements inside label preview */}
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
    const fontSizePx = (el.fontSize || 10) * 1.333333333 * zoom;
    const letterSpacingPx = (el.letterSpacing || 0) * zoom;
    return (
      <div
        className="w-full h-full flex items-center overflow-hidden whitespace-pre-wrap break-words"
        style={{
          fontFamily: el.fontFamily || 'Arial',
          fontSize: `${fontSizePx}px`,
          fontWeight: el.fontWeight || 'normal',
          fontStyle: el.fontStyle || 'normal',
          textDecoration: el.textDecoration || 'none',
          textTransform: el.textTransform || 'none',
          letterSpacing: `${letterSpacingPx}px`,
          lineHeight: el.lineHeight || 1.1,
          color: el.color || '#000000',
          backgroundColor: el.backgroundColor || 'transparent',
          justifyContent: el.textAlign === 'left' ? 'flex-start' : (el.textAlign === 'right' ? 'flex-end' : (el.textAlign === 'justify' ? 'space-between' : 'center')),
          textAlign: el.textAlign || 'center'
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
    return <div className="w-full h-full border border-slate-800 bg-slate-100 text-[8px] flex items-center justify-center font-mono">||||| {el.value}</div>;
  }

  if (el.type === 'qrcode') {
    return <div className="w-full h-full border border-slate-800 bg-slate-100 text-[8px] flex items-center justify-center font-mono">QR</div>;
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

function replacePlaceholders(str: string, data?: DataRow): string {
  if (!str) return '';
  return str.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
    const trimmed = key.trim();
    if (data && data[trimmed] !== undefined) return data[trimmed];
    if (trimmed === 'price') return '1,299';
    if (trimmed === 'gst') return '18%';
    if (trimmed === 'sku') return 'PROD-001';
    return trimmed;
  });
}
