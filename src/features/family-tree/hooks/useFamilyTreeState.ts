import { useEffect, useMemo, useState } from 'react';
import { Person } from '@/domains/person/person.types';
import { getAllPersons } from '@/domains/person/person.service';
import {
  buildPersonGraph,
  PersonGraph,
} from '@/features/family-tree/graph';

export function useFamilyTreeState() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState(0);

  useEffect(() => {
    getAllPersons().then(data => {
      setPersons(data);
      if (!activePersonId && data.length > 0) {
        setActivePersonId(data[0].id);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const graph: PersonGraph | null = useMemo(() => {
    if (!persons.length) return null;
    return buildPersonGraph(persons);
  }, [persons]);

  return {
    persons,
    graph,
    activePersonId,
    setActivePersonId,
    selectedChildIndex,
    setSelectedChildIndex,
  };
}
