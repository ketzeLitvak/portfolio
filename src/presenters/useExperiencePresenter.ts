import { useEffect, useRef, useState } from 'react';

import type { ExperienceTarget } from '../models/types';

import { experiences } from '../models/experience';

export function useExperiencePresenter(target?: ExperienceTarget, onSelect?: (id: string) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelectedState] = useState(() =>
    Math.max(
      0,
      experiences.findIndex((entry) => entry.id === target?.id),
    ),
  );
  useEffect(() => {
    if (!target) return;
    const index = experiences.findIndex((entry) => entry.id === target.id);
    if (index >= 0) setSelectedState(index);
    ref.current?.parentElement?.scrollTo({ top: 0 });
  }, [target]);

  const setSelected = (index: number) => {
    setSelectedState(index);
    onSelect?.(experiences[index].id);
  };

  return { ref, selected, setSelected, entry: experiences[selected] };
}
