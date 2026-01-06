import { useCallback, useMemo } from 'react';
import { Person } from '@/domains/person/person.types';
import {
  resolveChildren,
  resolveParent,
  PersonGraph,
} from '@/features/family-tree/graph';
import { track } from '@/services/telemetry/telemetry.service';

interface Params {
  graph: PersonGraph | null;
  activePersonId: string | null;
  setActivePersonId: (id: string) => void;
  selectedChildIndex: number;
  setSelectedChildIndex: (i: number) => void;
}

export function useFamilyTreeNavigation({
  graph,
  activePersonId,
  setActivePersonId,
  selectedChildIndex,
  setSelectedChildIndex,
}: Params) {
  const activePerson: Person | null = useMemo(() => {
    if (!graph || !activePersonId) return null;
    return graph.persons[activePersonId] ?? null;
  }, [graph, activePersonId]);

  const children: Person[] = useMemo(() => {
    if (!graph || !activePersonId) return [];
    return resolveChildren(activePersonId, graph);
  }, [graph, activePersonId]);

  const selectChild = useCallback(
    (index: number) => {
      setSelectedChildIndex(index);
      track('familyTree.child.select', { index });
    },
    [setSelectedChildIndex]
  );

  const goToChild = useCallback(() => {
    if (!children.length) return;

    const child = children[selectedChildIndex];
    if (!child) return;

    setActivePersonId(child.id);
    setSelectedChildIndex(0);

    track('familyTree.navigate.child', {
      from: activePersonId,
      to: child.id,
    });
  }, [
    children,
    selectedChildIndex,
    setActivePersonId,
    setSelectedChildIndex,
    activePersonId,
  ]);

  const goToParent = useCallback(() => {
    if (!graph || !activePersonId) return;

    const parent = resolveParent(activePersonId, graph);
    if (!parent) return;

    setActivePersonId(parent.id);
    setSelectedChildIndex(0);

    track('familyTree.navigate.parent', {
      from: activePersonId,
      to: parent.id,
    });
  }, [
    graph,
    activePersonId,
    setActivePersonId,
    setSelectedChildIndex,
  ]);

  const moveSelectionUp = useCallback(() => {
    setSelectedChildIndex(prev =>
      Math.min(prev + 1, children.length - 1)
    );
  }, [children.length, setSelectedChildIndex]);

  const moveSelectionDown = useCallback(() => {
    setSelectedChildIndex(prev => Math.max(prev - 1, 0));
  }, [setSelectedChildIndex]);

  return {
    activePerson,
    children,

    selectChild,
    goToChild,
    goToParent,
    moveSelectionUp,
    moveSelectionDown,
  };
}
