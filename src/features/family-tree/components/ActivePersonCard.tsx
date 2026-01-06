import { Person } from '@/domains/person/person.types';
import { PersonCard } from '@/components/PersonCard';

interface Props {
  person: Person;
}

export function ActivePersonCard({ person }: Props) {
  return <PersonCard person={person} />;
}
