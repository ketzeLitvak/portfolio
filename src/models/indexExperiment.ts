export interface IndexedRecord {
  id: number;
  row: number;
}
export interface IndexStep {
  key: number;
  row: number;
  low?: number;
  high?: number;
  position: number;
}
export interface IndexSearch {
  steps: IndexStep[];
  result: IndexedRecord | null;
  indexed: boolean;
}

export function createIndexRecords(): IndexedRecord[] {
  return Array.from({ length: 32 }, (_, row) => ({ id: 100 + ((row * 13) % 32), row }));
}

export function buildRecordIndex(records: IndexedRecord[]): IndexedRecord[] {
  return [...records].sort((a, b) => a.id - b.id);
}

export function planIndexSearch(
  records: IndexedRecord[],
  target: number,
  indexed: boolean,
): IndexSearch {
  const steps: IndexStep[] = [];
  if (!indexed) {
    for (let position = 0; position < records.length; position++) {
      const record = records[position];
      steps.push({ key: record.id, row: record.row, position });
      if (record.id === target) return { steps, result: record, indexed };
    }
    return { steps, result: null, indexed };
  }
  const index = buildRecordIndex(records);
  let low = 0,
    high = index.length - 1;
  while (low <= high) {
    const position = Math.floor((low + high) / 2),
      record = index[position];
    steps.push({ key: record.id, row: record.row, position, low, high });
    if (record.id === target) return { steps, result: record, indexed };
    if (record.id < target) low = position + 1;
    else high = position - 1;
  }
  return { steps, result: null, indexed };
}
