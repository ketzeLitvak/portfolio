import { KeyRound, LockKeyhole, Pencil, UnlockKeyhole } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useEncryptionExperimentPresenter } from '../../../presenters/useEncryptionExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import { HexValue } from '../HexValue';

import ui from '../ExperimentUI.module.css';

import styles from './EncryptionExperimentView.module.css';

export function EncryptionExperimentView({ language }: ViewProps) {
  const p = useEncryptionExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      busy={p.busy}
      error={p.error}
      real
      title={['Who can read this message?', '¿Quién puede leer este mensaje?']}
      description={[
        'Encrypt it. Try the matching key, a different key, or modified ciphertext.',
        'Cifralo. Probá con la misma clave, otra clave o el mensaje cifrado modificado.',
      ]}
      docs="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt"
      explanation={
        <>
          <p>
            {t([
              'AES-GCM uses the same secret key to encrypt and decrypt. This demo generates a random 256-bit key and a fresh 12-byte IV for every encryption, with a 128-bit authentication tag. Re-encrypting creates a new key and ciphertext.',
              'AES-GCM usa la misma clave secreta para cifrar y descifrar. La demo genera una clave aleatoria de 256 bits, un IV nuevo de 12 bytes por cifrado y un tag de autenticación de 128 bits. Volver a cifrar crea una nueva clave y otro resultado.',
            ])}
          </p>
          <p>
            {t([
              'The wrong key or a changed ciphertext fails authentication and produces no plaintext. The IV is public but must never repeat with the same key. Ciphertext here is shown as hex; hex is only its representation, not the encryption algorithm.',
              'Una clave incorrecta o un mensaje cifrado alterado falla la autenticación y no produce texto legible. El IV es público, pero no debe repetirse con la misma clave. Mostramos el resultado en hexadecimal: es su representación, no el algoritmo de cifrado.',
            ])}
          </p>
          <p>
            {t([
              'Keys remain non-exportable in this browser session. This is a concept demo, not secure messaging or a key-management service; a real system also needs trusted key distribution and protection against replay.',
              'Las claves quedan como claves no exportables en esta sesión. Es una demo del concepto, no un servicio de mensajería segura o de gestión de claves; un sistema real también necesita distribución confiable de claves y protección frente a repeticiones.',
            ])}
          </p>
        </>
      }
    >
      <label className={ui.field}>
        {t(['Message', 'Mensaje'])}
        <textarea
          value={p.message}
          maxLength={160}
          disabled={p.busy}
          onChange={(e) => p.edit(e.target.value)}
        />
      </label>
      <div className={ui.actions}>
        <button className={ui.primary} disabled={p.busy} onClick={p.encrypt}>
          <LockKeyhole size={16} />
          {t(p.busy ? ['Working…', 'Procesando…'] : ['Encrypt message', 'Cifrar mensaje'])}
        </button>
        <button className={ui.secondary} disabled={p.busy || !p.envelope} onClick={p.decrypt}>
          <UnlockKeyhole size={16} />
          {t(['Decrypt', 'Descifrar'])}
        </button>
      </div>
      <div className={ui.scene}>
        <article className={ui.panel}>
          <h3>
            <LockKeyhole size={15} />
            {t(['Encrypted message', 'Mensaje cifrado'])}
          </h3>
          <HexValue value={p.hex} label={t(['Ciphertext', 'Texto cifrado'])} />
          {p.envelope && (
            <div className={styles.iv}>
              <span>IV · 96 bits</span>
              <HexValue value={p.iv} label="IV" />
            </div>
          )}
          <button
            className={styles.tamper}
            disabled={p.busy || !p.envelope}
            aria-pressed={p.tampered}
            onClick={p.toggleTamper}
          >
            <Pencil size={13} />
            {t(
              p.tampered
                ? ['Restore bytes', 'Restaurar bytes']
                : ['Change one byte', 'Cambiar un byte'],
            )}
          </button>
        </article>
        <article className={ui.panel}>
          <h3>
            <KeyRound size={15} />
            {t(['Key to decrypt', 'Clave para descifrar'])}
          </h3>
          <div
            className={styles.keys}
            role="group"
            aria-label={t(['Decryption key', 'Clave de descifrado'])}
          >
            {[false, true].map((other) => (
              <button
                key={String(other)}
                aria-pressed={p.otherKey === other}
                disabled={p.busy || !p.envelope}
                onClick={() => p.selectKey(other)}
              >
                {t(
                  other
                    ? ['Another key · B', 'Otra clave · B']
                    : ['Matching key · A', 'Misma clave · A'],
                )}
              </button>
            ))}
          </div>
          <div className={styles.output} data-failed={p.result?.plaintext === null}>
            {p.result?.plaintext === null ? (
              <span>{t(['Cannot decrypt', 'No se puede descifrar'])}</span>
            ) : p.result ? (
              <strong>{p.result.plaintext || t(['Empty message', 'Mensaje vacío'])}</strong>
            ) : (
              <small>{t(['Decrypt to reveal the message', 'Descifrá para ver el mensaje'])}</small>
            )}
          </div>
        </article>
      </div>
      <p className={ui.feedback} data-error={p.result?.plaintext === null} aria-live="polite">
        {p.result
          ? p.result.plaintext === null
            ? t([
                'Authentication failed. The key or the ciphertext does not match.',
                'Falló la autenticación. La clave o el texto cifrado no coincide.',
              ])
            : t([
                'Original message recovered with the matching key.',
                'Se recuperó el mensaje original con la misma clave.',
              ])
          : p.envelope
            ? t([
                'The message is encrypted. Select a key and try decrypting it.',
                'El mensaje está cifrado. Elegí una clave y probá descifrarlo.',
              ])
            : t(['Start by encrypting the message.', 'Empezá cifrando el mensaje.'])}
      </p>
    </ExperimentWorkbench>
  );
}
