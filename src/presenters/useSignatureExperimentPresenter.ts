import { useState } from 'react';

import {
  bytesToHex,
  signMessage,
  verifyMessage,
  type SignedMessage,
} from '../models/cryptoExperiment';

import { useAsyncExperimentPresenter } from './useAsyncExperimentPresenter';

export function useSignatureExperimentPresenter() {
  const task = useAsyncExperimentPresenter();
  const [message, setMessage] = useState('Pedido #42 · total $100');
  const [packet, setPacket] = useState<SignedMessage | null>(null);
  const [otherIdentity, setOtherIdentity] = useState(false);
  const [verified, setVerified] = useState<boolean | null>(null);

  const sign = () => {
    void task.run(
      () => signMessage(message),
      (value) => {
        setPacket(value);
        setVerified(null);
        setOtherIdentity(false);
      },
    );
  };

  const verify = () => {
    if (packet) void task.run(() => verifyMessage(packet, message, otherIdentity), setVerified);
  };

  const reset = () => {
    task.clear();
    setMessage('Pedido #42 · total $100');
    setPacket(null);
    setOtherIdentity(false);
    setVerified(null);
  };

  return {
    message,
    packet,
    otherIdentity,
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
    selectVerifier: (other: boolean) => {
      setOtherIdentity(other);
      setVerified(null);
    },
    tamper: () => {
      setMessage((value) => value + '!');
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
