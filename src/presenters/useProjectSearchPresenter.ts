import { useMemo, useState } from 'react';

import { normalizeSearch, projectCategories, searchableEntries } from '../models/projectSearch';

export function useProjectSearchPresenter() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('');
  const [technology, setTechnology] = useState('');
  const [category, setCategory] = useState('');
  const results = useMemo(() => {
    const words = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
    return searchableEntries.filter((entry) => {
      const text = normalizeSearch([entry.text, ...projectCategories[entry.category]].join(' '));
      return (
        words.every((word) => text.includes(word)) &&
        (!language || entry.languages.includes(language)) &&
        (!technology || entry.technologies.includes(technology)) &&
        (!category || entry.category === category)
      );
    });
  }, [query, language, technology, category]);

  const reset = () => {
    setQuery('');
    setLanguage('');
    setTechnology('');
    setCategory('');
  };

  return {
    query,
    setQuery,
    language,
    setLanguage,
    technology,
    setTechnology,
    category,
    setCategory,
    results,
    reset,
    hasFilters: Boolean(query || language || technology || category),
  };
}
