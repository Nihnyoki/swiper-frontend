import { Person } from '@/domains/person/person.types';
import { PersonGraph } from './types';

export function resolveChildren(
  personId: string,
  graph: PersonGraph
): Person[] {
  const childIds = graph.childrenMap[personId] ?? [];
  return childIds
    .map(id => graph.persons[id])
    .filter(Boolean);
}
