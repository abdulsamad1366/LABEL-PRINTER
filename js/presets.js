/**
 * Standard A4 Label Presets derived from reference chart PHOTO-2026-08-25-18-00-01.jpg
 * All measurements in millimetres (mm)
 */

const LABEL_PRESETS = [
  {
    id: "preset-1",
    count: 1,
    name: "1 Label (Full A4 Page)",
    code: "A4ST1-100S",
    width: 210,
    height: 297,
    columns: 1,
    rows: 1,
    topMargin: 0,
    leftMargin: 0,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 0,
    verified: true
  },
  {
    id: "preset-2",
    count: 2,
    name: "2 Labels (198 × 143.5 mm)",
    code: "A4ST2-100S",
    width: 198,
    height: 143.5,
    columns: 1,
    rows: 2,
    topMargin: 5,
    leftMargin: 6,
    horizontalGap: 0,
    verticalGap: 5,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-4",
    count: 4,
    name: "4 Labels (138 × 99.1 mm)",
    code: "A4ST4-100S",
    width: 138,
    height: 99.1,
    columns: 2,
    rows: 2,
    topMargin: 4.9,
    leftMargin: 17,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-6",
    count: 6,
    name: "6 Labels (99.1 × 93.1 mm)",
    code: "A4ST6-100S",
    width: 99.1,
    height: 93.1,
    columns: 2,
    rows: 3,
    topMargin: 8.85,
    leftMargin: 5.9,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-8",
    count: 8,
    name: "8 Labels (99.1 × 67.7 mm)",
    code: "A4ST8-100S",
    width: 99.1,
    height: 67.7,
    columns: 2,
    rows: 4,
    topMargin: 13.1,
    leftMargin: 5.9,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-10",
    count: 10,
    name: "10 Labels (99.1 × 57 mm)",
    code: "A4ST10-100S",
    width: 99.1,
    height: 57,
    columns: 2,
    rows: 5,
    topMargin: 6,
    leftMargin: 5.9,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-12",
    count: 12,
    name: "12 Labels (100 × 44 mm)",
    code: "A4ST12-100S",
    width: 100,
    height: 44,
    columns: 2,
    rows: 6,
    topMargin: 16.5,
    leftMargin: 5,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-14",
    count: 14,
    name: "14 Labels (99.1 × 38.1 mm)",
    code: "A4ST14-100S",
    width: 99.1,
    height: 38.1,
    columns: 2,
    rows: 7,
    topMargin: 15.15,
    leftMargin: 5.9,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-16",
    count: 16,
    name: "16 Labels (99.1 × 33.8 mm)",
    code: "A4ST16-100S",
    width: 99.1,
    height: 33.8,
    columns: 2,
    rows: 8,
    topMargin: 13.3,
    leftMargin: 5.9,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-18",
    count: 18,
    name: "18 Labels (63 × 46.6 mm)",
    code: "A4ST18-100S",
    width: 63,
    height: 46.6,
    columns: 3,
    rows: 6,
    topMargin: 8.7,
    leftMargin: 10.5,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-21",
    count: 21,
    name: "21 Labels (63.5 × 38.1 mm)",
    code: "A4ST21-100S",
    width: 63.5,
    height: 38.1,
    columns: 3,
    rows: 7,
    topMargin: 15.15,
    leftMargin: 9.75,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-24",
    count: 24,
    name: "24 Labels (64 × 34 mm)",
    code: "A4ST24-100S",
    width: 64,
    height: 34,
    columns: 3,
    rows: 8,
    topMargin: 12.5,
    leftMargin: 9,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-30",
    count: 30,
    name: "30 Labels (70 × 29.7 mm)",
    code: "A4ST30-100S",
    width: 70,
    height: 29.7,
    columns: 3,
    rows: 10,
    topMargin: 0,
    leftMargin: 0,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: true
  },
  {
    id: "preset-40",
    count: 40,
    name: "40 Labels (45.76 × 25.6 mm)",
    code: "A4ST40-100S",
    width: 45.76,
    height: 25.6,
    columns: 4,
    rows: 10,
    topMargin: 20.5,
    leftMargin: 13.48,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1.5,
    verified: true
  },
  {
    id: "preset-56",
    count: 56,
    name: "56 Labels (52.5 × 21.2 mm)",
    code: "A4ST56-100S",
    width: 52.5,
    height: 21.2,
    columns: 4,
    rows: 14,
    topMargin: 0,
    leftMargin: 0,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1,
    verified: true
  },
  {
    id: "preset-65",
    count: 65,
    name: "65 Labels (38.1 × 21.2 mm)",
    code: "A4ST65-100S",
    width: 38.1,
    height: 21.2,
    columns: 5,
    rows: 13,
    topMargin: 10.7,
    leftMargin: 9.75,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1,
    verified: true
  },
  {
    id: "preset-84",
    count: 84,
    name: "84 Labels (46 × 11.1 mm)",
    code: "A4ST84-100S",
    width: 46,
    height: 11.1,
    columns: 4,
    rows: 21,
    topMargin: 31.9,
    leftMargin: 13,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1,
    verified: true
  },

  // Chart entries needing physical verification
  {
    id: "preset-8R",
    count: 8,
    name: "8R Labels (48.1 × 146 mm)",
    code: "A4ST8R-100S",
    width: 48.1,
    height: 146,
    columns: 4,
    rows: 2,
    topMargin: 2.5,
    leftMargin: 8.8,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: false,
    note: "Dimensions need verification"
  },
  {
    id: "preset-12S",
    count: 12,
    name: "12S Labels (69.8 × 70 mm)",
    code: "A4ST12S-100S",
    width: 69.8,
    height: 70,
    columns: 3,
    rows: 4,
    topMargin: 8.5,
    leftMargin: 0.3,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 2,
    verified: false,
    note: "Dimensions need verification"
  },
  {
    id: "preset-27",
    count: 27,
    name: "27 Labels (194 × 11 mm)",
    code: "A4ST27-100S",
    width: 194,
    height: 11,
    columns: 1,
    rows: 27,
    topMargin: 0,
    leftMargin: 8,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1,
    verified: false,
    note: "Dimensions need verification"
  },
  {
    id: "preset-36",
    count: 36,
    name: "36 Labels (70 × 24.7 mm)",
    code: "A4ST36-100S",
    width: 70,
    height: 24.7,
    columns: 3,
    rows: 12,
    topMargin: 0,
    leftMargin: 0,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1,
    verified: false,
    note: "Dimensions need verification"
  },
  {
    id: "preset-48",
    count: 48,
    name: "48 Labels (45.7 × 21.2 mm)",
    code: "A4ST48-100S",
    width: 45.7,
    height: 21.2,
    columns: 4,
    rows: 12,
    topMargin: 10,
    leftMargin: 10,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1,
    verified: false,
    note: "Dimensions need verification"
  },
  {
    id: "preset-68",
    count: 68,
    name: "68 Labels (48.5 × 16.9 mm)",
    code: "A4ST68-100S",
    width: 48.5,
    height: 16.9,
    columns: 4,
    rows: 17,
    topMargin: 5,
    leftMargin: 5,
    horizontalGap: 0,
    verticalGap: 0,
    cornerRadius: 1,
    verified: false,
    note: "Dimensions need verification"
  }
];

class PresetManager {
  static getAllPresets() {
    const custom = StorageManager.getCustomPresets();
    return [...LABEL_PRESETS, ...custom];
  }

  static getPresetById(id) {
    return this.getAllPresets().find(p => p.id === id);
  }

  /**
   * Generates a mini SVG grid icon matching the visual packaging chart look
   */
  static renderMiniGridSVG(cols, rows, width = 60, height = 75) {
    const pad = 4;
    const innerW = width - (pad * 2);
    const innerH = height - (pad * 2);

    const cellW = innerW / cols;
    const cellH = innerH / rows;

    let rects = '';
    // Cap visual rendering grid to avoid SVG clutter for huge counts
    const maxCols = Math.min(cols, 8);
    const maxRows = Math.min(rows, 16);
    const renderCellW = innerW / maxCols;
    const renderCellH = innerH / maxRows;

    for (let r = 0; r < maxRows; r++) {
      for (let c = 0; c < maxCols; c++) {
        const x = pad + c * renderCellW;
        const y = pad + r * renderCellH;
        rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(renderCellW - 0.8).toFixed(1)}" height="${(renderCellH - 0.8).toFixed(1)}" fill="#ffffff" stroke="#94a3b8" stroke-width="0.5" rx="1" />`;
      }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f1f5f9" rx="3" stroke="#cbd5e1" stroke-width="1"/>
      ${rects}
    </svg>`;
  }
}

window.LABEL_PRESETS = LABEL_PRESETS;
window.PresetManager = PresetManager;
