import { useState } from 'react';

import {
  bytesToHex,
  ciphertextBytes,
  decryptMessage,
  encryptMessage,
  type CipherEnvelope,
  type CryptoTrial,
} from '../models/cryptoExperiment';

import { useAsyncExperimentPresenter } from './useAsyncExperimentPresenter';

export function useEncryptionExperimentPresenter() {
  const task = useAsyncExperimentPresenter();
  const [message, setMessage] = useState('Nos vemos en Ketze Studio');
  const [envelope, setEnvelope] = useState<CipherEnvelope | null>(null);
  const [trial, setTrial] = useState<CryptoTrial>('matching');
  const tampered = trial === 'tampered';
  const [result, setResult] = useState<{ plaintext: string | null } | null>(null);

  const encrypt = () => {
    void task.run(
      () => encryptMessage(message),
      (value) => {
        setEnvelope(value);
        setResult(null);
        setTrial('matching');
      },
    );
  };

  const decrypt = (next: CryptoTrial) => {
    if (!envelope || task.busy) return;
    setTrial(next);
    setResult(null);
    void task.run(
      () => decryptMessage(envelope, next === 'other', next === 'tampered'),
      (plaintext) => setResult({ plaintext }),
    );
  };

  const reset = () => {
    task.clear();
    setMessage('Nos vemos en Ketze Studio');
    setEnvelope(null);
    setResult(null);
    setTrial('matching');
  };

  return {
    message,
    envelope,
    trial,
    tampered,
    result,
    busy: task.busy,
    error: task.error,
    encrypt,
    decrypt,
    reset,
    hex: envelope ? bytesToHex(ciphertextBytes(envelope, tampered)) : '',
    iv: envelope ? bytesToHex(envelope.iv) : '',
    edit: (value: string) => {
      task.clear();
      setMessage(value);
      setEnvelope(null);
      setResult(null);
      setTrial('matching');
    },
  };
}
