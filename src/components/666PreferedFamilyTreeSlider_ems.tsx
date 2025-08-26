import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useTelemetryContext } from '@/lib/TelemetryContext'
import { TelemetryProps } from '@/lib/withTelemetry'
import { Person } from '@/services/personService'
 
const VITE_IMAGE_CORE_PATH = "http://localhost:3000/IMAGETHS"
const VITE_CORE_PATH = "http://localhost:3000"
 
function PersonCard({ person }: { person: Person }) {
  const isPlaceholder = person?.isPlaceholder;
 
  const imageAddress = person?.IMAGETH
    ? person.IMAGETH.startsWith('/IMAGETHS')
      ? `${VITE_IMAGE_CORE_PATH}${person.IMAGETH.replace('/IMAGETHS', '')}`
      : `${VITE_IMAGE_CORE_PATH}/${person.IMAGETH.split('/').pop()}`
    : null;

    console.log(`PersonCard-imageAddress : ${imageAddress}`);

  return (
    <div
      className={`relative w-[250px] h-[150px] rounded-2xl overflow-hidden p-4 shadow-md ${
        isPlaceholder ? 'bg-gray-700 text-white opacity-60' : 'bg-black text-white'
      }`}
    >
        <div className="flex flex-col h-full">
          {/* Name at top-right */}
          <div className="flex justify-end w-full">
            <div className="text-sm font-semibold text-center">
              {person?.NAME || 'UNNAMED'}
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="w-full flex items-end justify-between">
            <div className="w-1/3"></div>
            <div className="w-1/3 flex justify-center">
              <span className="text-white text-2xl font-bold">
                {person?.AGETH || '-'}
              </span>
            </div>
            <div className="w-1/3 flex justify-end">
              <span className="text-white text-2xl">
                {person?.EMOJIMETH || '💖'}
              </span>
            </div>
          </div>
        </div>

      {imageAddress && (
        <img
          src={imageAddress}
          alt={person?.NAME || 'Person IMAGETH'}
          className="absolute top-0 left-0 w-1/2 h-1/2 object-cover opacity-70 mix-blend-lighten"
          style={{ objectPosition: 'top left' }}
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
  const [personSteps, setPersonSteps] = useState<{ people: Person[]; index: number }[]>([])
  const [people, setPeople] = useState<Person[]>([])
  const [manjemPerson, setManjemPerson] = useState<Person | null>(null)
  const [children, setChildren] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  let firstIndex=0;
  const [activeIndex, setActiveIndex] = useState(firstIndex);

  const fetchPersonData = useCallback(async (id: string) => {
    setLoading(true)
    try {
      const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons/${id}/with-children`)
      const person = response.data
      console.log(`Fetched person: ${JSON.stringify(person)}`)
      
      setManjemPerson(person)
      
      if(person.CHILDREN){
        console.log(`Person has kids.`);
        setChildren(
          person.CHILDREN?.length > 0
            ? person.CHILDREN
            : [{
                IDNUM: 'AMETH',
                NAME: 'N/A',
                LASTNAME: 'N/A',
                TYPETH: 'No Descendants',
                AGETH: 'N/A',
                IMAGETH: `${VITE_IMAGE_CORE_PATH}/PHELIM.jpg`,
                EMOJIMETH: '🚫',
                isPlaceholder: true,
              }]
        )
      }

      setPersonSteps([{ people: [person], index: 0 }])
      
      setLoading(false)

      return person;

    } catch (err) {
      console.error('Failed to fetch persons:', err)
      setLoading(false)
    }
  }, [])
 
  const getChildTree = async function (id: string): Promise<Person> {
    setLoading(true)
    try {
      const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons/${id}/with-children`)
      //const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons/`)
      const person = response.data as unknown as Person
      console.log(`Fetched person: ${JSON.stringify(person)}`)
      
      setManjemPerson(person)
      
      if(person.CHILDREN){
        console.log(`Person has kids.`);
        setChildren(
          person.CHILDREN?.length > 0
            ? person.CHILDREN
            : [{
                IDNUM: 'AMETH',
                NAME: 'N/A',
                LASTNAME: 'N/A',
                TYPETH: 'No Descendants',
                AGETH: 'N/A',
                IMAGETH: `${VITE_IMAGE_CORE_PATH}/PHELIM.jpg`,
                EMOJIMETH: '🚫',
                isPlaceholder: true,
              }]
        )
      }

      setPersonSteps([{ people: [person], index: 0 }])
      
      setLoading(false)

      return person;

    } catch (e) {
      console.error('Failed to fetch persons:', e)
      setLoading(false)
      throw e
    }
  }

  const fetchPeopleTree = async function (): Promise<Person[]> {
    setLoading(true)
    try {
      const response = await axios.get<Person[]>(`${VITE_CORE_PATH}/api/persons`)
      const people = response.data as unknown as Person[]
      setPersonSteps([{ people: people, index: 0 }])

      setPeople(people);

      if (people.length > 0) {
        console.log(`people: ${JSON.stringify(people)}`)
        setManjemPerson(people[activeIndex])
        console.log(`people[activeIndex].IMAGETH: ${people[activeIndex].IMAGETH}`)
        console.log(`people[activeIndex].CHILDREN: ${JSON.stringify(people[activeIndex].CHILDREN)}`)
        setChildren(people[activeIndex].CHILDREN ?? [{
          IDNUM: 'AMETH',
          NAME: 'N/A',
          LASTNAME: 'N/A',
          TYPETH: 'No Descendants',
          AGETH: 'N/A',
          IMAGETH: `${VITE_IMAGE_CORE_PATH}/PHELIM.jpg`,
          EMOJIMETH: '🚫',
          isPlaceholder: true,
        }])
      }
      
      setPersonSteps([{ people: people, index: 0 }])
      
      setLoading(false)
      return people;

    } catch (e) {
      console.error('Failed to fetch persons:', e)
      setLoading(false)
      throw e
    }
  }

  useEffect(() => {
    if (personId === 'AMETH' ) {
      console.log(`FETCHIN: PEOPLE}`)
      fetchPeopleTree();
    }
    if (people[activeIndex]) {
      setChildren(
        people[activeIndex].CHILDREN && people[activeIndex].CHILDREN.length > 0
          ? people[activeIndex].CHILDREN
          : [{
              IDNUM: 'AMETH',
              NAME: 'AMETH',
              LASTNAME: 'AMETH',
              TYPETH: 'No Descendants',
              AGETH: 'AMETH',
              IMAGETH: `${VITE_IMAGE_CORE_PATH}/PHELIM.jpg`,
              EMOJIMETH: '💖',
              isPlaceholder: true,
            }]
      );
      setManjemPerson(people[activeIndex]);
    }
  }, [personId, PersonCard, PreferedFamilyTreeSlider  ])
 
  if (loading) return <p>Loading family tree...</p>
  if (!manjemPerson) return <p>No persons available</p>
 
  const telemetryEvent = (personId: string, action: string, personTYPETH: string) => {
    const eventData = {
      ...telemetry,
      timestamp: new Date().toISOString(),
      event: `${eventName}:${action}`,
      component: componentName,
      person: personTYPETH,
      personId: personId,
    }
    console.log('Telemetry Event:', eventData)
  }
 
  const handleVerticalChange = (swiper: any, kids: Person[]) => {
    const index = swiper.activeIndex
    setActiveIndex(index);
    setChildren(kids);
    telemetryEvent(manjemPerson?.IDNUM, 'slided_to_sibling', manjemPerson?.TYPETH || '')
  }
 
  // Handle child click - completely redesigned
  const handleChildClick = async (child: Person) => {
    if (child.isPlaceholder) return
    
    telemetryEvent(child.IDNUM, 'child_clicked', child.TYPETH)
    
    // Fetch the selected child's data with its children
    await fetchPersonData(child.IDNUM)
  }
 
  return (
    <div className="w-full h-full flex gap-4 items-start justify-center bg-gray-300 p-4 rounded-xl">
      {/* Parent slider container always rendered */}
      <div className="w-[250px] h-[150px] z-10 relative pointer-events-auto">
        {people[activeIndex] && (
          <Swiper
            key={activeIndex}
            direction="vertical"
            slidesPerView={1}
            onSlideChange={(swiper) => handleVerticalChange(swiper, people[activeIndex].CHILDREN ?? [])}
            allowTouchMove={true}
            className="w-full h-full"
            initialSlide={activeIndex}
          >
            {people.map((p, idx) => (
              <SwiperSlide key={p.IDNUM || idx} className="flex items-center justify-center w-full h-full">
                <PersonCard person={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
  
      {/* Children container rendered independently */}
      <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-2 pb-4 z-10 relative pointer-events-auto">
        {children?.length > 0 ? (
          children.map((kid: Person, kidIndex: number) => (
            <div
              key={kid.IDNUM || kidIndex}
              className="cursor-pointer"
              onClick={async () => handleChildClick(kid)}
            >
              <PersonCard person={kid} />
            </div>
          ))
        ) : (
          <div
              className="cursor-pointer" 
            >
              <PersonCard person={{
              IDNUM: 'WORKETH',
              NAME: 'WORKETH',
              LASTNAME: 'WORKETH',
              TYPETH: 'No Descendants',
              AGETH: 'WORKETH',
              IMAGETH: `${VITE_IMAGE_CORE_PATH}/MOCHEDAMATHS.jpg`,
              EMOJIMETH: '💵',
              isPlaceholder: true,
            }} />
            </div>
        )}
      </div>
    </div>
  )
  
}