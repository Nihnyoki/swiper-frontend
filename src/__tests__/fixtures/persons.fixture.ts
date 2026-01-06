import { Person } from '@/domains/person/person.types';

export const personsFixture: Person[] = [
  {
    id: 'p1',
    name: 'Parent',
    childrenIds: ['c1', 'c2'],
    media: [],
  },
  {
    id: 'c1',
    name: 'Child 1',
    childrenIds: [],
    media: [],
  },
  {
    id: 'c2',
    name: 'Child 2',
    childrenIds: [],
    media: [],
  },
];
