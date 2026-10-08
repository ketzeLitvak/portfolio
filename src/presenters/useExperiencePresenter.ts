import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
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
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next: number;
    if (event.key === 'ArrowRight') next = (selected + 1) % experiences.length;
    else if (event.key === 'ArrowLeft')
      next = (selected + experiences.length - 1) % experiences.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = experiences.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role=tab]')
      [next]?.focus();
  };
  return { ref, selected, setSelected, entry: experiences[selected], navigateTabs };
}
