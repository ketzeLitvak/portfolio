import { useState } from 'react';
const shapes = { blob: 'M30 40Q90-5 152 35Q205 75 163 150Q110 205 43 163Q-4 110 30 40', circle: 'M100 20a80 80 0 1 0 0 160a80 80 0 1 0 0-160', square: 'M50 25H150Q175 25 175 50V150Q175 175 150 175H50Q25 175 25 150V50Q25 25 50 25' };
const expressions = { happy: ['M68 77v8M132 77v8', 'M70 116Q100 145 130 116'], wink: ['M58 83Q68 72 78 83M132 77v8', 'M73 117Q100 136 127 117'], surprised: ['M68 77v8M132 77v8', 'M90 115a12 15 0 1 0 24 0a12 15 0 1 0-24 0'], sleepy: ['M58 83h20M122 83h20', 'M86 122h28'] };
export function useAvatarPresenter() {
  const [shape, setShape] = useState<keyof typeof shapes>('blob'); const [expression, setExpression] = useState<keyof typeof expressions>('happy'); const [color, setColor] = useState('#edcf79');
  const shapePath = shapes[shape], [eyes, mouth] = expressions[expression];
  const download = () => { const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="${color}" d="${shapePath}"/><g stroke="#242821" stroke-width="6" stroke-linecap="round" fill="none"><path d="${eyes}"/><path d="${mouth}"/></g></svg>`; const url = URL.createObjectURL(new Blob([content], { type: 'image/svg+xml' })); const a = document.createElement('a'); a.href = url; a.download = 'ketze-avatar.svg'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
  return { shape, expression, color, shapePath, eyes, mouth, setShape, setExpression, setColor, download, colors: ['#edcf79', '#f7ae91', '#a5cbcf', '#bfd0a7', '#d2c2df'] };
}
