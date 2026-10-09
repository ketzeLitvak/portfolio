import { useState } from 'react';

import {
  createRequestTrace,
  type RequestTrace,
  type TraceScenario,
} from '../models/tracingExperiment';

export function useTracingExperimentPresenter() {
  const [scenario, setScenario] = useState<TraceScenario>('normal');
  const [trace, setTrace] = useState<RequestTrace | null>(null);
  const [sequence, setSequence] = useState(1);
  const [selected, setSelected] = useState(0);

  const send = () => {
    setTrace(createRequestTrace(sequence, scenario));
    setSequence((value) => value + 1);
    setSelected(0);
  };

  const reset = () => {
    setTrace(null);
    setSequence(1);
    setScenario('normal');
    setSelected(0);
  };

  return { scenario, setScenario, trace, selected, setSelected, send, reset };
}
