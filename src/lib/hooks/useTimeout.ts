import { useEffect } from 'react';

export function useTimeout(
  fn: () => void,
  delay: number | null
) {
  useEffect(() => {
    if (delay === null) return;
    const id = setTimeout(fn, delay);
    return () => clearTimeout(id);
  }, [fn, delay]);
}
