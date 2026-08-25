/**
 * Print Engine for LabelPrint Studio
 * Handles physical A4 layout generation in millimetres (mm), print calibration offset transforms,
 * validation rules, calibration test sheet rendering, and dimension test mode.
 */

class LabelPrinter {
  constructor() {
    this.calibration = StorageManager.getCalibration();
  }

  setCalibration(horizontalOffset, verticalOffset) {
    this.calibration = {
      horizontalOffset: parseFloat(horizontalOffset) || 0,
      verticalOffset: parseFloat(verticalOffset) || 0
    };
    StorageManager.saveCalibration(this.calibration);
  }

  // --- Validation ---
  validateLayout(sheetConfig) {
    const {
      paperWidth, paperHeight, labelWidth, labelHeight,
      columns, rows, topMargin, leftMargin, horizontalGap, verticalGap
    } = sheetConfig;

    const errors = [];

    if (labelWidth <= 0 || labelHeight <= 0) {
      errors.push('Label dimensions must be positive numbers.');
    }
    if (columns <= 0 || rows <= 0) {
      errors.push('Rows and columns must be at least 1.');
    }

    const totalWidthNeeded = leftMargin + (columns * labelWidth) + ((columns - 1) * horizontalGap);
    const totalHeightNeeded = topMargin + (rows * labelHeight) + ((rows - 1) * verticalGap);

    if (totalWidthNeeded > paperWidth + 0.01) {
      errors.push(`Total layout width (${totalWidthNeeded.toFixed(2)} mm) exceeds paper width (${paperWidth} mm).`);
    }

    if (totalHeightNeeded > paperHeight + 0.01) {
      errors.push(`Total layout height (${totalHeightNeeded.toFixed(2)} mm) exceeds paper height (${paperHeight} mm).`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      totalWidthNeeded,
      totalHeightNeeded
    };
  }

  // --- Generate Print DOM Container ---
  preparePrintContainer(sheetConfig, elements, options = {}) {
    const {
      showBorders = false,
      showNumbers = false,
      isTestDimensionMode = false,
      isCalibrationTest = false,
      individualOverrides = {},
      applyToAll = true
    } = options;

    let printArea = document.getElementById('print-area-wrapper');
    if (!printArea) {
      printArea = document.createElement('div');
      printArea.id = 'print-area-wrapper';
      document.body.appendChild(printArea);
    }

    // Apply calibration offset shift via inline style transform or margin
    const hOffset = this.calibration.horizontalOffset || 0;
    const vOffset = this.calibration.verticalOffset || 0;

    let html = '';

    if (isCalibrationTest) {
      html = this.generateCalibrationTestSheetHTML(hOffset, vOffset);
    } else {
      const {
        paperWidth, paperHeight, labelWidth, labelHeight,
        columns, rows, topMargin, leftMargin, horizontalGap, verticalGap, cornerRadius
      } = sheetConfig;

      html = `<div class="print-page-a4" style="
        width: ${paperWidth}mm;
        height: ${paperHeight}mm;
        transform: translate(${hOffset}mm, ${vOffset}mm);
      ">`;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const index = r * columns + c;
          const xMm = leftMargin + c * (labelWidth + horizontalGap);
          const yMm = topMargin + r * (labelHeight + verticalGap);

          const borderStyle = showBorders ? 'border: 0.2mm solid #94a3b8;' : 'border: none;';

          html += `<div class="print-label-box" style="
            left: ${xMm}mm;
            top: ${yMm}mm;
            width: ${labelWidth}mm;
            height: ${labelHeight}mm;
            border-radius: ${cornerRadius}mm;
            ${borderStyle}
          ">`;

          if (showNumbers) {
            html += `<span class="print-label-num">${index + 1}</span>`;
          }

          if (isTestDimensionMode) {
            html += `<div class="print-test-dim-text">
              <strong>TEST LABEL</strong><br/>
              WIDTH = ${labelWidth.toFixed(2)} mm<br/>
              HEIGHT = ${labelHeight.toFixed(2)} mm
            </div>`;
          } else {
            const labelElements = applyToAll ?
              elements :
              (individualOverrides[index] || elements);

            for (let el of labelElements) {
              html += `<div class="print-label-element" style="
                left: ${el.x}mm;
                top: ${el.y}mm;
                width: ${el.width}mm;
                height: ${el.height}mm;
                transform: rotate(${el.rotation || 0}deg);
              ">`;

              html += this.renderPrintElementContent(el);

              html += `</div>`;
            }
          }

          html += `</div>`;
        }
      }

      html += `</div>`;
    }

    printArea.innerHTML = html;
  }

  renderPrintElementContent(el) {
    if (el.type === 'text') {
      const fontPt = el.fontSize || 10;
      return `<div style="
        font-family: ${el.fontFamily || 'Arial'}, sans-serif;
        font-size: ${fontPt}pt;
        font-weight: ${el.fontWeight || 'normal'};
        font-style: ${el.fontStyle || 'normal'};
        text-align: ${el.textAlign || 'center'};
        color: ${el.color || '#000000'};
        letter-spacing: ${el.letterSpacing || 0}px;
        line-height: ${el.lineHeight || 1.1};
        width: 100%; height: 100%; display: flex; align-items: center; justify-content: ${
          el.textAlign === 'left' ? 'flex-start' : (el.textAlign === 'right' ? 'flex-end' : 'center')
        }; word-break: break-word; white-space: pre-wrap;">${this.escapeHtml(el.text || '')}</div>`;
    } else if (el.type === 'image') {
      return `<img src="${el.src || ''}" style="width:100%; height:100%; object-fit:contain;" />`;
    } else if (el.type === 'barcode') {
      const svg = window.JsBarcode ? window.JsBarcode.getSVG(el.value || '123456', {
        format: el.barcodeType || 'CODE128',
        displayValue: el.displayValue !== false,
        height: 40,
        margin: 2
      }) : `<div>[BARCODE ${el.value}]</div>`;
      return `<div style="width:100%; height:100%; overflow:hidden;">${svg}</div>`;
    } else if (el.type === 'qrcode') {
      const qrSvg = window.QRCode ? window.QRCode.generateSVG(el.value || 'https://example.com', {
        width: 100,
        height: 100
      }) : `<div>[QR ${el.value}]</div>`;
      return `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;">${qrSvg}</div>`;
    }
    return '';
  }

  generateCalibrationTestSheetHTML(hOffset, vOffset) {
    return `<div class="print-page-a4" style="
      width: 210mm;
      height: 297mm;
      transform: translate(${hOffset}mm, ${vOffset}mm);
    ">
      <div class="calib-container" style="padding: 20mm;">
        <h1 style="font-size: 16pt; margin-bottom: 5mm; text-align: center;">PRINTER CALIBRATION TEST SHEET</h1>
        <p style="font-size: 10pt; line-height: 1.4; text-align: center; max-width: 150mm; margin: 0 auto 10mm auto;">
          Instructions: Measure the 100 mm reference lines below with a physical ruler.<br/>
          If a 100 mm line measures differently on paper, update printer scaling to "100% / Actual Size".<br/>
          If alignment is shifted horizontally or vertically, enter calibration offsets in LabelPrint Studio.
        </p>

        <!-- Horizontal 100 mm Ruler Line -->
        <div style="margin: 15mm auto; width: 100mm; text-align: center; position: relative;">
          <div style="font-weight: bold; font-size: 10pt; margin-bottom: 2mm;">HORIZONTAL REFERENCE LINE (EXACTLY 100 mm)</div>
          <div style="width: 100mm; height: 12mm; border-bottom: 1px solid #000; border-left: 2px solid #000; border-right: 2px solid #000; position: relative;">
            <div style="position: absolute; left: 0; bottom: 0; font-size: 7pt;">0mm</div>
            <div style="position: absolute; left: 50mm; bottom: 0; font-size: 7pt; transform: translateX(-50%);">50mm</div>
            <div style="position: absolute; right: 0; bottom: 0; font-size: 7pt;">100mm</div>
          </div>
        </div>

        <!-- Vertical 100 mm Ruler Line -->
        <div style="margin: 15mm auto; height: 100mm; width: 40mm; text-align: center; position: relative;">
          <div style="font-weight: bold; font-size: 10pt; margin-bottom: 2mm;">VERTICAL 100 mm LINE</div>
          <div style="height: 100mm; width: 12mm; border-right: 1px solid #000; border-top: 2px solid #000; border-bottom: 2px solid #000; margin: 0 auto; position: relative;">
            <div style="position: absolute; top: 0; right: 14mm; font-size: 7pt;">0mm</div>
            <div style="position: absolute; top: 50mm; right: 14mm; font-size: 7pt; transform: translateY(-50%);">50mm</div>
            <div style="position: absolute; bottom: 0; right: 14mm; font-size: 7pt;">100mm</div>
          </div>
        </div>

        <div style="position: absolute; bottom: 20mm; left: 20mm; right: 20mm; text-align: center; font-size: 9pt; border-top: 1px dashed #ccc; padding-top: 5mm;">
          Current Calibration Applied: Horizontal Offset = ${hOffset} mm | Vertical Offset = ${vOffset} mm
        </div>
      </div>
    </div>`;
  }

  escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  triggerPrint() {
    window.print();
  }
}

window.LabelPrinter = LabelPrinter;
