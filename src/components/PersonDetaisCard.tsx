import React, { useState} from 'react'
import 'swiper/css'
import { FamilyCard } from './childs/FamilyCard'
import { SocialCard } from './childs/SocialCard'
import { ProfessionalCard } from './childs/ProfessionalCard'
import { FunCard } from './childs/FunCard'
import { CultureCard } from './childs/CultureCard'
import { PersonalCard } from './childs/PersInalCard'
import { MusicCard } from './childs/MusicCard'

interface PersonCardDetailsProps {
  person: any
  width?: string
  height?: string
  THING?: string
  childItems: any[]
}

export function PersonCardDetails({
  person,
  width = "w-[250px]",
  height = "h-[320px]",
  THING,
  childItems,
}: PersonCardDetailsProps) {
  const resolvedThing = String(THING || "").trim().toUpperCase();

  switch (resolvedThing) {
      case "FAMILY":
        return <FamilyCard person={person} flex-1 w-full h-full childItems={childItems} />;
      case "SOCIAL":
        return <SocialCard person={person} flex-1 w-full h-full childItems={childItems} />;
      case "PROFESSIONAL":
        return <ProfessionalCard person={person} flex-1 childItems={childItems} />;
      case "FUN":
        return <FunCard person={person} w-full h-full overflow-y-auto childItems={childItems} />;
      case "CULTURE":
        return <CultureCard person={person} flex-1 w-full h-full childItems={childItems} />;
      case "PERSONAL":
        return <PersonalCard person={person} flex-1 w-full h-full childItems={childItems} />;
      case "MUSIC":
      case "AUDIO":
      case "SONGS":
        return <MusicCard person={person} childItems={childItems} />;
      default:
        return <FamilyCard person={person} flex-1 w-full h-full childItems={childItems} />;
  }
}

