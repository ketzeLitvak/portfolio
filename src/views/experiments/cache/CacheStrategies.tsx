import cacheStyles from './CacheExperimentView.module.css';

import { Radio, TrendingUp } from 'lucide-react';

import { OptionsPopover } from '../../../components/options/OptionsPopover';

import { OptionChoices } from '../../../components/options/OptionChoices';

import { cacheStrategies } from '../../../models/cacheExperiment';

import { translate, type Language } from '../../../models/types';

import type { useCacheExperimentPresenter } from '../../../presenters/useCacheExperimentPresenter';

export function CacheStrategies({
  presenter: p,
  language,
}: {
  presenter: ReturnType<typeof useCacheExperimentPresenter>;
  language: Language;
}) {
  const s = p.state;
  const name =
    s.strategy === 'ttl'
      ? 'TTL'
      : s.strategy === 'invalidate'
        ? translate(language, ['Invalidation', 'Invalidación'])
        : 'Write-through';

  return (
    <div className={cacheStyles.cacheWriteControls}>
      <button className={cacheStyles.cacheWrite} onClick={p.write} disabled={p.busy}>
        <TrendingUp size={16} />
        {translate(language, ['Change price', 'Cambiar precio'])} {s.service.toUpperCase()} · +$10
      </button>
      <OptionsPopover
        language={language}
        appearance="cache"
        disabled={p.busy}
        valueLabel={
          <>
            {name}
            {s.notifyOthers && s.strategy !== 'ttl' && <Radio size={12} />}
          </>
        }
        label={translate(language, ['Strategy', 'Estrategia']) + ': ' + name}
        title={translate(language, ['When the price changes', 'Cuando cambia el precio'])}
      >
        {() => (
          <>
            <OptionChoices
              language={language}
              appearance="cache"
              label={translate(language, ['Write strategy', 'Estrategia de escritura'])}
              value={s.strategy}
              options={cacheStrategies}
              onChange={p.selectStrategy}
            />
            {s.strategy !== 'ttl' && (
              <label className={cacheStyles.cacheNotify}>
                <input
                  type="checkbox"
                  checked={s.notifyOthers}
                  onChange={(e) => p.notify(e.target.checked)}
                />
                <span>
                  <Radio size={14} />
                  {translate(language, [
                    'Notify the other service to remove its local copy',
                    'Avisar al otro servicio para que borre su copia local',
                  ])}
                </span>
              </label>
            )}
            <p>
              {translate(language, [
                'Applies the next time you change the price.',
                'Se aplica la próxima vez que cambies el precio.',
              ])}
            </p>
          </>
        )}
      </OptionsPopover>
    </div>
  );
}
