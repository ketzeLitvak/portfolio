import type { ReactNode } from 'react';
import { RotateCcw, ExternalLink } from 'lucide-react';
import { translate, type Language, type Text } from '../../models/types';
export function ExperimentShell({
  language,
  title,
  description,
  docs,
  reset,
  children,
}: {
  language: Language;
  title: Text;
  description: Text;
  docs: string;
  reset: () => void;
  children: ReactNode;
}) {
  const t = (text: Text) => translate(language, text);
  return (
    <div className="experiment">
      <header className="experiment-header">
        <span className="experiment-badge">{t(['Local simulation', 'Simulación local'])}</span>
        <h2>{t(title)}</h2>
        <p>{t(description)}</p>
        <div className="experiment-actions">
          <button onClick={reset}>
            <RotateCcw size={16} />
            {t(['Reset', 'Reiniciar'])}
          </button>
          <a href={docs} target="_blank" rel="noreferrer">
            {t(['Read the concept', 'Explorar el concepto'])}
            <ExternalLink size={14} />
          </a>
        </div>
      </header>
      {children}
    </div>
  );
}
