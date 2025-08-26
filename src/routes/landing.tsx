import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'

export const Route = createFileRoute('/landing')({
  component: LandingPage,
})

const people = [
  { id: 1, name: 'Alice', image: '/images/alice.jpg' },
  { id: 2, name: 'Bob', image: '/images/mel.jpg' },
  { id: 3, name: 'Charlie', image: '/images/slet.jpg' },
]

export default function LandingPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Track start positions for both touch and mouse
  const [startX, setStartX] = useState<number | null>(null)
  const [startY, setStartY] = useState<number | null>(null)

  const handleVerticalSwipe = (deltaY: number) => {
    if (deltaY < -50 && currentIndex < people.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleHorizontalSwipe = (deltaX: number) => {
    if (deltaX > 50) setMenuOpen(true)
  }

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX === null || startY === null) return

    const deltaX = e.changedTouches[0].clientX - startX
    const deltaY = e.changedTouches[0].clientY - startY

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      handleVerticalSwipe(deltaY)
    } else {
      handleHorizontalSwipe(deltaX)
    }

    setStartX(null)
    setStartY(null)
  }

  // Mouse handlers (for laptop touchpad or mouse swipe simulation)
  const onMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX)
    setStartY(e.clientY)
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (startX === null || startY === null) return

    const deltaX = e.clientX - startX
    const deltaY = e.clientY - startY

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      handleVerticalSwipe(deltaY)
    } else {
      handleHorizontalSwipe(deltaX)
    }

    setStartX(null)
    setStartY(null)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      {/* Image Carousel Area */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className="h-full w-full flex items-center justify-center relative select-none"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={people[currentIndex].id}
            src={people[currentIndex].image}
            alt={people[currentIndex].name}
            className="h-3/4 w-auto object-cover rounded-2xl shadow-lg absolute"
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -300, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Slide Menu Arrow Indicator */}
        <div className="absolute top-1/2 right-2 text-2xl text-gray-600 select-none">
          👉
        </div>
      </div>
    </div>
  )
}
