import { Person } from './person.types';

export function mapPersonApi(dto: any): Person {
  return {
    id: dto._id ?? dto.id,
    name: dto.name ?? '',
    childrenIds: dto.children ?? [],
    media: dto.media ?? [],
  };
}
