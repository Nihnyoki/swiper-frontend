import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useTelemetryContext } from '@/lib/TelemetryContext'
import { TelemetryProps } from '@/lib/withTelemetry'

const persons = [
  { type: 'Kem', age: '28', image: '/images/alice.jpg', emoji: '🧑‍💻' },
  { type: 'DZem', age: '33', image: '/images/mel.jpg', emoji: '🧑‍💻'  },
  { type: 'Shlem', age: '38', image: '/images/vite.jpg', emoji: '🧑‍💻'  }
]

type SliderProps = TelemetryProps

export function Slider({ eventName = 'BalanceSlide', componentName }: SliderProps) {
  const telemetry = useTelemetryContext()
  const [currentIndex, setCurrentIndex] = useState(0) // track current slide

  useEffect(() => {
    console.log('Telemetry Event:', {
      ...telemetry,
      timestamp: new Date().toISOString(),
      event: `${eventName}:mounted`,
      component: componentName,
    })
  }, [])

  const handleSlideChange = (swiper: any) => {
    setCurrentIndex(swiper.activeIndex) // update current slide index
    const current = persons[swiper.activeIndex]
    console.log('Telemetry Event:', {
      ...telemetry,
      timestamp: new Date().toISOString(),
      event: `${eventName}:slided`,
      component: componentName,
      slideIndex: swiper.activeIndex,
      balanceType: current.type,
    })
  }

  return (
    <div className="relative  w-[250px] h-[150px] bg-black rounded-2xl overflow-hidden">
      {/* Background image changes with current slide */}
      <img
        src={persons[currentIndex].image}
        alt={`${persons[currentIndex].type} background`}
        className="absolute  top-0 right-0 object-cover opacity-20 mix-blend-lighten"
        style={{
          width: '50%',
          height: '50%',
          objectPosition: 'top right',
          zIndex: 0,
        }}
      />

      <Swiper
        direction="vertical"
        grabCursor={true}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        onSlideChange={handleSlideChange}
        className="w-full h-full bg-transparent relative z-10"
      >
        {persons.map((person, index) => (
          <SwiperSlide key={index}>
            <div className="bg-grey bg-opacity-0 text-white rounded-2xl p-4 shadow-md flex flex-col justify-between h-full relative z-20">
              <div className="text-sm font-semibold">{person.type}</div>
              <div className="flex items-center justify-between mt-auto">
              <span className="text-yellow-400 text-2xl">{person.emoji}</span>
              <div className="w-full flex justify-center">
              <span className="text-white text-2xl font-bold">{person.age}</span>
              </div>              
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
