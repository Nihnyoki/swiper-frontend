import { httpClient } from '@/services/api/httpClient';
import { mapApiPersonToDomain } from './person.mapper';
import { Person } from './person.types';

export async function getAllPersons(): Promise<Person[]> {
  const response = await httpClient.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/persons/complete`);
  return response.data.map(mapApiPersonToDomain);
}
