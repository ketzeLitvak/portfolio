import type { DrawingDocument } from '../models/drawing';

export function renderDrawing(
  canvas: HTMLCanvasElement,
  drawing: DrawingDocument,
  targetSize = drawing.size,
) {
  const source = window.document.createElement('canvas');
  source.width = drawing.size;
  source.height = drawing.size;
  const context = source.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  const image = context.createImageData(drawing.size, drawing.size);
  const colors = new Map<string, [number, number, number]>();
  drawing.pixels.forEach((pixel, index) => {
    if (!pixel) return;
    let rgb = colors.get(pixel);
    if (!rgb) {
      rgb = [
        parseInt(pixel.slice(1, 3), 16),
        parseInt(pixel.slice(3, 5), 16),
        parseInt(pixel.slice(5, 7), 16),
      ];
      colors.set(pixel, rgb);
    }
    const at = index * 4;
    image.data[at] = rgb[0];
    image.data[at + 1] = rgb[1];
    image.data[at + 2] = rgb[2];
    image.data[at + 3] = 255;
  });
  context.putImageData(image, 0, 0);
  canvas.width = targetSize;
  canvas.height = targetSize;
  const output = canvas.getContext('2d');
  if (!output) throw new Error('Canvas is unavailable');
  output.imageSmoothingEnabled = false;
  output.drawImage(source, 0, 0, targetSize, targetSize);
}

export function drawingPng(drawing: DrawingDocument): string {
  const canvas = window.document.createElement('canvas');
  renderDrawing(canvas, drawing, drawing.size);
  return canvas.toDataURL('image/png');
}

export function drawingSpritePng(drawing: DrawingDocument): string {
  let left = drawing.size,
    top = drawing.size,
    right = -1,
    bottom = -1;
  drawing.pixels.forEach((pixel, index) => {
    if (pixel) {
      const x = index % drawing.size,
        y = Math.floor(index / drawing.size);
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  });
  if (right < 0) throw new Error('Empty drawing');
  const source = window.document.createElement('canvas');
  renderDrawing(source, drawing);
  const sprite = window.document.createElement('canvas');
  sprite.width = right - left + 1;
  sprite.height = bottom - top + 1;
  const context = sprite.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable');
  context.drawImage(
    source,
    left,
    top,
    sprite.width,
    sprite.height,
    0,
    0,
    sprite.width,
    sprite.height,
  );
  return sprite.toDataURL('image/png');
}

export function downloadDrawing(drawing: DrawingDocument) {
  const link = window.document.createElement('a');
  link.download = 'ketze-pixel-art.png';
  link.href = drawingPng(drawing);
  link.click();
}
