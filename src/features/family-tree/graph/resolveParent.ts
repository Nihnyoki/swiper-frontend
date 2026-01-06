import { Person } from '@/domains/person/person.types';
import { PersonGraph } from './types';

export function resolveParent(
  personId: string,
  graph: PersonGraph
): Person | null {
  const parentId = graph.parentMap[personId];
  return parentId ? graph.persons[parentId] : null;
}
