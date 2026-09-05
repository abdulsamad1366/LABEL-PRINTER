import React, { useState, useRef, useEffect } from 'react';
import { 
  Type, 
  Image as ImageIcon, 
  Barcode, 
  QrCode, 
  Magnet, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Copy,
  Trash2
} from 'lucide-react';
import { LabelTemplate, LabelElement, ElementType } from '../types/label';
import { mmToPx, pxToMm, snapToGrid } from '../utils/mmToPx';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

interface SingleLabelEditorProps {
  template: LabelTemplate;
  elements: LabelElement[];
  onChangeElements: (newElements: LabelElement[]) => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
}

export const SingleLabelEditor: React.FC<SingleLabelEditorProps> = ({
  template,
  elements,
  onChangeElements,
  selectedElementId,
  onSelectElement
}) => {
  const [zoom, setZoom] = useState<number>(2.5);
  const [gridSnap, setGridSnap] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(1);
  const [history, setHistory] = useState<LabelElement[][]>([elements]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef<boolean>(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartGeo = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });
  const activeHandle = useRef<string | null>(null);

  const selectedElement = elements.find(el => el.id === selectedElementId);

  const pushHistory = (newEls: LabelElement[]) => {
    const updated = history.slice(0, historyIdx + 1);
    updated.push(JSON.parse(JSON.stringify(newEls)));
    if (updated.length > 30) updated.shift();
    setHistory(updated);
    setHistoryIdx(updated.length - 1);
    onChangeElements(newEls);
  };

  const handleUndo = () => {
    if (historyIdx > 0) {
      const prev = history[historyIdx - 1];
      setHistoryIdx(historyIdx - 1);
      onChangeElements(JSON.parse(JSON.stringify(prev)));
    }
  };

  const handleRedo = () => {
    if (historyIdx < history.length - 1) {
      const next = history[historyIdx + 1];
      setHistoryIdx(historyIdx + 1);
      onChangeElements(JSON.parse(JSON.stringify(next)));
    }
  };

  const addElement = (type: ElementType) => {
    const id = `el_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    let newEl: LabelElement = {
      id,
      type,
      x: 5,
      y: 5,
      width: 25,
      height: 10,
      rotation: 0
    };

    if (type === 'text') {
      newEl = {
        ...newEl,
        content: 'Sample Text',
        fontSize: 10,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        width: Math.min(template.widthMm - 4, 40),
        height: 8
      };
    } else if (type === 'image') {
      newEl = {
        ...newEl,
        src: '',
        aspectRatioLock: true,
        width: 20,
        height: 20
      };
    } else if (type === 'barcode') {
      newEl = {
        ...newEl,
        value: '12345678',
        barcodeType: 'CODE128',
        displayValue: true,
        width: Math.min(template.widthMm - 4, 35),
        height: 12
      };
    } else if (type === 'qrcode') {
      newEl = {
        ...newEl,
        value: 'https://example.com',
        width: 15,
        height: 15
      };
    }

    if (gridSnap) {
      newEl.x = snapToGrid(newEl.x, gridSize);
      newEl.y = snapToGrid(newEl.y, gridSize);
    }

    const updated = [...elements, newEl];
    pushHistory(updated);
    onSelectElement(id);
  };

  const alignElement = (alignment: 'left' | 'centerH' | 'right' | 'top' | 'centerV' | 'bottom') => {
    if (!selectedElement) return;
    const updated = elements.map(el => {
      if (el.id !== selectedElementId) return el;
      const copy = { ...el };
      if (alignment === 'left') copy.x = 0;
      if (alignment === 'centerH') copy.x = (template.widthMm - copy.width) / 2;
      if (alignment === 'right') copy.x = template.widthMm - copy.width;
      if (alignment === 'top') copy.y = 0;
      if (alignment === 'centerV') copy.y = (template.heightMm - copy.height) / 2;
      if (alignment === 'bottom') copy.y = template.heightMm - copy.height;

      if (gridSnap) {
        copy.x = snapToGrid(copy.x, gridSize);
        copy.y = snapToGrid(copy.y, gridSize);
      }
      return copy;
    });
    pushHistory(updated);
  };

  const duplicateElement = () => {
    if (!selectedElement) return;
    const clone = JSON.parse(JSON.stringify(selectedElement));
    clone.id = `el_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    clone.x = Math.min(template.widthMm - clone.width, clone.x + 2);
    clone.y = Math.min(template.heightMm - clone.height, clone.y + 2);
    const updated = [...elements, clone];
    pushHistory(updated);
    onSelectElement(clone.id);
  };

  const deleteElement = () => {
    if (!selectedElementId) return;
    const updated = elements.filter(el => el.id !== selectedElementId);
    pushHistory(updated);
    onSelectElement(null);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string, handle?: string) => {
    e.stopPropagation();
    onSelectElement(id);
    const el = elements.find(item => item.id === id);
    if (!el) return;

    isInteracting.current = true;
    activeHandle.current = handle || null;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartGeo.current = { x: el.x, y: el.y, w: el.width, h: el.height };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInteracting.current || !selectedElementId) return;
      const el = elements.find(item => item.id === selectedElementId);
      if (!el) return;

      const dxPx = e.clientX - dragStartPos.current.x;
      const dyPx = e.clientY - dragStartPos.current.y;

      const dxMm = pxToMm(dxPx, zoom);
      const dyMm = pxToMm(dyPx, zoom);

      const handle = activeHandle.current;

      const updated = elements.map(item => {
        if (item.id !== selectedElementId) return item;
        const copy = { ...item };

        if (!handle) {
          let nx = elementStartGeo.current.x + dxMm;
          let ny = elementStartGeo.current.y + dyMm;
          if (gridSnap) {
            nx = snapToGrid(nx, gridSize);
            ny = snapToGrid(ny, gridSize);
          }
          copy.x = Math.max(0, Math.min(template.widthMm - copy.width, nx));
          copy.y = Math.max(0, Math.min(template.heightMm - copy.height, ny));
        } else {
          let nw = elementStartGeo.current.w;
          let nh = elementStartGeo.current.h;
          let nx = elementStartGeo.current.x;
          let ny = elementStartGeo.current.y;

          if (handle.includes('e')) nw = elementStartGeo.current.w + dxMm;
          if (handle.includes('s')) nh = elementStartGeo.current.h + dyMm;
          if (handle.includes('w')) {
            nw = elementStartGeo.current.w - dxMm;
            nx = elementStartGeo.current.x + dxMm;
          }
          if (handle.includes('n')) {
            nh = elementStartGeo.current.h - dyMm;
            ny = elementStartGeo.current.y + dyMm;
          }

          if (gridSnap) {
            nw = snapToGrid(nw, gridSize);
            nh = snapToGrid(nh, gridSize);
            nx = snapToGrid(nx, gridSize);
            ny = snapToGrid(ny, gridSize);
          }

          copy.width = Math.max(2, nw);
          copy.height = Math.max(2, nh);
          copy.x = nx;
          copy.y = ny;
        }

        return copy;
      });

      onChangeElements(updated);
    };

    const handleMouseUp = () => {
      if (isInteracting.current) {
        isInteracting.current = false;
        activeHandle.current = null;
        pushHistory(elements);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [elements, selectedElementId, zoom, gridSnap, gridSize]);

  const labelW = mmToPx(template.widthMm, zoom);
  const labelH = mmToPx(template.heightMm, zoom);

  return (
    <div className="flex flex-col h-full bg-stitch-bg select-none">
      {/* Editor Tooling Header */}
      <div className="h-11 bg-stitch-panel border-b border-stitch-border px-4 flex items-center justify-between text-stitch-text">
        {/* Add Content Palette */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addElement('text')}
            className="px-2.5 py-1 bg-stitch-card hover:bg-slate-700 border border-stitch-border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-white"
          >
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span>Text</span>
          </button>

          <label className="px-2.5 py-1 bg-stitch-card hover:bg-slate-700 border border-stitch-border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-white">
            <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
            <span>Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    if (evt.target?.result) {
                      const id = `el_${Date.now()}`;
                      const newEl: LabelElement = {
                        id,
                        type: 'image',
                        x: 5,
                        y: 5,
                        width: 20,
                        height: 20,
                        src: evt.target.result as string
                      };
                      pushHistory([...elements, newEl]);
                      onSelectElement(id);
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>

          <button
            onClick={() => addElement('barcode')}
            className="px-2.5 py-1 bg-stitch-card hover:bg-slate-700 border border-stitch-border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-white"
          >
            <Barcode className="w-3.5 h-3.5 text-purple-400" />
            <span>Barcode</span>
          </button>

          <button
            onClick={() => addElement('qrcode')}
            className="px-2.5 py-1 bg-stitch-card hover:bg-slate-700 border border-stitch-border rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-white"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span>QR Code</span>
          </button>
        </div>

        {/* Precision Alignment Bar */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => alignElement('left')}
            disabled={!selectedElement}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => alignElement('centerH')}
            disabled={!selectedElement}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Center Horizontally"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => alignElement('right')}
            disabled={!selectedElement}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-stitch-border mx-1" />
          <button
            onClick={() => alignElement('top')}
            disabled={!selectedElement}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Align Top"
          >
            <AlignStartVertical className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => alignElement('centerV')}
            disabled={!selectedElement}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Center Vertically"
          >
            <AlignCenterVertical className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => alignElement('bottom')}
            disabled={!selectedElement}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Align Bottom"
          >
            <AlignEndVertical className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-3.5 bg-stitch-border mx-1" />
          <button
            onClick={duplicateElement}
            disabled={!selectedElement}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={deleteElement}
            disabled={!selectedElement}
            className="p-1.5 text-red-400 hover:text-red-300 rounded disabled:opacity-25 cursor-pointer"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Snap & Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGridSnap(!gridSnap)}
            className={`p-1.5 border rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
              gridSnap ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-stitch-card border-stitch-border text-stitch-muted'
            }`}
            title="Snap to grid"
          >
            <Magnet className="w-3.5 h-3.5" />
            <span>Snap</span>
          </button>

          <select
            value={gridSize}
            onChange={(e) => setGridSize(parseFloat(e.target.value))}
            className="px-2 py-1 bg-stitch-card border border-stitch-border rounded-md text-xs text-stitch-text font-mono"
          >
            <option value="0.5">0.5 mm</option>
            <option value="1">1.0 mm</option>
            <option value="2">2.0 mm</option>
          </select>

          <div className="w-px h-3.5 bg-stitch-border mx-1" />

          <button
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Undo"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 text-stitch-muted hover:text-white rounded disabled:opacity-25 cursor-pointer"
            title="Redo"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>

          <select
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="px-2 py-1 bg-stitch-card border border-stitch-border rounded-md text-xs font-mono font-bold text-blue-400"
          >
            <option value="1.5">150%</option>
            <option value="2.0">200%</option>
            <option value="2.5">250% (Default)</option>
            <option value="3.0">300%</option>
          </select>
        </div>
      </div>

      {/* Editor Viewport Canvas (Stitch Light Workspace with Grid Overlay) */}
      <div 
        ref={containerRef}
        onClick={() => onSelectElement(null)}
        className="flex-1 overflow-auto p-12 flex items-center justify-center relative bg-[#f8fafc] grid-bg-overlay select-none"
      >
        <div 
          className="bg-white a4-paper-shadow relative transition-all"
          style={{ width: `${labelW}px`, height: `${labelH}px` }}
        >
          {/* Label Metric Indicator */}
          <div className="absolute top-1 left-2 text-[9px] font-mono font-bold text-slate-400 pointer-events-none">
            {template.widthMm} × {template.heightMm} mm
          </div>

          {/* Render Elements */}
          {elements.map(el => {
            const isSelected = el.id === selectedElementId;
            const xPx = mmToPx(el.x, zoom);
            const yPx = mmToPx(el.y, zoom);
            const wPx = mmToPx(el.width, zoom);
            const hPx = mmToPx(el.height, zoom);

            return (
              <div
                key={el.id}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
                onClick={(e) => e.stopPropagation()}
                className={`absolute box-border cursor-move group ${
                  isSelected ? 'outline-2 outline-blue-600 ring-2 ring-blue-500/30' : 'hover:outline-1 hover:outline-blue-400'
                }`}
                style={{
                  left: `${xPx}px`,
                  top: `${yPx}px`,
                  width: `${wPx}px`,
                  height: `${hPx}px`,
                  transform: `rotate(${el.rotation || 0}deg)`
                }}
              >
                {/* Element Content */}
                <RenderElementInner el={el} zoom={zoom} />

                {/* Resize Handles */}
                {isSelected && (
                  <>
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'nw')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-nwse-resize z-20"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'ne')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-nesw-resize z-20"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'sw')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-nesw-resize z-20"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'se')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-600 border border-white rounded-full cursor-nwse-resize z-20"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const RenderElementInner: React.FC<{ el: LabelElement; zoom: number }> = ({ el, zoom }) => {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (el.type === 'barcode' && barcodeRef.current && el.value) {
      try {
        JsBarcode(barcodeRef.current, el.value, {
          format: el.barcodeType || 'CODE128',
          displayValue: el.displayValue !== false,
          margin: 2
        });
      } catch {
        // Fallback
      }
    } else if (el.type === 'qrcode' && qrRef.current && el.value) {
      QRCode.toString(el.value, { type: 'svg', margin: 1 })
        .then(svg => {
          if (qrRef.current) qrRef.current.innerHTML = svg;
        })
        .catch(() => {});
    }
  }, [el, zoom]);

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

  if (el.type === 'image') {
    return el.src ? (
      <img src={el.src} alt="element" className="w-full h-full object-contain pointer-events-none" />
    ) : (
      <div className="w-full h-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
        Image Placeholder
      </div>
    );
  }

  if (el.type === 'barcode') {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <svg ref={barcodeRef} className="max-w-full max-h-full" />
      </div>
    );
  }

  if (el.type === 'qrcode') {
    return <div ref={qrRef} className="w-full h-full flex items-center justify-center" />;
  }

  return null;
};
