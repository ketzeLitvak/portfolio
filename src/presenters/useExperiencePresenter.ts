import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { ExperienceTarget } from '../models/types';
import { experiences } from '../models/experience';
export function useExperiencePresenter(target?: ExperienceTarget) {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (!target) return;
    const index = experiences.findIndex(entry => entry.id === target.id);
    if (index >= 0) setSelected(index);
    ref.current?.parentElement?.scrollTo({ top: 0 });
  }, [target?.id, target?.revision]);
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next = selected;
    if (event.key === 'ArrowRight') next = (selected + 1) % experiences.length;
    else if (event.key === 'ArrowLeft') next = (selected + experiences.length - 1) % experiences.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = experiences.length - 1;
    else return;
    event.preventDefault(); setSelected(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role=tab]')[next]?.focus();
  };
  return { ref, selected, setSelected, entry: experiences[selected], navigateTabs };
}
