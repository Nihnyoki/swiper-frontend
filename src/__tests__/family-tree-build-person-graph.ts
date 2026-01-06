import { buildPersonGraph } from "../family-tree/build-person-graph.js";
import { resolveChildren } from "../family-tree/graph/resolveChildren.js";
import { resolveParent } from "../family-tree/graph/resolveParent.js";
import { Person } from "@/domains/person/person.types.js";

const persons: Person[] = [
  { id: '1', name: 'Alice', childrenIds: ['2', '3'] },
  { id: '2', name: 'Bob', childrenIds: [] },
  { id: '3', name: 'Charlie', childrenIds: ['4'] },
  { id: '4', name: 'Daisy', childrenIds: [] },
];

const activeId = '3';

const graph = buildPersonGraph(persons);

resolveChildren(activeId, graph);
resolveParent(activeId, graph);
