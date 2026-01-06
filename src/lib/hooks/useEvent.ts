import { useEffect } from 'react';

export function useEvent(
  event: string,
  handler: () => void
) {
  useEffect(() => {
    window.addEventListener(event, handler);
    return () => window.removeEventListener(event, handler);
  }, [event, handler]);
}
