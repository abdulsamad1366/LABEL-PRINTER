/**
 * Label Content Designer Engine for LabelPrint Studio
 * Manages label elements in physical millimetre (mm) units, handles drag/resize, alignment, and undo/redo history.
 */

class LabelDesigner {
  constructor(canvasContainer, onChangeCallback) {
    this.container = canvasContainer;
    this.onChange = onChangeCallback || (() => {});

    // Primary State (All measurements strictly in mm)
    this.sheetConfig = {
      paperWidth: 210,
      paperHeight: 297,
      labelWidth: 63.5,
      labelHeight: 38.1,
      rows: 7,
      columns: 3,
      topMargin: 15.15,
      leftMargin: 9.75,
      horizontalGap: 0,
      verticalGap: 0,
      cornerRadius: 2
    };

    this.elements = [];
    this.individualLabelOverrides = {}; // Map of labelIndex -> elements array (if applyToAll is false)
    this.applyToAll = true;
    this.selectedLabelIndex = 0;

    this.selectedElementId = null;
    this.zoomLevel = 1.0; // Visual preview scale only!
    this.gridSnap = true;
    this.gridSize = 1.0; // mm

    // Undo / Redo history
    this.history = [];
    this.historyIndex = -1;
    this.maxHistory = 40;

    // Canvas rendering scale (Pixels per mm on screen preview canvas)
    // Base scale: 1 mm = 3.7795275591 pixels (96 DPI screen reference)
    this.pxPerMm = 3.7795275591;

    // Interaction state
    this.isDragging = false;
    this.isResizing = false;
    this.activeHandle = null;
    this.dragStart = { x: 0, y: 0 };
    this.elementStart = { x: 0, y: 0, w: 0, h: 0 };

    this.bindEvents();
  }

  // --- History Management ---
  saveState() {
    // Truncate future states if we performed an action after undo
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    const stateCopy = JSON.parse(JSON.stringify({
      elements: this.elements,
      individualLabelOverrides: this.individualLabelOverrides,
      applyToAll: this.applyToAll,
      sheetConfig: this.sheetConfig
    }));
    this.history.push(stateCopy);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }
    this.historyIndex = this.history.length - 1;
    this.onChange();
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState(this.history[this.historyIndex]);
    }
  }

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState(this.history[this.historyIndex]);
    }
  }

  restoreState(state) {
    if (!state) return;
    this.elements = JSON.parse(JSON.stringify(state.elements));
    this.individualLabelOverrides = JSON.parse(JSON.stringify(state.individualLabelOverrides || {}));
    this.applyToAll = state.applyToAll;
    this.render();
    this.onChange();
  }

  // --- Element CRUD ---
  addElement(type, customProps = {}) {
    const id = 'el_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    let newElement = {
      id,
      type,
      x: 5,
      y: 5,
      width: 30,
      height: 10,
      rotation: 0
    };

    if (type === 'text') {
      newElement = Object.assign(newElement, {
        text: 'Sample Text',
        fontSize: 10,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'center',
        color: '#000000',
        letterSpacing: 0,
        lineHeight: 1.1,
        width: 40,
        height: 8
      }, customProps);
    } else if (type === 'image') {
      newElement = Object.assign(newElement, {
        src: customProps.src || '',
        aspectRatioLock: true,
        width: 25,
        height: 25
      }, customProps);
    } else if (type === 'barcode') {
      newElement = Object.assign(newElement, {
        value: '123456789',
        barcodeType: 'CODE128',
        displayValue: true,
        width: 35,
        height: 12
      }, customProps);
    } else if (type === 'qrcode') {
      newElement = Object.assign(newElement, {
        value: 'https://example.com',
        width: 15,
        height: 15
      }, customProps);
    }

    // Adjust element coordinates if grid snap is active
    if (this.gridSnap) {
      newElement.x = this.snapToGridValue(newElement.x);
      newElement.y = this.snapToGridValue(newElement.y);
    }

    this.getCurrentElementsList().push(newElement);
    this.selectedElementId = id;
    this.saveState();
    this.render();
    return newElement;
  }

  getCurrentElementsList() {
    if (this.applyToAll) {
      return this.elements;
    } else {
      if (!this.individualLabelOverrides[this.selectedLabelIndex]) {
        // Clone default elements for custom label
        this.individualLabelOverrides[this.selectedLabelIndex] = JSON.parse(JSON.stringify(this.elements));
      }
      return this.individualLabelOverrides[this.selectedLabelIndex];
    }
  }

  getSelectedElement() {
    if (!this.selectedElementId) return null;
    return this.getCurrentElementsList().find(el => el.id === this.selectedElementId);
  }

  updateSelectedElement(props) {
    const el = this.getSelectedElement();
    if (!el) return;

    Object.assign(el, props);

    if (this.gridSnap) {
      if (props.x !== undefined) el.x = this.snapToGridValue(el.x);
      if (props.y !== undefined) el.y = this.snapToGridValue(el.y);
      if (props.width !== undefined) el.width = Math.max(1, this.snapToGridValue(el.width));
      if (props.height !== undefined) el.height = Math.max(1, this.snapToGridValue(el.height));
    }

    this.saveState();
    this.render();
  }

  deleteSelectedElement() {
    if (!this.selectedElementId) return;
    const list = this.getCurrentElementsList();
    const idx = list.findIndex(el => el.id === this.selectedElementId);
    if (idx >= 0) {
      list.splice(idx, 1);
      this.selectedElementId = null;
      this.saveState();
      this.render();
    }
  }

  duplicateSelectedElement() {
    const el = this.getSelectedElement();
    if (!el) return;
    const cloned = JSON.parse(JSON.stringify(el));
    cloned.id = 'el_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    cloned.x += 2;
    cloned.y += 2;
    this.getCurrentElementsList().push(cloned);
    this.selectedElementId = cloned.id;
    this.saveState();
    this.render();
  }

  // --- Alignment & Layering ---
  alignSelectedElement(alignment) {
    const el = this.getSelectedElement();
    if (!el) return;

    const labelW = this.sheetConfig.labelWidth;
    const labelH = this.sheetConfig.labelHeight;

    switch (alignment) {
      case 'left':
        el.x = 0;
        break;
      case 'centerH':
        el.x = (labelW - el.width) / 2;
        break;
      case 'right':
        el.x = labelW - el.width;
        break;
      case 'top':
        el.y = 0;
        break;
      case 'centerV':
        el.y = (labelH - el.height) / 2;
        break;
      case 'bottom':
        el.y = labelH - el.height;
        break;
    }

    if (this.gridSnap) {
      el.x = this.snapToGridValue(el.x);
      el.y = this.snapToGridValue(el.y);
    }

    this.saveState();
    this.render();
  }

  changeZIndex(direction) {
    const list = this.getCurrentElementsList();
    const idx = list.findIndex(el => el.id === this.selectedElementId);
    if (idx < 0) return;

    if (direction === 'forward' && idx < list.length - 1) {
      const temp = list[idx];
      list[idx] = list[idx + 1];
      list[idx + 1] = temp;
    } else if (direction === 'backward' && idx > 0) {
      const temp = list[idx];
      list[idx] = list[idx - 1];
      list[idx - 1] = temp;
    }
    this.saveState();
    this.render();
  }

  snapToGridValue(val) {
    if (!this.gridSnap || this.gridSize <= 0) return val;
    return Math.round(val / this.gridSize) * this.gridSize;
  }

  // --- Render Editor Canvas ---
  render() {
    if (!this.container) return;

    // Calculate canvas size in pixels based on zoom level and paper size
    const paperWidthPx = this.sheetConfig.paperWidth * this.pxPerMm * this.zoomLevel;
    const paperHeightPx = this.sheetConfig.paperHeight * this.pxPerMm * this.zoomLevel;

    this.container.style.width = `${paperWidthPx}px`;
    this.container.style.height = `${paperHeightPx}px`;

    // Render A4 Paper Base
    let html = `<div class="a4-paper-sheet" style="width:${paperWidthPx}px; height:${paperHeightPx}px;">`;

    const {
      columns, rows, labelWidth, labelHeight,
      topMargin, leftMargin, horizontalGap, verticalGap, cornerRadius
    } = this.sheetConfig;

    const totalLabels = columns * rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        const index = r * columns + c;
        const xMm = leftMargin + c * (labelWidth + horizontalGap);
        const yMm = topMargin + r * (labelHeight + verticalGap);

        const xPx = xMm * this.pxPerMm * this.zoomLevel;
        const yPx = yMm * this.pxPerMm * this.zoomLevel;
        const wPx = labelWidth * this.pxPerMm * this.zoomLevel;
        const hPx = labelHeight * this.pxPerMm * this.zoomLevel;
        const radPx = cornerRadius * this.pxPerMm * this.zoomLevel;

        const isSelectedLabel = (index === this.selectedLabelIndex);

        // Retrieve elements for this specific label
        let labelElements = this.applyToAll ?
          this.elements :
          (this.individualLabelOverrides[index] || this.elements);

        html += `<div class="label-box ${isSelectedLabel ? 'active-label-box' : ''}" 
                      data-label-index="${index}"
                      style="left:${xPx}px; top:${yPx}px; width:${wPx}px; height:${hPx}px; border-radius:${radPx}px;">`;

        // Render Label Index Tag
        html += `<span class="label-number-tag">${index + 1}</span>`;

        // Render elements inside label
        for (let el of labelElements) {
          const elXPx = el.x * this.pxPerMm * this.zoomLevel;
          const elYPx = el.y * this.pxPerMm * this.zoomLevel;
          const elWPx = el.width * this.pxPerMm * this.zoomLevel;
          const elHPx = el.height * this.pxPerMm * this.zoomLevel;
          const isSelectedEl = isSelectedLabel && (el.id === this.selectedElementId);

          html += `<div class="label-element ${isSelectedEl ? 'selected-element' : ''}"
                        data-element-id="${el.id}"
                        style="left:${elXPx}px; top:${elYPx}px; width:${elWPx}px; height:${elHPx}px; transform: rotate(${el.rotation || 0}deg);">`;

          html += this.renderElementContent(el, elWPx, elHPx);

          if (isSelectedEl) {
            html += `<div class="resize-handle handle-nw" data-handle="nw"></div>
                     <div class="resize-handle handle-ne" data-handle="ne"></div>
                     <div class="resize-handle handle-sw" data-handle="sw"></div>
                     <div class="resize-handle handle-se" data-handle="se"></div>`;
          }

          html += `</div>`;
        }

        html += `</div>`;
      }
    }

    html += `</div>`;
    this.container.innerHTML = html;
  }

  renderElementContent(el, wPx, hPx) {
    if (el.type === 'text') {
      const fontSizePx = (el.fontSize * 1.333) * this.zoomLevel; // pt to px approximation
      return `<div class="text-element-content" style="
        font-family: ${el.fontFamily || 'Arial'};
        font-size: ${fontSizePx}px;
        font-weight: ${el.fontWeight || 'normal'};
        font-style: ${el.fontStyle || 'normal'};
        text-align: ${el.textAlign || 'center'};
        color: ${el.color || '#000'};
        letter-spacing: ${el.letterSpacing || 0}px;
        line-height: ${el.lineHeight || 1.1};
        width: 100%; height: 100%; display: flex; align-items: center; justify-content: ${
          el.textAlign === 'left' ? 'flex-start' : (el.textAlign === 'right' ? 'flex-end' : 'center')
        }; word-break: break-word; white-space: pre-wrap;">${this.escapeHtml(el.text || '')}</div>`;
    } else if (el.type === 'image') {
      return `<img src="${el.src || ''}" alt="label image" style="width:100%; height:100%; object-fit: contain; pointer-events: none;" />`;
    } else if (el.type === 'barcode') {
      const svg = window.JsBarcode ? window.JsBarcode.getSVG(el.value || '123456', {
        format: el.barcodeType || 'CODE128',
        displayValue: el.displayValue !== false,
        height: Math.max(15, hPx - 12),
        margin: 2
      }) : `<div style="font-size:10px;">[BARCODE ${el.value}]</div>`;
      return `<div class="barcode-wrapper" style="width:100%; height:100%; overflow:hidden;">${svg}</div>`;
    } else if (el.type === 'qrcode') {
      const qrSvg = window.QRCode ? window.QRCode.generateSVG(el.value || 'https://example.com', {
        width: wPx,
        height: hPx
      }) : `<div style="font-size:10px;">[QR ${el.value}]</div>`;
      return `<div class="qrcode-wrapper" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${qrSvg}</div>`;
    }
    return '';
  }

  escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- Interaction Event Wiring ---
  bindEvents() {
    if (!this.container) return;

    this.container.addEventListener('mousedown', (e) => {
      const labelBox = e.target.closest('.label-box');
      if (labelBox) {
        const labelIndex = parseInt(labelBox.dataset.labelIndex, 10);
        if (this.selectedLabelIndex !== labelIndex) {
          this.selectedLabelIndex = labelIndex;
          if (!this.applyToAll && !this.individualLabelOverrides[labelIndex]) {
            this.individualLabelOverrides[labelIndex] = JSON.parse(JSON.stringify(this.elements));
          }
        }
      }

      const handle = e.target.closest('.resize-handle');
      const elemNode = e.target.closest('.label-element');

      if (handle && elemNode) {
        e.stopPropagation();
        this.isResizing = true;
        this.activeHandle = handle.dataset.handle;
        this.selectedElementId = elemNode.dataset.elementId;
        const el = this.getSelectedElement();
        if (el) {
          this.dragStart = { x: e.clientX, y: e.clientY };
          this.elementStart = { x: el.x, y: el.y, w: el.width, h: el.height };
        }
        return;
      }

      if (elemNode) {
        e.stopPropagation();
        this.selectedElementId = elemNode.dataset.elementId;
        this.isDragging = true;
        const el = this.getSelectedElement();
        if (el) {
          this.dragStart = { x: e.clientX, y: e.clientY };
          this.elementStart = { x: el.x, y: el.y, w: el.width, h: el.height };
        }
        this.render();
        this.onChange();
        return;
      }

      // Clicked empty background inside label or page
      this.selectedElementId = null;
      this.render();
      this.onChange();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging && !this.isResizing) return;
      const el = this.getSelectedElement();
      if (!el) return;

      const dxPx = e.clientX - this.dragStart.x;
      const dyPx = e.clientY - this.dragStart.y;

      const dxMm = dxPx / (this.pxPerMm * this.zoomLevel);
      const dyMm = dyPx / (this.pxPerMm * this.zoomLevel);

      if (this.isDragging) {
        let newX = this.elementStart.x + dxMm;
        let newY = this.elementStart.y + dyMm;
        if (this.gridSnap) {
          newX = this.snapToGridValue(newX);
          newY = this.snapToGridValue(newY);
        }
        el.x = Math.max(0, Math.min(this.sheetConfig.labelWidth - el.width, newX));
        el.y = Math.max(0, Math.min(this.sheetConfig.labelHeight - el.height, newY));
        this.render();
      } else if (this.isResizing) {
        let newW = this.elementStart.w;
        let newH = this.elementStart.h;
        let newX = this.elementStart.x;
        let newY = this.elementStart.y;

        if (this.activeHandle.includes('e')) newW = this.elementStart.w + dxMm;
        if (this.activeHandle.includes('s')) newH = this.elementStart.h + dyMm;
        if (this.activeHandle.includes('w')) {
          newW = this.elementStart.w - dxMm;
          newX = this.elementStart.x + dxMm;
        }
        if (this.activeHandle.includes('n')) {
          newH = this.elementStart.h - dyMm;
          newY = this.elementStart.y + dyMm;
        }

        if (this.gridSnap) {
          newW = this.snapToGridValue(newW);
          newH = this.snapToGridValue(newH);
          newX = this.snapToGridValue(newX);
          newY = this.snapToGridValue(newY);
        }

        el.width = Math.max(2, newW);
        el.height = Math.max(2, newH);
        el.x = newX;
        el.y = newY;
        this.render();
      }
    });

    window.addEventListener('mouseup', () => {
      if (this.isDragging || this.isResizing) {
        this.isDragging = false;
        this.isResizing = false;
        this.saveState();
      }
    });
  }
}

window.LabelDesigner = LabelDesigner;
