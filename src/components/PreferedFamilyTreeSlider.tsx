  import React, { useState, useEffect, useCallback } from 'react'
  import axios from 'axios'
  import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
  import 'swiper/css'
  import { useTelemetryContext } from '@/lib/TelemetryContext'
  import { TelemetryProps } from '@/lib/withTelemetry'
  import { Person } from '@/person/personService'
  import { PersonCardDetails } from './PersonDetaisCard'
  import FormPerson from './other/FormPerson'
  import { getPersonsHighestThingsValWhereChildItemsExist } from '@/lib/ents'
  import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

  const VITE_IMAGE_PENTENT_PATH = "https://swiper-backend-production.up.railway.app/PEGETENT/"
  const VITE_IMAGE_CORE_PATH = "https://swiper-backend-production.up.railway.app/"
  const VITE_CORE_PATH = "https://swiper-backend-production.up.railway.app"

  function ContentTypeCard({ person, contentType }: { person: Person, contentType: string }) {
    const isPlaceholder = person?.isPlaceholder;

    const imageAddress = `${VITE_IMAGE_PENTENT_PATH}/${contentType}.jpg`

    return (
      <div
        className={`relative w-full h-full rounded-xl overflow-hidden p-4 shadow-md ${isPlaceholder ? 'bg-gray-700  text-white opacity-60' : 'bg-black text-white'
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
    const [children, setFamily] = useState<Person[]>([])
    const [professions, setProfessions] = useState<String[]>([])
    const [socials, setSocials] = useState<String[]>([])
    const [faan, setFaan] = useState<String[]>([])
    const [culture, setCulture] = useState<String[]>([])
    const [activePerson, setActivePerson] = useState<Person | null>(null)
    const [showFormPerson, setShowFormPerson] = useState(false)

    const [loading, setLoading] = useState(true)

    let firstIndex = 0;
    let secondIndex: number = 0;
    let thirdIndex: number = 0;

    const [firstActiveIndex, setFirstActiveIndex] = useState(firstIndex);
    const [secondActiveIndex, setSecondActiveIndex] = useState(secondIndex);
    const [thirdActiveIndex, setThirdActiveIndex] = useState(thirdIndex);
    
    const fetchPersonData = async function (id: string): Promise<Person[]> {
      setLoading(true)
      try {
        const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons/${id}/with-children`);
        const person = response.data;
        console.log(`Fetched person: ${JSON.stringify(person)}`);
        
        setManjemPerson(person);
        setPersonSteps([{ people: [person], index: 0 }]);
        setPeople([person]);
        setLoading(false)
        return [person];

      } catch (err) {
        console.error('Failed to fetch persons:', err)
        setLoading(false)
      }
      return [];
    }
  
    const getChildTree = async function (id: string): Promise<Person> {
      setLoading(true)
      try {
        const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons/${id}/with-children`)
        //const response = await axios.get<Person>(`${VITE_CORE_PATH}/api/persons/`)
        const person = response.data as unknown as Person
        console.log(`Fetched person: ${JSON.stringify(person)}`)
        
        setManjemPerson(person)
        
        if(person.FAMILY){
          console.log(`Person has kids.`);
          setFamily(
            person.FAMILY?.length > 0
              ? person.FAMILY
              : [{
                  THINGS: 'FAMILY',
                  IDNUM: 'AFEGATH',
                  NAME: 'N/A',
                  LASTNAME: 'N/A',
                  TYPETH: 'No Descendants',
                  AGETH: 'N/A',
                  IFATH: '',
                  IMAGETH: `${VITE_IMAGE_PENTENT_PATH}/PHELIM.jpg`,
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

    const fetchPeopleTree = async function (start: boolean): Promise<Person[]> {
      setLoading(true)
      try {
        const response = await axios.get<Person[]>(`${VITE_CORE_PATH}/api/persons/complete`)
        const people = response.data as unknown as Person[]
        setPersonSteps([{ people: people, index: 0 }])

        setPeople(people);

        if (people.length > 0) {
          console.log(`fetchPeopleTree secondActiveIndex WAS: ${secondActiveIndex}`);
          if (manjemPerson !==null){
              setSecondActiveIndex( getPersonsHighestThingsValWhereChildItemsExist(manjemPerson) );
              console.log(`fetchPeopleTree secondActiveIndex IS: ${secondActiveIndex}`);
          }

          console.log(`fetchPeopleTree Setting firstActiveIndex : ${firstActiveIndex}`);
          if(start){
            setManjemPerson(people[firstActiveIndex]);
          } else {
            setActivePerson(people[firstActiveIndex])
          }
          console.log(`fetchPeopleTree Setting person: ${JSON.stringify(people[firstActiveIndex])}`);
        }
              
        setLoading(false)
        return people;

      } catch (e) {
        console.error('Failed to fetch persons:', e)
        setLoading(false)
        throw e
      }
    }

    function setFamilyFunction() {
      if (people[firstActiveIndex] && people[firstActiveIndex].FAMILY )
      setFamily( people[firstActiveIndex].FAMILY);
    }

    useEffect(() => {
      if (personId === 'AFEGATH') {
        console.log(`PEOPLE:`)
        fetchPeopleTree(true);
        console.log(`:PEOPLE}`)
      }
    }, [])

  useEffect(() => {
    if (activePerson !== manjemPerson ) {
      setManjemPerson(activePerson);
      return;
    } 
  }, [ activePerson ])

  useEffect(() => {
      if (personId === 'AFEGATH' && activePerson !== manjemPerson) {
        console.log(`FETCH: PEOPLE`)
        fetchPeopleTree(false);
        console.log(`DONE   FETCH: PEOPLE}`)
      } else {
        if (manjemPerson){
          setSecondActiveIndex(getPersonsHighestThingsValWhereChildItemsExist(manjemPerson)); 
        }
      }
  }, [manjemPerson])

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
  
    const handleVerticalChange = async (swiper: any, person: Person) => {
      const index = swiper.activeIndex
      setFirstActiveIndex(index);
      setActivePerson(person);
    }
  
    function handleContentTypeVerticalChange(swiper: SwiperClass, person: Person): void {
      const index = swiper.activeIndex
      setSecondActiveIndex(index);
    }

    const handleChildVerticalChange = (activeIndex: number, childItems: Person[], manjemPerson: Person, secondActiveIndex) => {
      const activeChild = childItems[activeIndex];
      setThirdActiveIndex(activeIndex);
    };

    // Handle chid click - completely redesigned
    const handleChildClick = async (child: Person) => {
      if (child.isPlaceholder) return
      telemetryEvent(child.IDNUM, 'child_clicked', child.TYPETH)    // Fetch the selected child's data with its children
      await fetchPersonData(child.IDNUM)
    }

    return (
      <div className="flex flex-col items-center gap-1 w-full h-full bg-pink-100 rounded-xl mx-auto relative">
        <PanelGroup direction="vertical" className="w-full h-full">
          {/* TOP: the two Swipers side-by-side; defaults to 15%, capped at 33% */}
          <Panel defaultSize={15} minSize={7} maxSize={33}>
            <div className="flex w-full h-full gap-1 justify-center">
              {/* MAIN slider container */}
              <div className="w-full h-full relative pointer-events-auto">
                {people && people[firstActiveIndex] && people[firstActiveIndex].THINGS && people[firstActiveIndex].THINGS[secondActiveIndex] && (
                  <Swiper
                    key={firstActiveIndex}
                    direction="vertical"
                    slidesPerView={1}
                    onSlideChange={(swiper) => handleVerticalChange(swiper, people[swiper.activeIndex])}
                    allowTouchMove={true}
                    className="w-full h-full"
                    initialSlide={firstActiveIndex}
                  >
                    {people && people[firstActiveIndex] && people[firstActiveIndex].THINGS && people[firstActiveIndex].THINGS[secondActiveIndex] &&
                      people.map((p, idx) => (
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
              <div className="flex w-full h-full z-10 relative pointer-events-auto">
                {people && people[firstActiveIndex] && people[firstActiveIndex].THINGS && people[firstActiveIndex].THINGS[secondActiveIndex] &&
                  people[firstActiveIndex].THINGS[secondActiveIndex].val && (
                    <Swiper
                      key={secondActiveIndex}
                      direction="vertical"
                      slidesPerView={1}
                      onSlideChange={(swiper) =>
                        handleContentTypeVerticalChange(swiper, people[firstActiveIndex])
                      }
                      allowTouchMove={true}
                      className="w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-transparent"
                      initialSlide={secondActiveIndex}
                    >
                      {people[firstActiveIndex].THINGS.map((T: any, TDX: any) => (
                        <SwiperSlide
                          key={T.val || TDX}
                          className="flex items-center justify-center w-full"
                        >
                          <ContentTypeCard person={people[firstActiveIndex]} contentType={T.val} />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
              </div>
            </div>
          </Panel>

          {/* DRAG HANDLE */}
  <PanelResizeHandle
    className="h-1 w-full cursor-row-resize bg-transparent hover:bg-white/20 active:bg-white/30 transition-colors"
  />

          {/* BOTTOM: PersonCardDetails fills the rest */}
          <Panel>
            <div className="flex-col w-full h-full overflow-y-auto flex-1 z-10 relative pointer-events-auto">
              {people && people[firstActiveIndex] && people[firstActiveIndex].THINGS &&
                people[firstActiveIndex].THINGS[secondActiveIndex]?.childItems?.length > 0 ? (
                <div className="cursor-pointer w-full h-full">
                  <PersonCardDetails
                    person={people[firstActiveIndex]}
                    width="w-full"
                    THING={people[firstActiveIndex].THINGS[secondActiveIndex].val}
                    childItems={people[firstActiveIndex].THINGS[secondActiveIndex].childItems}
                  />
                </div>
              ) : (
                <div className="cursor-pointer w-full h-full">
                  <PersonCardDetails
                    person={{
                      THINGS: "FAMILY",
                      IDNUM: "WORKETH",
                      NAME: "WORKETH",
                      LASTNAME: "WORKETH",
                      TYPETH: "No Descendants",
                      AGETH: "WORKETH",
                      IMAGETH: `${VITE_IMAGE_CORE_PATH}/CULTURE.jpg`,
                      EMOJIMETH: "💵",
                      isPlaceholder: true,
                    }}
                    THING="CULTURE"
                    width="w-full"
                    childItems={[]}
                  />
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    );

  type PersonCardProps = {
    person: Person;
    width?: string; 
    height?: string; 
  };

  function PersonCard({
    person,
    width = "w-[250px]",
    height = "h-[150px]"
  }: PersonCardProps) {

    const isPlaceholder = person?.isPlaceholder;

    const imageAddress = person?.IFATH?.path
      ? `${VITE_IMAGE_CORE_PATH}${person.IFATH.path.replace(/^public\//, "")}`
      : null;

    return (
      <div
        className={`relative w-full h-full rounded-xl overflow-hidden p-1 shadow-md ${isPlaceholder ? 'bg-gray-700 text-white opacity-60' : 'bg-black text-white'
          }`}
      >
        <div className="flex flex-col w-full h-full">
          <div className="flex justify-end w-full">
            <div className="text-sm font-semibold text-center">
              {person?.NAME || 'UNNAMED'}
            </div>
          </div>
          <div className="flex-grow"></div>
          <div className="w-full flex items-end justify-between">
            <div className="w-1/3"></div>
            <div className="w-1/3 flex justify-end">
              <span className="text-white text-2xl">
                {person?.EMOJIMETH || '💖'}
              </span>
            </div>
          </div>
        </div>

        {person && imageAddress && (
          <img
            src={imageAddress}
            alt={person?.IFATH.path || 'Person IMAGETH'}
            className="absolute top-0 left-0 w-1/2 h-1/2 object-cover opacity-70 mix-blend-lighten"
            style={{ objectPosition: 'top left' }}
          />
        )}

        <CwayithimazCursorCurtain 
        show={true} 
        background="transparent" 
        color="#ffffff"
        onCursorClick={() => setShowFormPerson(true)}
        />
        
      </div>
    );
  }

  interface CwayithimazCursorCurtainProps {
    show: boolean;
    cwayithimazIndex?: number; // which cursor blinks
    cwayithimazSpeed?: number; // blink speed multiplier
    cursorCount?: number; // number of cursors
    cursorWidth?: string;
    cursorHeight?: string;
    color?: string;
    background?: string;
    onCursorClick?: (index: number) => void; //
  }

  function CwayithimazCursorCurtain({
    show,
    cwayithimazIndex = 0,
    cwayithimazSpeed = 1,
    cursorCount = 6,
    cursorWidth = "20px",
    cursorHeight = "3px",
    color = "#ffffff",
    background = "rgba(0,0,0,0.6)", // default translucent black
    onCursorClick,
  }: CwayithimazCursorCurtainProps) {
    const [cwayithimaz, setCwayithimaz] = useState(true);

    useEffect(() => {
      const interval = setInterval(
        () => setCwayithimaz((prev) => !prev),
        500 * cwayithimazSpeed
      );
      return () => clearInterval(interval);
    }, [cwayithimazSpeed]);

    if (!show) return null;

    return (
      <div
        className="fixed inset-4 top-37 flex items-center justify-start z-50"
        style={{
          background: background,
        }}
      >
        <div className="flex gap-1">
          {Array.from({ length: cursorCount }).map((_, i) => (
            <span
              key={i}
              onClick={() => setShowFormPerson(true)} // 👉 Fire  whem
              style={{
                width: cursorWidth,
                height: cursorHeight,
                display: "inline-block",
                backgroundColor: "transparent",
                border: `1px solid ${color}`,
                opacity: i === cwayithimazIndex ? (cwayithimaz ? 1 : 0.2) : 1,
                boxShadow:
                  i === cwayithimazIndex && cwayithimaz
                    ? `0 0 6px 2px ${color}`
                    : "none",
                transition: "opacity 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer", // 👆 show pointer
              }}
            />
          ))}
        </div>
      </div>
    );
  }

}