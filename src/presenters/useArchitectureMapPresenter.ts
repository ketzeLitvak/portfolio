import { useLayoutEffect, useRef, useState } from 'react';

import type { ArchitectureEdge } from '../models/architecture/architecture';

export interface ArchitecturePath {
  id: string;
  d: string;
  kind: ArchitectureEdge['kind'];
  bidirectional: boolean;
}

export function useArchitectureMapPresenter(edges: ArchitectureEdge[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<{
    width: number;
    height: number;
    paths: ArchitecturePath[];
  }>({ width: 1, height: 1, paths: [] });
  useLayoutEffect(() => {
    const map = ref.current;
    if (!map) return;

    const measure = () => {
      const origin = map.getBoundingClientRect();
      const paths = edges.flatMap((edge) => {
        const from = map
            .querySelector<HTMLElement>(`[data-node="${edge.from}"]`)
            ?.getBoundingClientRect(),
          to = map.querySelector<HTMLElement>(`[data-node="${edge.to}"]`)?.getBoundingClientRect();
        if (!from || !to) return [];
        const sameRow = Math.abs(from.top - to.top) < 10;
        const fromLeft = from.left < to.left,
          fromAbove = from.top < to.top;
        const a = {
          x:
            (sameRow ? (fromLeft ? from.right : from.left) : from.left + from.width / 2) -
            origin.left,
          y:
            (sameRow ? from.top + from.height / 2 : fromAbove ? from.bottom : from.top) -
            origin.top,
        };
        const b = {
          x: (sameRow ? (fromLeft ? to.left : to.right) : to.left + to.width / 2) - origin.left,
          y: (sameRow ? to.top + to.height / 2 : fromAbove ? to.top : to.bottom) - origin.top,
        };
        const middle = (a.y + b.y) / 2;
        return [
          {
            id: edge.id,
            kind: edge.kind,
            bidirectional: !!edge.bidirectional,
            d: sameRow ? `M${a.x} ${a.y}L${b.x} ${b.y}` : `M${a.x} ${a.y}V${middle}H${b.x}V${b.y}`,
          },
        ];
      });
      setGeometry({ width: origin.width, height: origin.height, paths });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(map);
    for (const node of map.querySelectorAll('[data-node]')) observer.observe(node);
    return () => observer.disconnect();
  }, [edges]);
  return { ref, geometry };
}
