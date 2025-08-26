// components/ImageCarousel.tsx
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Person {
  id: number
  name: string
  image: string
}

interface Props {
  people: Person[]
  onSwipeRight: () => void
}

const ImageCarousel: React.FC<Props> = ({ people, onSwipeRight }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const swipeConfidenceThreshold = 50

  const handleSwipe = (event: any, info: any) => {
    const offsetY = info.offset.y
    const offsetX = info.offset.x

    // Swipe Right (to show menu)
    if (offsetX > swipeConfidenceThreshold) {
      onSwipeRight()
      return
    }

    // Swipe Up
    if (offsetY < -swipeConfidenceThreshold && currentIndex < people.length - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }

    // Swipe Down
    if (offsetY > swipeConfidenceThreshold && currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      y: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <div className="w-1/2 h-full flex items-center justify-center overflow-hidden relative bg-transparent">
      <AnimatePresence custom={direction}>
        <motion.img
          key={people[currentIndex].id}
          src={people[currentIndex].image}
          alt={people[currentIndex].name}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="object-cover w-full h-full rounded-lg"
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={handleSwipe}
        />
      </AnimatePresence>

      {/* Optional: Down arrow indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-2xl">
        ⇅
      </div>
    </div>
  )
}

export default ImageCarousel
