import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useTelemetryContext } from '@/lib/TelemetryContext'
import { TelemetryProps } from '@/lib/withTelemetry'
import { Person } from '@/services/personService'
 
const VITE_IMAGE_CORE_PATH = "http://localhost:3000/images"
const VITE_CORE_PATH = "http://localhost:3000"
 
function PersonCard({ person }: { person: any }) {
  const isPlaceholder = person?.isPlaceholder;
 
  const imageAddress = person?.image
    ? person.image.startsWith('/images')
      ? `${VITE_IMAGE_CORE_PATH}${person.image.replace('/images', '')}`
      : `${VITE_IMAGE_CORE_PATH}/${person.image.split('/').pop()}`
    : null;
 
  return (
    <div
      className={`relative w-[250px] h-[150px] rounded-2xl overflow-hidden p-4 shadow-md ${
        isPlaceholder ? 'bg-gray-700 text-white opacity-60' : 'bg-black text-white'
      }`}
    >
      <div className="text-sm font-semibold">{person?.name || 'Unnamed'}</div>
      <div className="flex items-center justify-between mt-auto h-full">
        <span className="text-yellow-400 text-2xl">{person?.emoji || '🙂'}</span>
        <div className="w-full flex justify-center">
          <span className="text-white text-2xl font-bold">{person?.age || '-'}</span>
        </div>
      </div>
      {imageAddress && (
        <img
          src={imageAddress}
          alt={person?.name || 'Person image'}
          className="absolute top-0 right-0 w-1/2 h-1/2 object-cover opacity-20 mix-blend-lighten"
          style={{ objectPosition: 'top right' }}
        />
      )}
    </div>
  );
}
 
export function PreferedFamilyTreeSlider({
  personId,
  eventName = 'FamilyTreeSwipe',
  componentName,
}: TelemetryProps) {
  const telemetry = useTelemetryContext()
  const [personSteps, setPersonSteps] = useState<{ people: any[]; index: number }[]>([])
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null)
  const [children, setChildren] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
 
  const fetchPersonData = useCallback(async (id: string) => {
    setLoading(true)
    try {
      //const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons/${id}/with-children`)
      const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons`)
      const person = response.data
      console.log(`Fetched person: ${JSON.stringify(person)}`)
      
      setCurrentPerson(person)
      
      if(person.children){
        console.log(`person.children is greater than 0.`);
        setChildren(
          person.children?.length > 0
            ? person.children
            : [{
                type: 'No Descendants',
                age: '',
                image: '/images/photo1754827042.jpg',
                emoji: '🚫',
                isPlaceholder: true,
              }]
        )
      }

      
      // Keep the personSteps for backward compatibility
      setPersonSteps([{ people: [person], index: 0 }])
      
      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch persons:', err)
      setLoading(false)
    }
  }, [])
 
  useEffect(() => {
    if (personId) {
      fetchPersonData(personId)
    }
  }, [personId, fetchPersonData])
 
  if (loading) return <p>Loading family tree...</p>
  if (!currentPerson) return <p>No persons available</p>
 
  const telemetryEvent = (personId: string, action: string, personType: string) => {
    const eventData = {
      ...telemetry,
      timestamp: new Date().toISOString(),
      event: `${eventName}:${action}`,
      component: componentName,
      person: personType,
      personId: personId,
    }
    console.log('Telemetry Event:', eventData)
  }
 
  const handleVerticalChange = (swiper: any) => {
    // This function might need to be updated based on the new approach
    const newIndex = swiper.activeIndex
    telemetryEvent(personId, 'slided_to_sibling', currentPerson?.type || '')
  }
 
  // Handle child click - completely redesigned
  const handleChildClick = async (child: any) => {
    if (child.isPlaceholder) return
    
    telemetryEvent(child.id_number, 'child_clicked', child.type)
    
    // Fetch the selected child's data with its children
    await fetchPersonData(child.id_number)
  }
 
 
  async function getChildTree(id_number: string): Promise<Person> {
    return axios
      .get<Person>(`${VITE_CORE_PATH}/api/persons/${id_number}/with-children`)
      .then((res) => res.data) as unknown as Person
  }
 
  return (
    <div className="w-full h-full flex gap-4 items-start justify-center bg-gray-300 p-4 rounded-xl">
      {/* Main Person Display */}
      <div className="w-[290px] h-[200px] z-10 relative pointer-events-auto">
        <Swiper
          direction="vertical"
          slidesPerView={1}
          onSlideChange={handleVerticalChange}
          allowTouchMove={true}
          className="w-full h-full"
        >
          <SwiperSlide className="flex items-center justify-center">
            <PersonCard person={currentPerson} />
          </SwiperSlide>
        </Swiper>
      </div>
 
 
  <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 pb-4 z-10 relative pointer-events-auto">
  {currentPerson.children
    ?.flatMap((person: Person) =>
      person.children && person.children.length > 0
        ? person.children
        : [{
          _id: 'placeholder',
          id_number: 'placeholder',
          firstName: '',
          lastName: '',
          type: 'No Descendants',
          age: '',
          image: '/images/no-children.png',
          emoji: '🚫',
          children: [],
          isPlaceholder: true
          }]
    )
    .map((kid: Person, kidIndex: number) => (
      <div
        key={kidIndex}
        className="cursor-pointer"
        onClick={async () => {
          if (!kid.isPlaceholder) {
            telemetryEvent(kid.id_number, 'kid_clicked', kid.type)

            const childTree = await getChildTree(kid.id_number)

            const childLevel = {
              people:
                childTree.children && childTree.children.length > 0
                  ? childTree.children
                  : [{
                      type: 'No Descendants',
                      age: '',
                      image: '/images/no-children.png',
                      emoji: '🚫',
                      isPlaceholder: true,
                      children: []
                    }],
              index: 0
            }

            console.log(`childLevel.people : ${JSON.stringify(childLevel.people)}`)

            const truncatedStack = personSteps.slice(0, personSteps.length - 2)
            const stack = [
              ...truncatedStack,
              { people: [childTree], index: 0 },
              childLevel
            ]
        
            setPersonSteps(stack)
            setChildren(childLevel.people)
            console.log('Updated children:', childLevel.people)
        
            setLoading(false)
          }
        }}
      >
        <PersonCard person={kid} />
      </div>
    ))}
  </div>
  </div>
  )
}
 
//      {/* Children Display */}
//      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 pb-4 z-10 relative pointer-events-auto">
//        {children.map((child, idx) => (
//          <div
//            key={idx}
//            className="cursor-pointer"
//            onClick={() => handleChildClick(child)}
//          >
//            <PersonCard person={child} />
//          </div>
//        ))}
//      </div>
//    </div>
//  )
//}