import type { DrawingDocument } from '../models/drawing';

export function renderDrawing(
  canvas: HTMLCanvasElement,
  document: DrawingDocument,
  scale: number,
  grid = false,
  checker = false,
) {
  canvas.width = document.size * scale;
  canvas.height = document.size * scale;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  context.imageSmoothingEnabled = false;
  document.pixels.forEach((pixel, index) => {
    const x = index % document.size,
      y = Math.floor(index / document.size);
    if (pixel || checker) {
      context.fillStyle = pixel ?? ((x + y) % 2 ? '#e7e7e7' : '#f8f8f8');
      context.fillRect(x * scale, y * scale, scale, scale);
    }
  });
  if (grid) {
    context.strokeStyle = '#35353126';
    context.lineWidth = 1;
    context.beginPath();
    for (let index = 1; index < document.size; index++) {
      const at = index * scale + 0.5;
      context.moveTo(at, 0);
      context.lineTo(at, canvas.height);
      context.moveTo(0, at);
      context.lineTo(canvas.width, at);
    }
    context.stroke();
  }
}

export function drawingPng(document: DrawingDocument): string {
  const canvas = window.document.createElement('canvas');
  renderDrawing(canvas, document, 32);
  return canvas.toDataURL('image/png');
}

export function downloadDrawing(document: DrawingDocument) {
  const link = window.document.createElement('a');
  link.download = 'ketze-pixel-art.png';
  link.href = drawingPng(document);
  link.click();
}
