import { useState } from 'react';

import {
  bytesToHex,
  signMessage,
  verifyMessage,
  type SignedMessage,
  type CryptoTrial,
} from '../models/cryptoExperiment';

import { useAsyncExperimentPresenter } from './useAsyncExperimentPresenter';

export function useSignatureExperimentPresenter() {
  const task = useAsyncExperimentPresenter();
  const [message, setMessage] = useState('Pedido #42 · total $100');
  const [packet, setPacket] = useState<SignedMessage | null>(null);
  const [trial, setTrial] = useState<CryptoTrial>('matching');
  const [verified, setVerified] = useState<boolean | null>(null);

  const sign = () => {
    void task.run(
      () => signMessage(message),
      (value) => {
        setPacket(value);
        setVerified(null);
        setTrial('matching');
      },
    );
  };

  const verify = (next: CryptoTrial) => {
    if (!packet || task.busy) return;
    const candidate = next === 'tampered' ? packet.message + '!' : message;
    setMessage(candidate);
    setTrial(next);
    setVerified(null);
    void task.run(() => verifyMessage(packet, candidate, next === 'other'), setVerified);
  };

  const reset = () => {
    task.clear();
    setMessage('Pedido #42 · total $100');
    setPacket(null);
    setTrial('matching');
    setVerified(null);
  };

  return {
    message,
    packet,
    trial,
    verified,
    busy: task.busy,
    error: task.error,
    sign,
    verify,
    reset,
    signature: packet ? bytesToHex(new Uint8Array(packet.signature)) : '',
    edit: (value: string) => {
      setMessage(value);
      setVerified(null);
    },
    restore: () => {
      if (packet) {
        setMessage(packet.message);
        setVerified(null);
      }
    },
  };
}
