import { Person } from './person.types';

export function mapPersonApi(dto: any): Person {
  return {
    id: dto._id ?? dto.id,
    name: dto.name ?? '',
    childrenIds: dto.children ?? [],
    media: dto.media ?? [],
  };
}

export function mapApiPersonToDomain(api: any): Person {
  return {
    id: api._id,
    name: api.NAME ?? "",
    childrenIds: api.FAMILY?.map((c: any) => c._id) ?? [],
    media: api.IFATH
      ? [
          {
            type: "image",
            url: api.IFATH.path.startsWith("http")
              ? api.IFATH.path
              : `${import.meta.env.VITE_BACKEND_BASE_URL}/${api.IFATH.path}`,
          },
        ]
      : [],
    things: api.THINGS ?? [],
  };
}