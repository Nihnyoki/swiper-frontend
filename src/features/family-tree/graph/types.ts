import { Person } from '@/domains/person/person.types';

export type PersonId = string;

export interface PersonGraph {
  persons: Record<PersonId, Person>;
  childrenMap: Record<PersonId, PersonId[]>;
  parentMap: Record<PersonId, PersonId | null>;
}
