import { createFileRoute } from '@tanstack/react-router'
import React, { StrictMode } from 'react'
import MainContainer from '@/components/MainContainer'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="w-screen h-screen flex ">
      <MainContainer></MainContainer>
    </div>

  )
}
