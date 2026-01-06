import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFamilyTree } from '@/features/family-tree/hooks/useFamilyTree';
import { personsFixture } from '@/test/fixtures/persons.fixture';

vi.mock('@/domains/person/person.service', () => ({
  getAllPersons: async () => personsFixture,
}));

vi.mock('@/services/telemetry/telemetry.service', () => ({
  track: vi.fn(),
}));

describe('useFamilyTree', () => {
  it('loads persons and sets active person', async () => {
    const { result } = renderHook(() => useFamilyTree());

    // wait for effect
    await new Promise(r => setTimeout(r, 0));

    expect(result.current.activePerson?.id).toBe('p1');
    expect(result.current.children.length).toBe(2);
  });

  it('navigates to child', async () => {
    const { result } = renderHook(() => useFamilyTree());
    await new Promise(r => setTimeout(r, 0));

    act(() => {
      result.current.goToChild();
    });

    expect(result.current.activePerson?.id).toBe('c1');
  });

  it('navigates back to parent', async () => {
    const { result } = renderHook(() => useFamilyTree());
    await new Promise(r => setTimeout(r, 0));

    act(() => {
      result.current.goToChild();
      result.current.goToParent();
    });

    expect(result.current.activePerson?.id).toBe('p1');
  });
});
