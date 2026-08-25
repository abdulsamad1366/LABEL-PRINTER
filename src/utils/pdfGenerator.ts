import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { LabelTemplate, LabelElement, CalibrationSettings, DataRow } from '../types/label';

export async function generatePDF(
  template: LabelTemplate,
  elements: LabelElement[],
  options: {
    applyToAll?: boolean;
    individualOverrides?: Record<number, LabelElement[]>;
    csvData?: DataRow[];
    calibration?: CalibrationSettings;
    showBorders?: boolean;
  } = {}
): Promise<jsPDF> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [template.sheetWidthMm || 210, template.sheetHeightMm || 297]
  });

  const {
    widthMm, heightMm, across, rows,
    marginTopMm, marginLeftMm, colGapMm, rowGapMm
  } = template;

  const hOffset = options.calibration?.horizontalOffset || 0;
  const vOffset = options.calibration?.verticalOffset || 0;

  const labelsPerPage = across * rows;
  const totalItems = options.csvData && options.csvData.length > 0 ? options.csvData.length : labelsPerPage;
  const totalPages = Math.ceil(totalItems / labelsPerPage);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) doc.addPage();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < across; c++) {
        const gridIndex = r * across + c;
        const globalIndex = page * labelsPerPage + gridIndex;

        if (globalIndex >= totalItems && options.csvData) continue;

        const labelX = marginLeftMm + c * (widthMm + colGapMm) + hOffset;
        const labelY = marginTopMm + r * (heightMm + rowGapMm) + vOffset;

        if (options.showBorders) {
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.1);
          doc.rect(labelX, labelY, widthMm, heightMm);
        }

        // Get elements for this label
        let currentElements = elements;
        if (options.csvData && options.csvData[globalIndex]) {
          currentElements = applyRowDataToElements(elements, options.csvData[globalIndex]);
        } else if (options.individualOverrides && options.individualOverrides[gridIndex]) {
          currentElements = options.individualOverrides[gridIndex];
        }

        for (const el of currentElements) {
          await renderPdfElement(doc, el, labelX, labelY);
        }
      }
    }
  }

  return doc;
}

export function generateTestAlignmentPDF(template: LabelTemplate, calibration: CalibrationSettings): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [210, 297]
  });

  const hOffset = calibration.horizontalOffset || 0;
  const vOffset = calibration.verticalOffset || 0;

  doc.setFontSize(14);
  doc.text('PRINTER ALIGNMENT TEST SHEET', 105, 15, { align: 'center' });
  doc.setFontSize(9);
  doc.text('Measure 100 mm reference lines with a metric ruler. Adjust calibration in LabelStudio if shifted.', 105, 22, { align: 'center' });

  // Draw Horizontal 100mm Ruler Line
  const startX = 55 + hOffset;
  const startY = 40 + vOffset;
  doc.setLineWidth(0.3);
  doc.line(startX, startY, startX + 100, startY);
  doc.line(startX, startY - 3, startX, startY + 3);
  doc.line(startX + 50, startY - 2, startX + 50, startY + 2);
  doc.line(startX + 100, startY - 3, startX + 100, startY + 3);

  doc.setFontSize(8);
  doc.text('0 mm', startX, startY + 7, { align: 'center' });
  doc.text('50 mm', startX + 50, startY + 7, { align: 'center' });
  doc.text('100 mm', startX + 100, startY + 7, { align: 'center' });
  doc.text('HORIZONTAL 100 mm RULER LINE', startX + 50, startY - 5, { align: 'center' });

  // Draw Vertical 100mm Ruler Line
  const vStartX = 105 + hOffset;
  const vStartY = 70 + vOffset;
  doc.line(vStartX, vStartY, vStartX, vStartY + 100);
  doc.line(vStartX - 3, vStartY, vStartX + 3, vStartY);
  doc.line(vStartX - 2, vStartY + 50, vStartX + 2, vStartY + 50);
  doc.line(vStartX - 3, vStartY + 100, vStartX + 3, vStartY + 100);

  doc.text('0 mm', vStartX + 5, vStartY + 1);
  doc.text('50 mm', vStartX + 5, vStartY + 51);
  doc.text('100 mm', vStartX + 5, vStartY + 101);
  doc.text('VERTICAL 100 mm RULER LINE', vStartX, vStartY - 5, { align: 'center' });

  // Draw Corner Crosshairs for Grid Labels
  const { widthMm, heightMm, across, rows, marginTopMm, marginLeftMm, colGapMm, rowGapMm } = template;
  doc.setDrawColor(255, 0, 0); // Red crosshairs
  doc.setLineWidth(0.15);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < across; c++) {
      const lx = marginLeftMm + c * (widthMm + colGapMm) + hOffset;
      const ly = marginTopMm + r * (heightMm + rowGapMm) + vOffset;

      // Label bounding rectangle
      doc.setDrawColor(200, 200, 200);
      doc.rect(lx, ly, widthMm, heightMm);

      // Corner Crosshairs
      const cs = 3; // Crosshair size mm
      doc.setDrawColor(255, 0, 0);
      doc.line(lx - cs, ly, lx + cs, ly);
      doc.line(lx, ly - cs, lx, ly + cs);
    }
  }

  doc.text(`Calibration Applied: H=${hOffset}mm, V=${vOffset}mm`, 105, 285, { align: 'center' });
  return doc;
}

async function renderPdfElement(doc: jsPDF, el: LabelElement, labelX: number, labelY: number) {
  const x = labelX + el.x;
  const y = labelY + el.y;

  if (el.type === 'text' && el.content) {
    const fontPt = el.fontSize || 10;
    doc.setFontSize(fontPt);
    doc.setFont('helvetica', el.fontStyle === 'italic' ? 'italic' : (el.fontWeight === 'bold' ? 'bold' : 'normal'));
    
    if (el.color) doc.setTextColor(el.color);
    else doc.setTextColor(0, 0, 0);

    // Multi-line text splitting
    const lines = doc.splitTextToSize(el.content, el.width);
    const align = el.textAlign || 'center';
    let textX = x + el.width / 2;
    if (align === 'left') textX = x;
    if (align === 'right') textX = x + el.width;

    // Approximate text Y baseline offset
    const ptToMm = 0.3527777778;
    const lineSpacingMm = fontPt * ptToMm * (el.lineHeight || 1.1);
    
    lines.forEach((line: string, index: number) => {
      doc.text(line, textX, y + (fontPt * ptToMm) + (index * lineSpacingMm), { align });
    });
  } else if (el.type === 'image' && el.src) {
    try {
      doc.addImage(el.src, 'PNG', x, y, el.width, el.height);
    } catch {
      // Ignore image rendering errors if corrupt format
    }
  } else if (el.type === 'barcode' && el.value) {
    try {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, el.value, {
        format: el.barcodeType || 'CODE128',
        displayValue: el.displayValue !== false,
        height: 40,
        margin: 2
      });
      const dataUrl = canvas.toDataURL('image/png');
      doc.addImage(dataUrl, 'PNG', x, y, el.width, el.height);
    } catch {
      // Barcode fallback
    }
  } else if (el.type === 'qrcode' && el.value) {
    try {
      const dataUrl = await QRCode.toDataURL(el.value, { margin: 1 });
      doc.addImage(dataUrl, 'PNG', x, y, el.width, el.height);
    } catch {
      // QR code fallback
    }
  }
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
