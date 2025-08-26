import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useTelemetryContext } from '@/lib/TelemetryContext'
import { TelemetryProps } from '@/lib/withTelemetry'
import { Person } from '@/services/personService'
 
const VITE_IMAGE_CORE_PATH = "http://localhost:3000/IMAGETHS"
const VITE_CORE_PATH = "http://localhost:3000"
 

type PersonCardProps = {
  person: Person;
  width?: string;   // expects Tailwind classes like "w-[300px]" or "w-1/2"
  height?: string;  // expects Tailwind classes like "h-[200px]" or "h-auto"
};

function PersonCard({
  person,
  width = "w-[250px]",
  height = "h-[150px]"
}: PersonCardProps) {

  const isPlaceholder = person?.isPlaceholder;
 
  const imageAddress = person?.IMAGETH
    ? person.IMAGETH.startsWith('/IMAGETHS')
      ? `${VITE_IMAGE_CORE_PATH}${person.IMAGETH.replace('/IMAGETHS', '')}`
      : `${VITE_IMAGE_CORE_PATH}/${person.IMAGETH.split('/').pop()}`
    : null;

  return (
    <div
      className={`relative ${width} ${height} rounded-2xl overflow-hidden p-4 shadow-md ${
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
 
function ContentTypeCard({ person, contentType }: { person: Person, contentType: string }) {
  const isPlaceholder = person?.isPlaceholder;

  const imageAddress = `${VITE_IMAGE_CORE_PATH}/${contentType}.jpg`

  return (
    <div
      className={`relative w-[150px] h-[150px] rounded-xl overflow-hidden p-4 shadow-md ${isPlaceholder ? 'bg-gray-700  text-white opacity-60' : 'bg-black text-white'
        }`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-grow"></div>
        <div className="w-full flex items-end justify-between">
          <div className="w-1/3"></div>
          <div className="w-full flex items-center justify-center">
            <span className="text-white text-xl">{contentType}</span>
          </div>
        </div>
      </div>

      {imageAddress && (
        <img
          src={imageAddress}
          alt={contentType || 'ContentType'}
          className="absolute top-0 left-0 w-full h-1/2 object-cover opacity-70 mix-blend-lighten"
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
  const [professions, setProfessions] = useState<String[]>([])
  const [socials, setSocials] = useState<String[]>([])

  const [loading, setLoading] = useState(true)
  let firstIndex = 0;
  let secondIndex: number = 0;
  const [firstActiveIndex, setFirstActiveIndex] = useState(firstIndex);
  const [secondActiveIndex, setSecondActiveIndex] = useState(secondIndex);

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
                THINGS: 'CHILDREN',
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
                THINGS: 'CHILDREN',
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
        setManjemPerson(people[firstActiveIndex])

        if(secondActiveIndex===0/* INDEX=0*/){ 
          setChildren(people[firstActiveIndex].CHILDREN ?? [{
            THINGS: 'CHILDREN',
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

  function setChildrenFunction() {
    setChildren(  
      people[firstActiveIndex].CHILDREN && people[firstActiveIndex].CHILDREN.length > 0
        ? people[firstActiveIndex].CHILDREN
        : [{
          THINGS: 'CHILDREN',
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
  }

  useEffect(() => {
    if (personId === 'AMETH' ) {
      console.log(`FETCHIN: PEOPLE}`)
      fetchPeopleTree();
    }
    if (people[firstActiveIndex]) {
        setChildrenFunction();
      setManjemPerson(people[firstActiveIndex]);
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
 
  const handleVerticalChange = (swiper: any, person: Person) => {
    const index = swiper.activeIndex
    setFirstActiveIndex(index);

    console.log(`handleVerticalChange-firstActiveIndex: ${firstActiveIndex}`)
    console.log(`handleVerticalChange-secondActiveIndex: ${secondActiveIndex}`)

    if (secondActiveIndex=== 2 ){
      if (person.CHILDREN)
        setChildren(person.CHILDREN);
    }

    if (secondActiveIndex === 0) {
      if (person.THINGS) {
        setProfessions(professions);
      }
    }

    if (secondActiveIndex === 1) {
      if (person.THINGS) {
        setSocials(socials);

      }
    }

    //setProfessions(professions);
    //setAcademia(accademia);
    //setSocials(socials);
    //setPages(pages);

    telemetryEvent(manjemPerson?.IDNUM, 'slided_to_sibling', manjemPerson?.TYPETH || '')
  }
 
  function handleContentTypeVerticalChange(swiper: SwiperClass, person: Person): void {
    const index = swiper.activeIndex
    setSecondActiveIndex(index);

    console.log(`handleContentTypeVerticalChange-firstActiveIndex: ${firstActiveIndex}`)
    console.log(`handleContentTypeVerticalChange-secondActiveIndex: ${secondActiveIndex}`)

    if (secondActiveIndex === 2){
      if (person.CHILDREN) {
        setChildren(person.CHILDREN);
      }
    }

    if (secondActiveIndex === 0) {
      if (person) {
        setProfessions(professions);
      }
    }
    
    if (secondActiveIndex === 1) {
      if (person) {
        setSocials(socials);

      }
    }

  }

  // Handle chid click - completely redesigned
  const handleChildClick = async (child: Person) => {
    if (child.isPlaceholder) return
    telemetryEvent(child.IDNUM, 'child_clicked', child.TYPETH)    // Fetch the selected child's data with its children
    await fetchPersonData(child.IDNUM)
  }

  return (
    <div className="w-full max-w-md h-full flex flex-col gap-4 items-center justify-start bg-gray-300 p-4 rounded-xl mx-auto">

      {/* Row: Parent + Content */}
      <div className="flex w-full gap-4 justify-center">
        {/* Parent slider container */}
        <div className="w-[250px] h-[150px] z-10 relative pointer-events-auto">
          {people[firstActiveIndex] && (
            <Swiper
              key={firstActiveIndex}
              direction="vertical"
              slidesPerView={1}
              onSlideChange={(swiper) =>
                handleVerticalChange(swiper, people[firstActiveIndex])
              }
              allowTouchMove={true}
              className="w-full h-full"
              initialSlide={firstActiveIndex}
            >
              {people.map((p, idx) => (
                <SwiperSlide
                  key={p.IDNUM || idx}
                  className="flex items-center justify-center w-full h-full"
                >
                  <PersonCard person={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* Content Type Card container */}
        <div className="flex w-full gap-4 max-h-[165px] pr-2 pb-4 z-10 relative pointer-events-auto">

          {manjemPerson.THINGS[secondActiveIndex] && (
            <Swiper
              key={secondActiveIndex}
              direction="vertical"
              slidesPerView={1}
              onSlideChange={(swiper) =>
                handleContentTypeVerticalChange(swiper, manjemPerson)
              }
              allowTouchMove={true}
              className="w-full "
              initialSlide={secondActiveIndex}
            >
              {manjemPerson.THINGS.map((T, TDX) => (
                <SwiperSlide
                  key={T || TDX}
                  className="flex items-center justify-center w-full"
                >
                  <ContentTypeCard person={manjemPerson} contentType={T} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>

      {/* Row: Children below */}
      <div className="flex flex-col gap-4 w-full max-h-[400px] overflow-y-auto pr-2 pb-4 z-10 relative pointer-events-auto">
        {children?.length > 0 ? (
          children.map((kid: Person, kidIndex: number) => (
            <div
              key={kid.IDNUM || kidIndex}
              className="cursor-pointer"
              onClick={async () => handleChildClick(kid)}
            >
              <PersonCard person={kid} width="w-[417px]" />
            </div>
          ))
        ) : (
          <PersonCard
            person={{
              THINGS: 'CHILDREN',
              IDNUM: 'WORKETH',
              NAME: 'WORKETH',
              LASTNAME: 'WORKETH',
              TYPETH: 'No Descendants',
              AGETH: 'WORKETH',
                IMAGETH: `${VITE_IMAGE_CORE_PATH}/PROFESSIONAL.jpg`,
              EMOJIMETH: '💵',
              isPlaceholder: true,
            }}

            width="w-[417px]" 
          />
        )}
      </div>
    </div>
  );

  
}


