import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { LabelTemplate, LabelElement, CalibrationSettings, DataRow } from '../types/label';

export async function preparePrintDOM(
  template: LabelTemplate,
  elements: LabelElement[],
  options: {
    applyToAll?: boolean;
    individualOverrides?: Record<number, LabelElement[]>;
    csvData?: DataRow[];
    calibration?: CalibrationSettings;
    showBorders?: boolean;
  } = {}
) {
  const printRoot = document.getElementById('print-root');
  if (!printRoot) return;

  const {
    widthMm, heightMm, across, rows,
    marginTopMm, marginLeftMm, colGapMm, rowGapMm,
    sheetWidthMm = 210, sheetHeightMm = 297, cornerRadius = 0
  } = template;

  const hOffset = options.calibration?.horizontalOffset || 0;
  const vOffset = options.calibration?.verticalOffset || 0;

  const labelsPerPage = across * rows;
  const totalItems = options.csvData && options.csvData.length > 0 ? options.csvData.length : labelsPerPage;
  const totalPages = Math.ceil(totalItems / labelsPerPage);

  let html = '';

  for (let page = 0; page < totalPages; page++) {
    html += `<div class="print-page-a4" style="
      width: ${sheetWidthMm}mm;
      height: ${sheetHeightMm}mm;
      transform: translate(${hOffset}mm, ${vOffset}mm);
    ">`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < across; c++) {
        const gridIndex = r * across + c;
        const globalIndex = page * labelsPerPage + gridIndex;

        if (globalIndex >= totalItems && options.csvData) continue;

        const xMm = marginLeftMm + c * (widthMm + colGapMm);
        const yMm = marginTopMm + r * (heightMm + rowGapMm);
        const borderStyle = options.showBorders ? 'border: 0.2mm solid #cbd5e1;' : 'border: none;';

        html += `<div class="print-label-cell" style="
          left: ${xMm}mm;
          top: ${yMm}mm;
          width: ${widthMm}mm;
          height: ${heightMm}mm;
          border-radius: ${cornerRadius}mm;
          ${borderStyle}
        ">`;

        let currentElements = elements;
        if (options.csvData && options.csvData[globalIndex]) {
          currentElements = applyRowDataToElements(elements, options.csvData[globalIndex]);
        } else if (options.individualOverrides && options.individualOverrides[gridIndex]) {
          currentElements = options.individualOverrides[gridIndex];
        }

        for (const el of currentElements) {
          html += renderElementHTML(el);
        }

        html += `</div>`;
      }
    }

    html += `</div>`;
  }

  printRoot.innerHTML = html;

  // Render SVG barcodes and QR codes inside print DOM
  const barcodeElems = printRoot.querySelectorAll<HTMLElement>('.print-barcode-target');
  barcodeElems.forEach(elem => {
    const val = elem.dataset.value;
    const type = elem.dataset.format || 'CODE128';
    if (val) {
      try {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        JsBarcode(svg, val, { format: type, displayValue: true, margin: 2, height: 40 });
        elem.appendChild(svg);
      } catch {
        elem.innerText = val;
      }
    }
  });

  const qrElems = printRoot.querySelectorAll<HTMLElement>('.print-qr-target');
  for (let i = 0; i < qrElems.length; i++) {
    const elem = qrElems[i];
    const val = elem.dataset.value;
    if (val) {
      try {
        const svg = await QRCode.toString(val, { type: 'svg', margin: 1 });
        elem.innerHTML = svg;
      } catch {
        elem.innerText = val;
      }
    }
  }
}

function renderElementHTML(el: LabelElement): string {
  const rotation = el.rotation ? `transform: rotate(${el.rotation}deg);` : '';

  if (el.type === 'text' && el.content) {
    const fontPt = el.fontSize || 10;
    return `<div class="print-element" style="
      left: ${el.x}mm;
      top: ${el.y}mm;
      width: ${el.width}mm;
      height: ${el.height}mm;
      ${rotation}
      font-family: ${el.fontFamily || 'Arial'}, sans-serif;
      font-size: ${fontPt}pt;
      font-weight: ${el.fontWeight || 'normal'};
      font-style: ${el.fontStyle || 'normal'};
      text-align: ${el.textAlign || 'center'};
      color: ${el.color || '#000000'};
      letter-spacing: ${el.letterSpacing || 0}px;
      line-height: ${el.lineHeight || 1.1};
      display: flex; align-items: center; justify-content: ${
        el.textAlign === 'left' ? 'flex-start' : (el.textAlign === 'right' ? 'flex-end' : 'center')
      }; word-break: break-word; white-space: pre-wrap;
    ">${escapeHtml(el.content)}</div>`;
  }

  if (el.type === 'image' && el.src) {
    return `<div class="print-element" style="
      left: ${el.x}mm;
      top: ${el.y}mm;
      width: ${el.width}mm;
      height: ${el.height}mm;
      ${rotation}
    "><img src="${el.src}" style="width:100%; height:100%; object-fit:contain;" /></div>`;
  }

  if (el.type === 'barcode' && el.value) {
    return `<div class="print-element print-barcode-target" data-value="${escapeHtml(el.value)}" data-format="${el.barcodeType || 'CODE128'}" style="
      left: ${el.x}mm;
      top: ${el.y}mm;
      width: ${el.width}mm;
      height: ${el.height}mm;
      ${rotation}
      overflow: hidden;
    "></div>`;
  }

  if (el.type === 'qrcode' && el.value) {
    return `<div class="print-element print-qr-target" data-value="${escapeHtml(el.value)}" style="
      left: ${el.x}mm;
      top: ${el.y}mm;
      width: ${el.width}mm;
      height: ${el.height}mm;
      ${rotation}
      display: flex; align-items: center; justify-content: center;
    "></div>`;
  }

  return '';
}

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

function escapeHtml(str: string): string {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
