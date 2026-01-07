import React from "react";
import { Person } from "@/domains/person/person.types";

interface PersonCardProps {
  person: Person;
  subtitle?: string;
}

export function PersonCard({ person, subtitle }: PersonCardProps) {
  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/60 backdrop-blur-md flex flex-col justify-end text-white">
      {/* Background / Avatar */}
      {person.media?.[0]?.url ? (
        <img
          src={person.media[0].url}
          alt={person.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 to-gray-700" />
      )}

      {/* Overlay */}
      <div className="relative z-10 p-4 bg-black/40 backdrop-blur-sm">
        <h2 className="text-lg font-semibold truncate">
          {person.name}
        </h2>

        {subtitle && (
          <p className="text-xs text-pink-300 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
