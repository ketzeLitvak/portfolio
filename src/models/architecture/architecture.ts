import type { Text } from '../types';

export interface ArchitectureNode {
  id: string;
  title: Text;
  subtitle: Text;
  technology: string[];
  row: number;
  column: number;
  role: Text;
  input: Text;
  output: Text;
  rationale: Text;
  icon: 'web' | 'api' | 'data' | 'worker' | 'pipeline' | 'gold' | 'sources';
}
export interface ArchitectureEdge {
  id: string;
  from: string;
  to: string;
  kind: 'request' | 'data' | 'async';
  bidirectional?: boolean;
}
export interface ArchitectureStep {
  example?: { before: Text; after: Text };
  title: Text;
  description: Text;
  nodes: string[];
  edges: string[];
  inspect: string;
}
export interface ArchitectureProject {
  id: string;
  title: string;
  logo: string;
  description: Text;
  source: Text;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  flow: { title: Text; steps: ArchitectureStep[] };
}
