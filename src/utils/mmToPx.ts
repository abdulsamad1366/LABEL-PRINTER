/**
 * Millimetre to Pixel conversion helpers
 * 1 inch = 25.4 mm
 * Standard screen reference: 96 DPI -> 1 mm = 96 / 25.4 = 3.7795275591 px
 */

export const MM_TO_PX_BASE = 3.7795275591;

export function mmToPx(mm: number, zoom: number = 1): number {
  return mm * MM_TO_PX_BASE * zoom;
}

export function pxToMm(px: number, zoom: number = 1): number {
  return px / (MM_TO_PX_BASE * zoom);
}

export function snapToGrid(valueMm: number, gridSizeMm: number): number {
  if (gridSizeMm <= 0) return valueMm;
  return Math.round(valueMm / gridSizeMm) * gridSizeMm;
}
