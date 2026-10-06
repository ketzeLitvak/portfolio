import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { experiences } from '../models/experience';
export function useExperiencePresenter() {
  const [selected, setSelected] = useState(0);
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
  return { selected, setSelected, entry: experiences[selected], navigateTabs };
}
