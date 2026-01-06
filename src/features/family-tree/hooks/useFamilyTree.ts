import { useFamilyTreeState } from './useFamilyTreeState';
import { useFamilyTreeNavigation } from './useFamilyTreeNavigation';

export function useFamilyTree() {
  const state = useFamilyTreeState();

  const navigation = useFamilyTreeNavigation({
    graph: state.graph,
    activePersonId: state.activePersonId,
    setActivePersonId: id => state.setActivePersonId(id),
    selectedChildIndex: state.selectedChildIndex,
    setSelectedChildIndex: state.setSelectedChildIndex,
  });

  return {
    // state
    persons: state.persons,
    graph: state.graph,
    activePersonId: state.activePersonId,
    selectedChildIndex: state.selectedChildIndex,

    // navigation
    ...navigation,
  };
}
