import { useRef, useState } from 'react';

import type { ArchitectureProject } from '../models/architecture/architecture';

export function useArchitecturePresenter(project: ArchitectureProject) {
  const [mode, setMode] = useState<'map' | 'flow'>('map');
  const [selected, setSelected] = useState('web');
  const [index, setIndex] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null),
    detailsRef = useRef<HTMLElement>(null);
  const step = project.flow.steps[index];
  const node = project.nodes.find((item) => item.id === selected)!;

  const choose = (id: string) => {
    setSelected(id);
    if ((mapRef.current?.getBoundingClientRect().width ?? innerWidth) <= 550)
      window.requestAnimationFrame(() =>
        detailsRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }),
      );
  };

  const changeMode = (value: 'map' | 'flow') => {
    setMode(value);
    if (value === 'flow') {
      setIndex(0);
      setSelected(project.flow.steps[0].inspect);
    }
  };

  const go = (value: number) => {
    const next = Math.max(0, Math.min(project.flow.steps.length - 1, value));
    setIndex(next);
    setSelected(project.flow.steps[next].inspect);
  };

  const backToMap = () => mapRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });

  return {
    mode,
    changeMode,
    selected,
    choose,
    node,
    index,
    step,
    go,
    mapRef,
    detailsRef,
    backToMap,
    activeNodes: mode === 'flow' ? step.nodes : [selected],
    activeEdges:
      mode === 'flow'
        ? step.edges
        : project.edges
            .filter((edge) => edge.from === selected || edge.to === selected)
            .map((edge) => edge.id),
  };
}

export type ArchitecturePresenter = ReturnType<typeof useArchitecturePresenter>;
