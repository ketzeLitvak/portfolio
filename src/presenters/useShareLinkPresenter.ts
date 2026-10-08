import { useEffect, useRef, useState } from 'react';
import { directLinkUrl } from '../models/directLinks';
import { translate, type Language, type AppOpenOptions } from '../models/types';

export function useShareLinkPresenter(language: Language) {
  const [message, setMessage] = useState('');
  const [manualLink, setManualLink] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);
  useEffect(() => {
    if (manualLink) inputRef.current?.select();
  }, [manualLink]);
  const copy = async (id: string, options?: AppOpenOptions) => {
    const url = directLinkUrl(id, options);
    try {
      await navigator.clipboard.writeText(url);
      setManualLink(null);
      setMessage(translate(language, ['Link copied', 'Enlace copiado']));
    } catch {
      setManualLink(url);
    }
  };
  return { message, manualLink, inputRef, copy, dismiss: () => setManualLink(null) };
}
export type ShareLinkPresenter = ReturnType<typeof useShareLinkPresenter>;
