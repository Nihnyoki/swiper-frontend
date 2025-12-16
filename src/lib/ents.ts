import { Person } from "@/person/personService";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getPersonsHighestThingsValWhereChildItemsExist(person: Person): number {
  try{
    for (let i = person.THINGS.length - 1; i >= 0; i--) {
      const thing = person.THINGS[i];
      if (thing.childItems && thing.childItems.length > 0) {
        return i; // return the highest index
      }
    }
  } catch (E) {
    throw E;
  }
  return 0;
}
