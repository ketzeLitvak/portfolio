import { Fingerprint, Hash, KeyRound, RefreshCw } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { passwordIterations } from '../../../models/cryptoExperiment';

import { useHashExperimentPresenter } from '../../../presenters/useHashExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import { HexValue } from '../HexValue';

import ui from '../ExperimentUI.module.css';

import styles from './HashExperimentView.module.css';

export function HashExperimentView({ language }: ViewProps) {
  const p = useHashExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const values = p.mode === 'fingerprint' ? p.hashes : p.passwordResult?.hashes;
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      busy={p.busy}
      error={p.error}
      real
      title={['Tiny change. A different fingerprint.', 'Un cambio mínimo. Otra huella.']}
      description={[
        'Compare two texts, then see why equal passwords need different salts.',
        'Compará dos textos y descubrí por qué dos contraseñas iguales necesitan salts distintos.',
      ]}
      docs="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest"
      explanation={
        <>
          <p>
            {t([
              'SHA-256 maps the exact UTF-8 bytes of a text to a 256-bit fingerprint. The same bytes produce the same hash. Changing a character usually changes many output bits; it does not guarantee that every bit changes. Hashes cannot be decrypted, but candidate texts can be guessed and compared.',
              'SHA-256 transforma los bytes UTF-8 del texto en una huella de 256 bits. Los mismos bytes dan el mismo hash. Cambiar un carácter suele modificar muchos bits, sin garantizar que cambien todos. Un hash no se descifra, pero se pueden probar candidatos y comparar.',
            ])}
          </p>
          <p>
            {t([
              'The password example uses PBKDF2-HMAC-SHA-256 with 600,000 iterations and a random 16-byte salt per account. The no-salt option deliberately demonstrates the bad practice of equal outputs for equal passwords. A salt is public and stored with the hash; it does not make a weak password strong.',
              'El ejemplo de contraseñas usa PBKDF2-HMAC-SHA-256, 600.000 iteraciones y un salt aleatorio de 16 bytes por cuenta. La opción sin salt muestra deliberadamente la mala práctica de generar resultados iguales para contraseñas iguales. El salt es público y se guarda con el hash; no vuelve fuerte una contraseña débil.',
            ])}
          </p>
          <p>
            {t([
              'SHA-256 alone is too fast for password storage. OWASP recommends purpose-built password hashing, generally Argon2id; this demo uses PBKDF2 because Web Crypto supports it. These are example inputs, processed locally and not saved.',
              'SHA-256 solo es demasiado rápido para guardar contraseñas. OWASP recomienda funciones específicas, generalmente Argon2id; la demo usa PBKDF2 porque Web Crypto lo soporta. Las entradas son de ejemplo, se procesan localmente y no se guardan.',
            ])}{' '}
            <a
              href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html"
              target="_blank"
              rel="noreferrer"
            >
              OWASP →
            </a>
          </p>
        </>
      }
    >
      <div className={ui.modes} role="group" aria-label={t(['Hash example', 'Ejemplo de hashing'])}>
        <button
          aria-pressed={p.mode === 'fingerprint'}
          disabled={p.busy}
          onClick={() => p.selectMode('fingerprint')}
        >
          <Fingerprint size={14} />
          {t(['Text fingerprints', 'Huellas de texto'])}
        </button>
        <button
          aria-pressed={p.mode === 'password'}
          disabled={p.busy}
          onClick={() => p.selectMode('password')}
        >
          <KeyRound size={14} />
          {t(['Passwords + salt', 'Contraseñas + salt'])}
        </button>
      </div>
      {p.mode === 'fingerprint' ? (
        <div className={styles.inputs}>
          <label className={ui.field}>
            {t(['Original text', 'Texto original'])}
            <input
              value={p.text}
              maxLength={512}
              disabled={p.busy}
              onChange={(e) => p.editText(e.target.value)}
            />
          </label>
          <label className={ui.field}>
            {t(['Comparison text', 'Texto para comparar'])}
            <input
              value={p.comparisonText}
              maxLength={512}
              disabled={p.busy}
              onChange={(e) => p.editComparison(e.target.value)}
            />
          </label>
        </div>
      ) : (
        <>
          <label className={ui.field}>
            {t([
              'Same example password for two accounts',
              'Misma contraseña de ejemplo para dos cuentas',
            ])}
            <input
              value={p.password}
              maxLength={128}
              disabled={p.busy}
              autoComplete="off"
              onChange={(e) => p.editPassword(e.target.value)}
            />
          </label>
          <label className={styles.salt}>
            <input type="checkbox" checked={p.salted} disabled={p.busy} onChange={p.toggleSalt} />
            {t([
              'Use a different random salt for each account',
              'Usar un salt aleatorio distinto por cuenta',
            ])}
          </label>
        </>
      )}
      <div className={ui.actions}>
        <button className={ui.primary} onClick={p.compute} disabled={p.busy}>
          <Hash size={16} />
          {t(p.busy ? ['Computing…', 'Calculando…'] : ['Compare hashes', 'Comparar hashes'])}
        </button>
        {p.mode === 'fingerprint' && (
          <button
            className={ui.secondary}
            disabled={p.busy}
            onClick={() => p.editComparison(p.text + '!')}
          >
            <RefreshCw size={14} />
            {t(['Change one character', 'Cambiar un carácter'])}
          </button>
        )}
      </div>
      <div className={ui.scene}>
        {[0, 1].map((index) => (
          <article className={ui.panel} key={index}>
            <h3>
              {t(
                p.mode === 'fingerprint'
                  ? index === 0
                    ? ['Original', 'Original']
                    : ['Comparison', 'Comparación']
                  : index === 0
                    ? ['Account A', 'Cuenta A']
                    : ['Account B', 'Cuenta B'],
              )}
            </h3>
            {p.mode === 'password' && (
              <div className={styles.saltValue}>
                <span>Salt</span>
                <HexValue
                  value={p.passwordResult?.salts[index] ?? ''}
                  label={`Salt ${index === 0 ? 'A' : 'B'}`}
                />
                {p.passwordResult && !p.passwordResult.salted && (
                  <small>{t(['None', 'Sin salt'])}</small>
                )}
              </div>
            )}
            <span className={ui.label}>
              {p.mode === 'fingerprint' ? 'SHA-256' : 'PBKDF2 · SHA-256'}
            </span>
            <HexValue
              value={values?.[index] ?? ''}
              compare={index === 1 ? values?.[0] : undefined}
              label={t(['Hash', 'Hash']) + ' ' + (index === 0 ? 'A' : 'B')}
            />
          </article>
        ))}
      </div>
      <p className={ui.feedback} aria-live="polite">
        {p.busy
          ? t(['Calculating in your browser…', 'Calculando en tu navegador…'])
          : values
            ? values[0] === values[1]
              ? t([
                  'The hashes match. Equal input and parameters produce equal results.',
                  'Los hashes coinciden. Entradas y parámetros iguales producen resultados iguales.',
                ])
              : p.mode === 'fingerprint'
                ? `${p.bits}/256 ${t(['bits changed. Colored characters highlight the difference.', 'bits cambiaron. Los caracteres coloreados muestran la diferencia.'])}`
                : t([
                    'Same password, different salts, different stored hashes.',
                    'Misma contraseña, distintos salts, distintos hashes guardados.',
                  ])
            : t(['Compute to compare the fingerprints.', 'Calculá para ver el resultado real.'])}
      </p>
      {p.mode === 'password' && (
        <p className={ui.note}>
          {passwordIterations.toLocaleString(language === 'es' ? 'es-AR' : 'en-US')}{' '}
          {t([
            'iterations per hash · 256-bit output',
            'iteraciones por hash · resultado de 256 bits',
          ])}
        </p>
      )}
    </ExperimentWorkbench>
  );
}
