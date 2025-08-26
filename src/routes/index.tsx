import { createFileRoute } from '@tanstack/react-router'
import React, { StrictMode } from 'react'
import { Button } from '@/components/ui/button'
import { withTelemetry } from '@/lib/withTelemetry'
import { FamilyTreeSlider } from '@/components/FamilyTreeSlider'
import { PreferedFamilyTreeSlider } from '@/components/666PreferedFamilyTreeSlider'
import { LoginAndFamilyTree } from '@/components/LoginAndFamilyTree'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (

    <div className="p-2">
      <h3>PreferedSlider</h3>
      <LoginAndFamilyTree/> 
    </div>

  )
}
