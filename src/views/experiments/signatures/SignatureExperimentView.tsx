import { BadgeCheck, FileSignature, KeyRound, Pencil, RotateCcw, ShieldCheck } from 'lucide-react';

import type { ViewProps } from '../../../models/viewProps';

import { translate, type Text } from '../../../models/types';

import { useSignatureExperimentPresenter } from '../../../presenters/useSignatureExperimentPresenter';

import { ExperimentWorkbench } from '../ExperimentWorkbench';

import { HexValue } from '../HexValue';

import ui from '../ExperimentUI.module.css';

import styles from './SignatureExperimentView.module.css';

export function SignatureExperimentView({ language }: ViewProps) {
  const p = useSignatureExperimentPresenter();

  const t = (text: Text) => translate(language, text);

  const changed = !!p.packet && p.message !== p.packet.message;
  return (
    <ExperimentWorkbench
      language={language}
      className={styles.root}
      reset={p.reset}
      busy={p.busy}
      error={p.error}
      real
      title={['Did this message really come from Ana?', '¿Este mensaje vino realmente de Ana?']}
      description={[
        'Sign it, verify it, then change the message or the public key.',
        'Firmalo, verificalo y después cambiá el mensaje o la clave pública.',
      ]}
      docs="https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign"
      explanation={
        <>
          <p>
            {t([
              'Ana signs the exact UTF-8 bytes with an ECDSA P-256 private key and SHA-256. Verification uses her corresponding public key. The private key stays non-exportable; the short public-key fingerprint is a SHA-256 digest of its SPKI encoding.',
              'Ana firma los bytes UTF-8 exactos con una clave privada ECDSA P-256 y SHA-256. La verificación usa su clave pública correspondiente. La privada no se exporta; la huella corta de la pública es un SHA-256 de su codificación SPKI.',
            ])}
          </p>
          <p>
            {t([
              'Changing the message or verifying with Bruno’s unrelated public key invalidates the signature. Signing again creates a new key pair in this demo. The message remains readable: signatures provide integrity and key-based authenticity, not confidentiality.',
              'Cambiar el mensaje o verificar con la clave pública de Bruno invalida la firma. Volver a firmar crea otro par de claves en esta demo. El mensaje sigue legible: la firma aporta integridad y autenticidad respecto de una clave, no confidencialidad.',
            ])}
          </p>
          <p>
            {t([
              'A valid signature proves possession of the matching private key, not a real-world identity by itself. Production systems need a trusted association between people and public keys, plus replay protection and key lifecycle management.',
              'Una firma válida prueba la posesión de la clave privada correspondiente, no una identidad real por sí sola. Un sistema real necesita asociar personas y claves públicas de manera confiable, evitar repeticiones y gestionar el ciclo de vida de las claves.',
            ])}
          </p>
        </>
      }
    >
      <label className={ui.field}>
        {t(['Message to sign or verify', 'Mensaje para firmar o verificar'])}
        <textarea
          value={p.message}
          maxLength={200}
          disabled={p.busy}
          onChange={(e) => p.edit(e.target.value)}
        />
      </label>
      <div className={ui.actions}>
        <button className={ui.primary} disabled={p.busy} onClick={p.sign}>
          <FileSignature size={16} />
          {t(p.busy ? ['Working…', 'Procesando…'] : ['Sign as Ana', 'Firmar como Ana'])}
        </button>
        <button className={ui.secondary} disabled={p.busy || !p.packet} onClick={p.verify}>
          <ShieldCheck size={16} />
          {t(['Verify signature', 'Verificar firma'])}
        </button>
        {p.packet && (
          <button
            className={ui.secondary}
            disabled={p.busy}
            onClick={changed ? p.restore : p.tamper}
          >
            {changed ? <RotateCcw size={14} /> : <Pencil size={14} />}{' '}
            {t(
              changed
                ? ['Restore message', 'Restaurar mensaje']
                : ['Change message', 'Cambiar mensaje'],
            )}
          </button>
        )}
      </div>
      <div className={ui.scene}>
        <article className={ui.panel}>
          <h3>
            <FileSignature size={15} />
            {t(['Ana’s signature', 'Firma de Ana'])}
          </h3>
          <HexValue value={p.signature} label={t(['Digital signature', 'Firma digital'])} />
          <p className={ui.note}>
            {p.packet
              ? t([
                  'The signed bytes remain unchanged, even if you edit the message.',
                  'Los bytes firmados se conservan, aunque edites el mensaje.',
                ])
              : t([
                  'Sign to generate the key pair and signature.',
                  'Firmá para generar las claves y la firma.',
                ])}
          </p>
        </article>
        <article className={ui.panel}>
          <h3>
            <KeyRound size={15} />
            {t(['Public key to verify', 'Clave pública para verificar'])}
          </h3>
          <div
            className={styles.keys}
            role="group"
            aria-label={t(['Verifier key', 'Clave para verificar'])}
          >
            {[false, true].map((other) => (
              <button
                key={String(other)}
                aria-pressed={p.otherIdentity === other}
                disabled={p.busy || !p.packet}
                onClick={() => p.selectVerifier(other)}
              >
                <span>{other ? 'Bruno' : 'Ana'}</span>
                <small>
                  {p.packet
                    ? (other ? p.packet.otherIdentity : p.packet.identity).fingerprint.slice(
                        0,
                        16,
                      ) + '…'
                    : '—'}
                </small>
              </button>
            ))}
          </div>
          <div className={styles.verdict} data-valid={p.verified}>
            <BadgeCheck size={22} />
            <strong>
              {t(
                p.verified === true
                  ? ['Signature valid', 'Firma válida']
                  : p.verified === false
                    ? ['Signature invalid', 'Firma inválida']
                    : ['Not verified yet', 'Todavía sin verificar'],
              )}
            </strong>
          </div>
        </article>
      </div>
      <p className={ui.feedback} data-error={p.verified === false} aria-live="polite">
        {p.verified === true
          ? t([
              'The message and Ana’s public key match the signature.',
              'El mensaje y la clave pública de Ana coinciden con la firma.',
            ])
          : p.verified === false
            ? t([
                'Verification failed. The message or the public key changed.',
                'La verificación falló. Cambió el mensaje o la clave pública.',
              ])
            : changed
              ? t([
                  'The message changed. Verify the existing signature to see what happens.',
                  'El mensaje cambió. Verificá la firma existente para ver qué pasa.',
                ])
              : p.packet
                ? t([
                    'Signed. Anyone with Ana’s public key can verify it.',
                    'Firmado. Cualquiera con la clave pública de Ana puede verificarlo.',
                  ])
                : t([
                    'Start by signing the message as Ana.',
                    'Empezá firmando el mensaje como Ana.',
                  ])}
      </p>
    </ExperimentWorkbench>
  );
}
