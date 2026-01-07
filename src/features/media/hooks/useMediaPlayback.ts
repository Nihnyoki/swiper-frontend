import { useCallback, useRef, useState } from 'react';
import { MediaSource } from '../types';
import { track } from '@/services/telemetry/telemetry.service';

interface ActiveMedia {
  source: MediaSource;
  element: HTMLMediaElement;
}

export function useMediaPlayback() {
  const [active, setActive] = useState<ActiveMedia | null>(null);
  const [pinned, setPinned] = useState(false);

  const mediaRefs = useRef<Record<string, HTMLMediaElement>>({});

  /** -----------------------------
   * REGISTRATION
   * ---------------------------- */
  const register = useCallback(
    (id: string, element: HTMLMediaElement | null) => {
      if (!element) {
    delete mediaRefs.current[id];
    return;
  }
      mediaRefs.current[id] = element;
    },
    []
  );

  /** -----------------------------
   * CORE CONTROL
   * ---------------------------- */
  const play = useCallback(
    (source: MediaSource) => {
      const element = mediaRefs.current[source.id];
      if (!element) return;

      // stop previous
      if (active && active.element !== element) {
        active.element.pause();
        active.element.currentTime = 0;
      }

      element.play();
      setActive({ source, element });

      track('media.play', {
        id: source.id,
        type: source.kind,
      });
    },
    [active]
  );

  const pause = useCallback(() => {
    if (!active) return;
    active.element.pause();
    track('media.pause', { id: active.source.id });
  }, [active]);

  const stop = useCallback(() => {
    if (!active) return;
    active.element.pause();
    active.element.currentTime = 0;
    setActive(null);
    track('media.stop', {});
  }, [active]);

  /** -----------------------------
   * PINNING
   * ---------------------------- */
  const pin = useCallback(() => {
    setPinned(true);
    track('media.pin');
  }, []);

  const unpin = useCallback(() => {
    setPinned(false);
    track('media.unpin');
  }, []);

  return {
    // state
    activeSource: active?.source ?? null,
    pinned,

    // refs
    register,

    // controls
    play,
    pause,
    stop,
    pin,
    unpin,
  };
}
