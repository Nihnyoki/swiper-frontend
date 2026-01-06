// src/person/dto/person.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Address } from './address';
import { Things } from './things';
import { Ifath } from './ifath';

export class Person {
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
  IFATH: Ifath;
  FRIENDS?: any;
  DRINKS?: any;
  ACTIVITIES?: any;
  LOVE?: any;
  MEDIASUM?: number;
  _id?: string;
  ADDRESS?: Address[];
  THINGS?: Things[];
  FAMILY?: Person[];
  IMAGETH?: string;
  EMOJIMETH?: string;
  isPlaceholder?: boolean;
}
