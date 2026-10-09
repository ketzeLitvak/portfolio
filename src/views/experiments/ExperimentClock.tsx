import { Clock3, Pause, Play } from 'lucide-react';

import { translate, type Language } from '../../models/types';

import styles from './ExperimentClock.module.css';

export function ExperimentClock({
  language,
  now,
  running,
  toggle,
  step,
}: {
  language: Language;
  now: number;
  running: boolean;
  toggle: () => void;
  step: () => void;
}) {
  return (
    <div className={styles.clock}>
      <span>
        <Clock3 size={13} />
        {now}s
      </span>
      <button
        onClick={toggle}
        aria-label={translate(
          language,
          running ? ['Pause clock', 'Pausar reloj'] : ['Start clock', 'Iniciar reloj'],
        )}
        title={translate(
          language,
          running ? ['Pause clock', 'Pausar reloj'] : ['Start clock', 'Iniciar reloj'],
        )}
      >
        {running ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button onClick={step} disabled={running}>
        +1s
      </button>
    </div>
  );
}
