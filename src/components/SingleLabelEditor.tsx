import React, { useState, useRef, useEffect } from 'react';
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
  const [zoom, setZoom] = useState<number>(2.5); // Screen zoom scale for editing
  const [gridSnap, setGridSnap] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(1); // mm
  const [history, setHistory] = useState<LabelElement[][]>([elements]);
  const [historyIdx, setHistoryIdx] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef<boolean>(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementStartGeo = useRef<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });
  const activeHandle = useRef<string | null>(null);

  const selectedElement = elements.find(el => el.id === selectedElementId);

  // History Helper
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

  // Add Element
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
        fontFamily: 'Inter',
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

  // Alignment
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

  // Duplicate / Delete
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

  // Mouse Handlers for Drag & Resize
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
          // Dragging Position
          let nx = elementStartGeo.current.x + dxMm;
          let ny = elementStartGeo.current.y + dyMm;
          if (gridSnap) {
            nx = snapToGrid(nx, gridSize);
            ny = snapToGrid(ny, gridSize);
          }
          copy.x = Math.max(0, Math.min(template.widthMm - copy.width, nx));
          copy.y = Math.max(0, Math.min(template.heightMm - copy.height, ny));
        } else {
          // Resizing
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
    <div className="flex flex-col h-full bg-[#f1f5f9]">
      {/* Stitch Canvas Toolbar Header */}
      <div className="h-12 bg-surface-container-lowest border-b border-outline-variant px-4 flex items-center justify-between shadow-xs shrink-0 z-30">
        {/* Add Element Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => addElement('text')}
            className="px-3 py-1.5 bg-surface-container-low hover:bg-primary-container hover:text-on-primary border border-outline-variant rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">text_fields</span>
            <span>Text</span>
          </button>

          <label className="px-3 py-1.5 bg-surface-container-low hover:bg-primary-container hover:text-on-primary border border-outline-variant rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">image</span>
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
            className="px-3 py-1.5 bg-surface-container-low hover:bg-primary-container hover:text-on-primary border border-outline-variant rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
            <span>Barcode</span>
          </button>

          <button
            onClick={() => addElement('qrcode')}
            className="px-3 py-1.5 bg-surface-container-low hover:bg-primary-container hover:text-on-primary border border-outline-variant rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">qr_code</span>
            <span>QR Code</span>
          </button>
        </div>

        {/* Alignment & Action Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => alignElement('left')}
            disabled={!selectedElement}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Align Left"
          >
            <span className="material-symbols-outlined text-[18px]">format_align_left</span>
          </button>
          <button
            onClick={() => alignElement('centerH')}
            disabled={!selectedElement}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Center Horizontally"
          >
            <span className="material-symbols-outlined text-[18px]">format_align_center</span>
          </button>
          <button
            onClick={() => alignElement('right')}
            disabled={!selectedElement}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Align Right"
          >
            <span className="material-symbols-outlined text-[18px]">format_align_right</span>
          </button>
          <div className="w-px h-4 bg-outline-variant mx-1" />
          <button
            onClick={() => alignElement('top')}
            disabled={!selectedElement}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Align Top"
          >
            <span className="material-symbols-outlined text-[18px]">vertical_align_top</span>
          </button>
          <button
            onClick={() => alignElement('centerV')}
            disabled={!selectedElement}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Center Vertically"
          >
            <span className="material-symbols-outlined text-[18px]">vertical_align_center</span>
          </button>
          <button
            onClick={() => alignElement('bottom')}
            disabled={!selectedElement}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Align Bottom"
          >
            <span className="material-symbols-outlined text-[18px]">vertical_align_bottom</span>
          </button>
          <div className="w-px h-4 bg-outline-variant mx-1" />
          <button
            onClick={duplicateElement}
            disabled={!selectedElement}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Duplicate"
          >
            <span className="material-symbols-outlined text-[18px]">content_copy</span>
          </button>
          <button
            onClick={deleteElement}
            disabled={!selectedElement}
            className="p-1.5 text-error hover:bg-error-container hover:text-on-error-container rounded-md disabled:opacity-30 transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
          </button>
        </div>

        {/* Grid Snap & Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setGridSnap(!gridSnap)}
            className={`px-2.5 py-1 border rounded-lg text-xs font-mono font-medium flex items-center gap-1 transition-all cursor-pointer ${
              gridSnap ? 'bg-primary-container text-on-primary border-primary-container' : 'bg-surface border-outline-variant text-on-surface-variant'
            }`}
            title="Snap to Grid"
          >
            <span className="material-symbols-outlined text-[16px]">grid_4x4</span>
            <span>Snap</span>
          </button>

          <select
            value={gridSize}
            onChange={(e) => setGridSize(parseFloat(e.target.value))}
            className="px-2 py-1 bg-surface border border-outline-variant rounded-lg text-xs font-mono"
          >
            <option value="0.5">0.5 mm</option>
            <option value="1">1.0 mm</option>
            <option value="2">2.0 mm</option>
          </select>

          <div className="w-px h-4 bg-outline-variant mx-1" />

          <button
            onClick={handleUndo}
            disabled={historyIdx <= 0}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Undo"
          >
            <span className="material-symbols-outlined text-[18px]">undo</span>
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdx >= history.length - 1}
            className="p-1.5 text-on-surface-variant hover:bg-surface-container-high rounded-md disabled:opacity-30 transition-colors"
            title="Redo"
          >
            <span className="material-symbols-outlined text-[18px]">redo</span>
          </button>

          <select
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="px-2 py-1 bg-surface border border-outline-variant rounded-lg text-xs font-mono font-medium text-on-surface"
          >
            <option value="1.5">150%</option>
            <option value="2.0">200%</option>
            <option value="2.5">250% (Default)</option>
            <option value="3.0">300%</option>
          </select>
        </div>
      </div>

      {/* Stitch Millimeter Viewport Canvas with Rulers */}
      <div 
        ref={containerRef}
        onClick={() => onSelectElement(null)}
        className="flex-1 overflow-auto p-12 relative flex items-center justify-center select-none"
      >
        {/* Horizontal Top Ruler */}
        <div className="absolute top-0 left-8 right-0 h-6 ruler-x bg-surface-container-lowest border-b border-outline-variant z-10 pointer-events-none">
          <span className="absolute left-0 top-1 font-mono text-[10px] text-outline ml-1">0mm</span>
          <span className="absolute left-[70mm] top-1 font-mono text-[10px] text-outline ml-1">{template.widthMm}mm</span>
        </div>

        {/* Vertical Left Ruler */}
        <div className="absolute left-0 top-8 bottom-0 w-6 ruler-y bg-surface-container-lowest border-r border-outline-variant z-10 pointer-events-none">
          <span className="absolute top-0 left-1 font-mono text-[10px] text-outline mt-1 origin-top-left -rotate-90">0mm</span>
          <span className="absolute top-[37mm] left-1 font-mono text-[10px] text-outline mt-1 origin-top-left -rotate-90">{template.heightMm}mm</span>
        </div>

        {/* Interactive Label Container */}
        <div 
          className="bg-surface-container-lowest shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] relative canvas-grid border border-outline-variant overflow-hidden transition-all rounded-xs"
          style={{ width: `${labelW}px`, height: `${labelH}px` }}
        >
          {/* Printable Safety Margin Boundary Line */}
          <div className="absolute inset-[2mm] border border-dashed border-error/30 pointer-events-none z-10" />

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
                className={`absolute box-border cursor-move group transition-shadow ${
                  isSelected ? 'outline-2 outline-primary shadow-md' : 'hover:outline-1 hover:outline-primary/50'
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

                {/* Corner Resize Handles */}
                {isSelected && (
                  <>
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'nw')}
                      className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs cursor-nwse-resize z-20"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'ne')}
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs cursor-nesw-resize z-20"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'sw')}
                      className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs cursor-nesw-resize z-20"
                    />
                    <div
                      onMouseDown={(e) => handleMouseDown(e, el.id, 'se')}
                      className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-primary border-2 border-white rounded-xs cursor-nwse-resize z-20"
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

// Render Element Inner Content
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

  if (el.type === 'image') {
    return el.src ? (
      <img src={el.src} alt="element" className="w-full h-full object-contain pointer-events-none" />
    ) : (
      <div className="w-full h-full bg-surface-container-low border border-dashed border-outline-variant flex items-center justify-center text-xs text-on-surface-variant font-mono">
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
