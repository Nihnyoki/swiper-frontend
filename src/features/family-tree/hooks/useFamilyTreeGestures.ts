import { useCallback, useRef } from 'react';

interface Params {
  goToChild: () => void;
  goToParent: () => void;
  moveSelectionUp: () => void;
  moveSelectionDown: () => void;
}

type Axis = 'horizontal' | 'vertical';

export function useFamilyTreeGestures({
  goToChild,
  goToParent,
  moveSelectionUp,
  moveSelectionDown,
}: Params) {
  const lastAxis = useRef<Axis | null>(null);

  /** -----------------------------
   * HORIZONTAL (parent / child)
   * ---------------------------- */
  const onHorizontalSwipe = useCallback(
    (direction: 'left' | 'right') => {
      lastAxis.current = 'horizontal';

      if (direction === 'left') {
        goToChild();
      }

      if (direction === 'right') {
        goToParent();
      }
    },
    [goToChild, goToParent]
  );

  /** -----------------------------
   * VERTICAL (child selection)
   * ---------------------------- */
  const onVerticalSwipe = useCallback(
    (direction: 'up' | 'down') => {
      lastAxis.current = 'vertical';

      if (direction === 'up') {
        moveSelectionUp();
      }

      if (direction === 'down') {
        moveSelectionDown();
      }
    },
    [moveSelectionUp, moveSelectionDown]
  );

  return {
    onHorizontalSwipe,
    onVerticalSwipe,
    lastAxis,
  };
}
