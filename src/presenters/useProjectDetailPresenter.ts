import { useState } from 'react';

export function useProjectDetailPresenter() {
  const [section, setSection] = useState<'overview' | 'architecture'>('overview');

  return { section, setSection };
}
