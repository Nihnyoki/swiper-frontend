import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMediaPlayback } from '@/features/media/hooks/useMediaPlayback';

describe('useMediaPlayback', () => {
  it('plays and pauses media', () => {
    const { result } = renderHook(() => useMediaPlayback());

    const audio = document.createElement('audio');
    audio.play = vi.fn();
    audio.pause = vi.fn();

    act(() => {
      result.current.register('a1', audio);
      result.current.play({
        id: 'a1',
        kind: 'audio',
        src: 'test.mp3',
      });
    });

    expect(audio.play).toHaveBeenCalled();

    act(() => {
      result.current.pause();
    });

    expect(audio.pause).toHaveBeenCalled();
  });

  it('pins and unpins media', () => {
    const { result } = renderHook(() => useMediaPlayback());

    act(() => result.current.pin());
    expect(result.current.pinned).toBe(true);

    act(() => result.current.unpin());
    expect(result.current.pinned).toBe(false);
  });
});
