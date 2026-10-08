import { useRef, useState } from 'react';
import type { ExpressionName, EyeVariant, MouthVariant, EyebrowVariant } from 'faceshape-react';
import { avatarShapes, type AvatarConfig } from '../models/avatars';
export function useAvatarPresenter() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [name, setName] = useState('Ketze');
  const [shape, setShapeState] = useState('blob');
  const [expression, setExpression] = useState<ExpressionName>('happy');
  const [eyes, setEyes] = useState<EyeVariant>('bright');
  const [mouth, setMouth] = useState<MouthVariant>('tongue');
  const [eyebrows, setEyebrows] = useState<EyebrowVariant>('expression');
  const [color, setColor] = useState('#edcf79');
  const [animated, setAnimated] = useState(true);
  const setShape = (value: string) => {
    setShapeState(value);
    setMouth(avatarShapes[value].mouth ?? 'tongue');
  };
  const config: AvatarConfig = { name, shape, expression, eyes, mouth, eyebrows, color };
  const load = (avatar: AvatarConfig) => {
    setName(avatar.name);
    setShapeState(avatar.shape);
    setExpression(avatar.expression);
    setEyes(avatar.eyes);
    setMouth(avatar.mouth);
    setEyebrows(avatar.eyebrows);
    setColor(avatar.color);
  };
  const download = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current.cloneNode(true) as SVGSVGElement;
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const content = new XMLSerializer().serializeToString(svg);
    const url = URL.createObjectURL(new Blob([content], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ketze-avatar.svg';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return {
    config,
    load,
    svgRef,
    name,
    setName,
    shape,
    resolvedShape: avatarShapes[shape].shape,
    setShape,
    expression,
    setExpression,
    eyes,
    setEyes,
    mouth,
    setMouth,
    eyebrows,
    setEyebrows,
    color,
    setColor,
    animated,
    setAnimated,
    download,
    colors: ['#edcf79', '#f7ae91', '#a5cbcf', '#bfd0a7', '#d2c2df'],
  };
}
