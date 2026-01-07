export type MediaType = 'video' | 'audio' | 'image' | 'note';

export interface MediaItem {
  id?: string;
  type?: MediaType;
  url?: string;
  title?: string;
}

export interface Person {
  id: string;
  NAME: string;
  LASTNAME: string;
  FIRSTNAME?: string;
  TYPETH: string;
  AGETH: string;
  dob?: string;
  EMAIL?: string;
  PHONE?: string;
  MOTHERID?: string;
  FATHERID?: string;
  IDNUM: string;
  IFATH: any;
  FRIENDS?: any;
  DRINKS?: any;
  ACTIVITIES?: any;
  LOVE?: any;
  MEDIASUM?: number;
  _id?: string;
  ADDRESS?: any[];
  THINGS?: any[];
  FAMILY?: Person[];
  IMAGETH?: string;
  EMOJIMETH?: string;
  isPlaceholder?: boolean;
}
