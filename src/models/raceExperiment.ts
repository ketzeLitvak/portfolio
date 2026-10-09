import type { Text } from './types';
export type RaceMode = 'unsafe' | 'atomic';
export type BuyerId = 'a' | 'b';
export interface RaceBuyer {
  read: number | null;
  status: 'ready' | 'read' | 'confirmed' | 'rejected';
}
export interface RaceStep {
  buyer: BuyerId;
  kind: 'read' | 'write' | 'reserve';
  text: Text;
}
export interface RaceScenario {
  mode: RaceMode;
  step: number;
  stock: number;
  buyers: Record<BuyerId, RaceBuyer>;
  trace: Text[];
}
export const raceSteps: Record<RaceMode, RaceStep[]> = {
  unsafe: [
    {
      buyer: 'a',
      kind: 'read',
      text: ['Ana sees 1 ticket available.', 'Ana ve 1 entrada disponible.'],
    },
    {
      buyer: 'b',
      kind: 'read',
      text: [
        'Bruno also sees 1. Ana has not saved her purchase yet.',
        'Bruno también ve 1. Ana todavía no guardó su compra.',
      ],
    },
    {
      buyer: 'a',
      kind: 'write',
      text: [
        'Ana confirms and saves 0 remaining tickets.',
        'Ana confirma y guarda 0 entradas restantes.',
      ],
    },
    {
      buyer: 'b',
      kind: 'write',
      text: [
        'Bruno confirms using his earlier read and also saves 0.',
        'Bruno confirma usando su lectura anterior y también guarda 0.',
      ],
    },
  ],
  atomic: [
    {
      buyer: 'a',
      kind: 'reserve',
      text: [
        'Ana checks and reserves together. Stock goes from 1 to 0.',
        'Ana verifica y reserva en una operación. El stock pasa de 1 a 0.',
      ],
    },
    {
      buyer: 'b',
      kind: 'reserve',
      text: [
        'Bruno checks the current stock: 0. His purchase is rejected.',
        'Bruno comprueba el stock actual: 0. Su compra se rechaza.',
      ],
    },
  ],
};
export const initialRaceScenario = (mode: RaceMode = 'unsafe'): RaceScenario => ({
  mode,
  step: 0,
  stock: 1,
  buyers: { a: { read: null, status: 'ready' }, b: { read: null, status: 'ready' } },
  trace: [],
});
export function advanceRace(previous: RaceScenario): RaceScenario {
  const action = raceSteps[previous.mode][previous.step];
  if (!action) return previous;
  const state = {
    ...previous,
    buyers: { ...previous.buyers, [action.buyer]: { ...previous.buyers[action.buyer] } },
    trace: [...previous.trace, action.text],
    step: previous.step + 1,
  };
  const buyer = state.buyers[action.buyer];
  if (action.kind === 'read') {
    buyer.read = state.stock;
    buyer.status = 'read';
  } else if (action.kind === 'write') {
    if ((buyer.read ?? 0) > 0) {
      state.stock = buyer.read! - 1;
      buyer.status = 'confirmed';
    } else buyer.status = 'rejected';
  } else {
    buyer.read = state.stock;
    if (state.stock > 0) {
      state.stock--;
      buyer.status = 'confirmed';
    } else buyer.status = 'rejected';
  }
  return state;
}
export const raceSales = (state: RaceScenario) =>
  Object.values(state.buyers).filter((buyer) => buyer.status === 'confirmed').length;
