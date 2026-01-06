import { describe, expect, it } from 'vitest';
import {
  buildPersonGraph,
  resolveChildren,
  resolveParent,
} from '@/features/family-tree/graph';
import { personsFixture } from '@/test/fixtures/persons.fixture';

describe('family-tree graph', () => {
  const graph = buildPersonGraph(personsFixture);

  it('builds children map correctly', () => {
    const children = resolveChildren('p1', graph);
    expect(children.map(c => c.id)).toEqual(['c1', 'c2']);
  });

  it('resolves parent correctly', () => {
    const parent = resolveParent('c1', graph);
    expect(parent?.id).toBe('p1');
  });

  it('returns null when parent does not exist', () => {
    const parent = resolveParent('p1', graph);
    expect(parent).toBeNull();
  });
});
