export type MediaKind = 'audio' | 'video';

export interface MediaSource {
  id: string;
  kind: MediaKind;
  src: string;
  title?: string;
}
