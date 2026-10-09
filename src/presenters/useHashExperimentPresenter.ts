import { useState } from 'react';

import {
  comparePasswords,
  differingBits,
  sha256,
  type PasswordComparison,
} from '../models/cryptoExperiment';

import { useAsyncExperimentPresenter } from './useAsyncExperimentPresenter';

export function useHashExperimentPresenter() {
  const task = useAsyncExperimentPresenter();
  const [mode, setMode] = useState<'fingerprint' | 'password'>('fingerprint');
  const [text, setText] = useState('Ketze Studio');
  const [comparisonText, setComparisonText] = useState('ketze Studio');
  const [password, setPassword] = useState('demo-ketze-2026');
  const [salted, setSalted] = useState(true);
  const [hashes, setHashes] = useState<[string, string] | null>(null);
  const [passwordResult, setPasswordResult] = useState<PasswordComparison | null>(null);

  const clearResults = () => {
    setHashes(null);
    setPasswordResult(null);
    task.clear();
  };

  const compute = () => {
    if (mode === 'fingerprint')
      void task.run(async () => {
        const results = await Promise.all([sha256(text), sha256(comparisonText)]);
        return [results[0], results[1]] as [string, string];
      }, setHashes);
    else void task.run(() => comparePasswords(password, salted), setPasswordResult);
  };

  const reset = () => {
    clearResults();
    setMode('fingerprint');
    setText('Ketze Studio');
    setComparisonText('ketze Studio');
    setPassword('demo-ketze-2026');
    setSalted(true);
  };

  return {
    mode,
    text,
    comparisonText,
    password,
    salted,
    hashes,
    passwordResult,
    busy: task.busy,
    error: task.error,
    compute,
    reset,
    bits: hashes ? differingBits(...hashes) : null,
    selectMode: (value: typeof mode) => {
      clearResults();
      setMode(value);
    },
    editText: (value: string) => {
      clearResults();
      setText(value);
    },
    editComparison: (value: string) => {
      clearResults();
      setComparisonText(value);
    },
    editPassword: (value: string) => {
      clearResults();
      setPassword(value);
    },
    toggleSalt: () => {
      clearResults();
      setSalted((value) => !value);
    },
  };
}
