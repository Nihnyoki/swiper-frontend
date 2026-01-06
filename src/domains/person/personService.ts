import { httpClient } from '@/services/api/httpClient';
import { mapPersonApi } from './person.mapper';
import { Person } from './person.types';

export async function getAllPersons(): Promise<Person[]> {
  const response = await httpClient.get('/api/persons/complete');
  return response.data.map(mapPersonApi);
}
