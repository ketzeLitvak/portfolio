import { useState } from 'react';

import {
  bytesToHex,
  ciphertextBytes,
  decryptMessage,
  encryptMessage,
  type CipherEnvelope,
} from '../models/cryptoExperiment';

import { useAsyncExperimentPresenter } from './useAsyncExperimentPresenter';

export function useEncryptionExperimentPresenter() {
  const task = useAsyncExperimentPresenter();
  const [message, setMessage] = useState('Nos vemos en Ketze Studio');
  const [envelope, setEnvelope] = useState<CipherEnvelope | null>(null);
  const [otherKey, setOtherKey] = useState(false);
  const [tampered, setTampered] = useState(false);
  const [result, setResult] = useState<{ plaintext: string | null } | null>(null);

  const encrypt = () => {
    void task.run(
      () => encryptMessage(message),
      (value) => {
        setEnvelope(value);
        setResult(null);
        setOtherKey(false);
        setTampered(false);
      },
    );
  };

  const decrypt = () => {
    if (envelope)
      void task.run(
        () => decryptMessage(envelope, otherKey, tampered),
        (plaintext) => setResult({ plaintext }),
      );
  };

  const reset = () => {
    task.clear();
    setMessage('Nos vemos en Ketze Studio');
    setEnvelope(null);
    setResult(null);
    setOtherKey(false);
    setTampered(false);
  };

  return {
    message,
    envelope,
    otherKey,
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
      setTampered(false);
    },
    selectKey: (value: boolean) => {
      setOtherKey(value);
      setResult(null);
    },
    toggleTamper: () => {
      setTampered((value) => !value);
      setResult(null);
    },
  };
}
