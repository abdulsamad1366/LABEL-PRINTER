import { LabelTemplate } from '../types/label';

const SEED_DATA_RAW: Array<{ sizeCode: string; widthMm: number; heightMm: number; across: number; explicitRows?: number }> = [
  { sizeCode: "1B",   widthMm: 199.5, heightMm: 280,    across: 1, explicitRows: 1 },
  { sizeCode: "1",    widthMm: 199.6, heightMm: 199.1,  across: 1, explicitRows: 1 },
  { sizeCode: "2",    widthMm: 199.6, heightMm: 143.5,  across: 1, explicitRows: 2 },
  { sizeCode: "4",    widthMm: 130,   heightMm: 96.1,   across: 2, explicitRows: 2 },
  { sizeCode: "4A",   widthMm: 200,   heightMm: 60,     across: 1, explicitRows: 4 },
  { sizeCode: "6",    widthMm: 99.1,  heightMm: 93.1,   across: 2, explicitRows: 3 },
  { sizeCode: "8",    widthMm: 99.1,  heightMm: 67.7,   across: 2, explicitRows: 4 },
  { sizeCode: "8R",   widthMm: 48.1,  heightMm: 140,    across: 4, explicitRows: 2 },
  { sizeCode: "9S",   widthMm: 105.935, heightMm: 74.25, across: 2, explicitRows: 4 },
  { sizeCode: "10",   widthMm: 99.1,  heightMm: 57,     across: 2, explicitRows: 5 },
  { sizeCode: "10FD", widthMm: 70,    heightMm: 52,     across: 2, explicitRows: 5 },
  { sizeCode: "12S",  widthMm: 69.8,  heightMm: 70.1,   across: 2, explicitRows: 6 },
  { sizeCode: "12A",  widthMm: 63.5,  heightMm: 72,     across: 3, explicitRows: 4 },
  { sizeCode: "12B",  widthMm: 104.7, heightMm: 48.4,   across: 3, explicitRows: 4 },
  { sizeCode: "14",   widthMm: 99.1,  heightMm: 38.1,   across: 2, explicitRows: 7 },
  { sizeCode: "16R",  widthMm: 48,    heightMm: 67,     across: 4, explicitRows: 4 },
  { sizeCode: "16S",  widthMm: 104.7, heightMm: 35,     across: 2, explicitRows: 8 },
  { sizeCode: "18",   widthMm: 63.5,  heightMm: 46.6,   across: 3, explicitRows: 6 },
  { sizeCode: "18A",  widthMm: 100,   heightMm: 30,     across: 2, explicitRows: 9 },
  { sizeCode: "18S",  widthMm: 69.8,  heightMm: 49.5,   across: 3, explicitRows: 6 },
  { sizeCode: "20R",  widthMm: 96,    heightMm: 28,     across: 2, explicitRows: 10 },
  { sizeCode: "21",   widthMm: 63.5,  heightMm: 38.1,   across: 3, explicitRows: 7 },
  { sizeCode: "24",   widthMm: 64,    heightMm: 34,     across: 3, explicitRows: 8 },
  { sizeCode: "24A",  widthMm: 134,   heightMm: 11,     across: 1, explicitRows: 24 },
  { sizeCode: "24S",  widthMm: 63.5,  heightMm: 35,     across: 3, explicitRows: 8 },
  { sizeCode: "27",   widthMm: 63.5,  heightMm: 29.6,   across: 3, explicitRows: 9 },
  { sizeCode: "30",   widthMm: 64,    heightMm: 26.7,   across: 3, explicitRows: 10 },
  { sizeCode: "30A",  widthMm: 39,    heightMm: 48,     across: 5, explicitRows: 6 },
  { sizeCode: "30S",  widthMm: 69.8,  heightMm: 29.7,   across: 3, explicitRows: 10 },
  { sizeCode: "32S",  widthMm: 52.3,  heightMm: 35,     across: 4, explicitRows: 8 },
  { sizeCode: "33S",  widthMm: 65,    heightMm: 25.4,   across: 3, explicitRows: 11 },
  { sizeCode: "36",   widthMm: 70.7,  heightMm: 24.7,   across: 3, explicitRows: 12 },
  { sizeCode: "36A",  widthMm: 48.9,  heightMm: 29.6,   across: 4, explicitRows: 9 },
  { sizeCode: "40",   widthMm: 45.7,  heightMm: 25.6,   across: 4, explicitRows: 10 },
  { sizeCode: "40N",  widthMm: 39,    heightMm: 35,     across: 5, explicitRows: 8 },
  { sizeCode: "42R",  widthMm: 65,    heightMm: 20,     across: 3, explicitRows: 14 },
  { sizeCode: "44R",  widthMm: 48,    heightMm: 25.4,   across: 4, explicitRows: 11 },
  { sizeCode: "44S",  widthMm: 52.3,  heightMm: 25,     across: 4, explicitRows: 11 },
  { sizeCode: "45",   widthMm: 58,    heightMm: 17.8,   across: 3, explicitRows: 15 },
  { sizeCode: "48",   widthMm: 48,    heightMm: 24.4,   across: 4, explicitRows: 12 },
  { sizeCode: "48A",  widthMm: 45.7,  heightMm: 21.2,   across: 4, explicitRows: 12 },
  { sizeCode: "56",   widthMm: 52.5,  heightMm: 12.7,   across: 4, explicitRows: 14 },
  { sizeCode: "56R",  widthMm: 48,    heightMm: 20,     across: 4, explicitRows: 14 },
  { sizeCode: "65",   widthMm: 38.1,  heightMm: 21.2,   across: 5, explicitRows: 13 },
  { sizeCode: "68",   widthMm: 48.5,  heightMm: 16.9,   across: 4, explicitRows: 17 },
  { sizeCode: "84",   widthMm: 46,    heightMm: 11.11,  across: 4, explicitRows: 21 }
];

export const SEED_TEMPLATES: LabelTemplate[] = SEED_DATA_RAW.map((item) => {
  const sheetWidth = 210;
  const sheetHeight = 297;
  
  // Parse nominal number prefix if available (e.g., "12A" -> 12)
  const countMatch = item.sizeCode.match(/^(\d+)/);
  const nominalCount = countMatch ? parseInt(countMatch[1], 10) : 1;
  
  // Calculate rows (or use explicit override)
  let calculatedRows = item.explicitRows !== undefined ? 
    item.explicitRows : 
    (nominalCount === 1 ? 1 : Math.max(1, Math.round(nominalCount / item.across)));
  
  // Calculate margins to center layout on A4 sheet
  const totalGridWidth = item.widthMm * item.across;
  const totalGridHeight = item.heightMm * calculatedRows;
  
  const marginLeft = Math.max(0, (sheetWidth - totalGridWidth) / 2);
  const marginTop = Math.max(0, (sheetHeight - totalGridHeight) / 2);

  return {
    id: `template_${item.sizeCode.toLowerCase()}`,
    sizeCode: item.sizeCode,
    widthMm: item.widthMm,
    heightMm: item.heightMm,
    across: item.across,
    rows: calculatedRows,
    marginTopMm: parseFloat(marginTop.toFixed(2)),
    marginBottomMm: parseFloat(marginTop.toFixed(2)),
    marginLeftMm: parseFloat(marginLeft.toFixed(2)),
    marginRightMm: parseFloat(marginLeft.toFixed(2)),
    colGapMm: 0,
    rowGapMm: 0,
    sheetWidthMm: sheetWidth,
    sheetHeightMm: sheetHeight,
    finish: 'Uncoated 70',
    color: 'Default',
    verified: true
  };
});
