export type MediaType = 'video' | 'audio' | 'image' | 'note';

export interface MediaItem {
  id: string;
  type: MediaType;
  url: string;
  title?: string;
}

export interface Person {
  id: string;
  name: string;
  childrenIds: string[];
  media: MediaItem[];
}
