export type FinishType = 
  | 'Uncoated 70' 
  | 'Fluorescent 75' 
  | 'Gloss Paper 80' 
  | 'Kraft' 
  | 'Pet Translucent' 
  | 'Pet Gloss PU' 
  | 'Inkjet Matte 60' 
  | 'Pet Silver Matte' 
  | 'Pet White Gloss';

export type LabelColor = 'Default' | 'Lemon' | 'Orange' | 'Green' | 'Pink' | 'Red' | 'Blue';

export interface LabelTemplate {
  id: string;
  sizeCode: string;
  widthMm: number;
  heightMm: number;
  across: number;        // Columns across
  rows: number;          // Rows down
  marginTopMm: number;
  marginLeftMm: number;
  colGapMm: number;
  rowGapMm: number;
  sheetWidthMm?: number;  // Default 210
  sheetHeightMm?: number; // Default 297
  cornerRadius?: number;
  finish?: FinishType;
  color?: LabelColor;
  verified?: boolean;
}

export type ElementType = 'text' | 'image' | 'barcode' | 'qrcode';

export interface LabelElement {
  id: string;
  type: ElementType;
  x: number;       // in mm
  y: number;       // in mm
  width: number;   // in mm
  height: number;  // in mm
  rotation?: number;
  
  // Text properties
  content?: string;
  fontSize?: number; // pt
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  letterSpacing?: number;
  lineHeight?: number;
  
  // Image properties
  src?: string;
  aspectRatioLock?: boolean;
  
  // Barcode properties
  value?: string;
  barcodeType?: 'CODE128' | 'CODE39' | 'EAN13';
  displayValue?: boolean;
}

export interface LabelDesign {
  elements: LabelElement[];
}

export type DataRow = Record<string, string>;

export interface Project {
  id: string;
  name: string;
  updatedAt: string;
  template: LabelTemplate;
  design: LabelDesign;
  applyToAll: boolean;
  individualOverrides?: Record<number, LabelElement[]>;
  csvData?: DataRow[];
}

export interface CalibrationSettings {
  horizontalOffset: number; // mm (+/- shift)
  verticalOffset: number;   // mm (+/- shift)
}
