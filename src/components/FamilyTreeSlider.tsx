import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { useTelemetryContext } from '@/lib/TelemetryContext'
import { TelemetryProps } from '@/lib/withTelemetry'

const greatPeople = [
  {
    type: 'KEM',
    age: '28',
    image: '/images/alice.jpg',
    emoji: '🧑‍💻',
    children: [
      {
        type: 'ZEL',
        age: '5',
        image: '/images/mel.jpg',
        emoji: '👧',
        children: [
          {
            type: 'GHEM',
            age: '2',
            image: '/images/vite.jpg',
            emoji: '👶',
            children: [],
          },
        ],
      },
      {
        type: 'VESAM',
        age: '7',
        image: '/images/alice.jpg',
        emoji: '🧒',
        children: [],
      },
    ],
  },
  {
    type: 'PEM',
    age: '33',
    image: '/images/alice.jpg',
    emoji: '🧑‍🎨',
    children: [
      {
        type: 'NELETTE',
        age: '3',
        image: '/images/mel.jpg',
        emoji: '👧',
        children: [],
      },
    ],
  },
]

function PersonCard({ person }: { person: any }) {
  return (
    <div className="relative w-[250px] h-[150px] bg-black rounded-2xl overflow-hidden text-white p-4 shadow-md">
      <div className="text-sm font-semibold">{person.type}</div>
      <div className="flex items-center justify-between mt-auto h-full">
        <span className="text-yellow-400 text-2xl">{person.emoji}</span>
        <div className="w-full flex justify-center">
          <span className="text-white text-2xl font-bold">{person.age}</span>
        </div>
      </div>
      {person.image && (
        <img
          src={person.image}
          alt={person.type}
          className="absolute top-0 right-0 w-1/2 h-1/2 object-cover opacity-20 mix-blend-lighten"
          style={{ objectPosition: 'top right' }}
        />
      )}
    </div>
  )
}

export function FamilyTreeSlider({
  eventName = 'FamilyTreeSwipe',
  componentName,
}: TelemetryProps) {
  const telemetry = useTelemetryContext()
  const [rootIndex, setRootIndex] = useState(0)
  const [personStack, setPersonStack] = useState([greatPeople[0]])

  const currentPerson = personStack[personStack.length - 1]

  useEffect(() => {
    console.log('Telemetry Event:', {
      ...telemetry,
      event: `${eventName}:mounted`,
      component: componentName,
      timestamp: new Date().toISOString(),
    })
  }, [])

  const handleGreatSwipe = (swiper: any) => {
    const index = swiper.activeIndex
    setRootIndex(index)
    setPersonStack([greatPeople[index]])

    const current = greatPeople[index]
    console.log('Telemetry Event:', {
      ...telemetry,
      timestamp: new Date().toISOString(),
      event: `${eventName}:root_changed`,
      component: componentName,
      rootPerson: current.type,
    })
  }

  const goToChild = (index: number) => {
    const child = currentPerson.children[index]
    if (child) {
      setPersonStack([...personStack, child])
      console.log('Telemetry Event:', {
        ...telemetry,
        timestamp: new Date().toISOString(),
        event: `${eventName}:navigated_to_child`,
        component: componentName,
        parent: currentPerson.type,
        child: child.type,
      })
    }
  }

  const goBack = () => {
    if (personStack.length > 1) {
      const popped = personStack.slice(0, -1)
      setPersonStack(popped)

      console.log('Telemetry Event:', {
        ...telemetry,
        timestamp: new Date().toISOString(),
        event: `${eventName}:navigated_back`,
        component: componentName,
        returnedTo: popped[popped.length - 1].type,
      })
    }
  }

  return (
    <div className="flex space-x-4 items-start p-4">
      {/* Left: Swiper with vertical Grand-level slide */}
      <div className="w-[250px] h-[150px] relative bg-gray-600">
      <Swiper
          direction="vertical"
          pagination={{ clickable: true }}
          modules={[Pagination]}
          onSlideChange={handleGreatSwipe}
          className="w-full h-full bg-transparent"
        >
          {greatPeople.map((person, index) => (
            <SwiperSlide key={index}>
              <PersonCard person={personStack.length === 1 ? person : currentPerson} />
            </SwiperSlide>
          ))}
        </Swiper>
        {personStack.length > 1 && (
          <button
            onClick={goBack}
            className="absolute bottom-0 left-0 text-white bg-gray-700 px-2 py-1 text-xs rounded"
          >
            Back
          </button>
        )}
      </div>

      {/* : Children */}
      <div className="flex flex-col space-y-4">
        {currentPerson.children.length === 0 ? (
          <div className="text-white">No children</div>
        ) : (
          currentPerson.children.map((child, index) => (
            <button key={index} onClick={() => goToChild(index)}>
              <PersonCard person={child} />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
