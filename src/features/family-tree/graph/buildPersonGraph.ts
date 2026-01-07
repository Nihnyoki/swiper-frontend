import { Person } from '@/domains/person/person.types';
import { PersonGraph } from './types';

export function buildPersonGraph(persons: Person[]): PersonGraph {
  const personsMap: PersonGraph['persons'] = {};
  const childrenMap: PersonGraph['childrenMap'] = {};
  const parentMap: PersonGraph['parentMap'] = {};

  for (const person of persons) {
    personsMap[person.id] = person;
    childrenMap[person.id] = [];
    parentMap[person.id] = null;
  }

  for (const person of persons) {
    console.log(`Processing children for person ID: ${person.id}`);
    for (const childId of person.childrenIds) {
      if (personsMap[childId]) {
        childrenMap[person.id].push(childId);
        parentMap[childId] = person.id;
      }
    }
  }

  return {
    persons: personsMap,
    childrenMap,
    parentMap,
  };
}
