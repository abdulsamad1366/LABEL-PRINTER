import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-slate-300 relative overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-10 bg-slate-800 text-white px-4 flex items-center justify-between shadow-xs z-10 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="text-slate-400">A4 Live Sheet Preview</span>
          <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded font-mono">
            {sheetWidthMm} × {sheetHeightMm} mm
          </span>
        </div>

        {/* Multi-Page Navigation for CSV Data */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded-full text-slate-200">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-xs">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-xs w-12 text-center text-slate-300">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
            className="p-1 hover:bg-slate-700 rounded text-slate-300"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable Viewport Area */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div
          className="bg-white shadow-2xl relative transition-all duration-100 ease-out"
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
                  <span className="absolute top-0.5 left-1 text-[8px] font-bold text-slate-300 pointer-events-none">
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
    const fontSizePx = (el.fontSize || 10) * 1.333 * (zoom / 2);
    return (
      <div
        className="w-full h-full flex items-center overflow-hidden leading-tight whitespace-pre-wrap break-words"
        style={{
          fontFamily: el.fontFamily || 'Arial',
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

function replacePlaceholders(str: string, data: DataRow): string {
  return str.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, key) => {
    const trimmed = key.trim();
    return data[trimmed] !== undefined ? data[trimmed] : `{{${trimmed}}}`;
  });
}
