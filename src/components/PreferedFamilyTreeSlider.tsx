import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { api, backendUrl, BACKEND_BASE_URL } from '@/lib/backend'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useTelemetryContext } from '@/lib/TelemetryContext'
import { TelemetryProps } from '@/lib/withTelemetry'
import { Person } from '@/person/personService'
import { PersonCardDetails } from './PersonDetaisCard'
import { getPersonsHighestThingsValWhereChildItemsExist } from '@/lib/ents'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import { getImageUrl } from '../lib/utils'

const IS_DEV = import.meta.env.DEV

function debugLog(...args: any[]) {
  if (IS_DEV) console.log(...args)
}

const USER_IMAGES_PATH = String(import.meta.env.VITE_USER_IMAGES_PATH ?? '')
  .replace(/^\/+/, '')
  .replace(/\/+$/, '')

const BACKEND_IMAGE_URL = USER_IMAGES_PATH
  ? backendUrl(`/${USER_IMAGES_PATH}`)
  : BACKEND_BASE_URL

const BACKEND_IMAGE_CATAGORY_PATH = backendUrl('/PEGETENT')

type PersonCardProps = {
  person: Person
  width?: string
  height?: string
  imageBaseUrl: string
  onOpenForm: () => void
}

const PersonCard = React.memo(function PersonCard({
  person,
  width = 'w-[250px]',
  height = 'h-[150px]',
  imageBaseUrl,
  onOpenForm,
}: PersonCardProps) {
  const isPlaceholder = person?.isPlaceholder

  const imageAddress = useMemo(() => {
    return getImageUrl(imageBaseUrl, (person as any)?.IMAGE)
  }, [imageBaseUrl, (person as any)?.IMAGE])

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden p-1 shadow-md ${
        isPlaceholder ? 'bg-gray-700 text-white opacity-60' : 'bg-black text-white'
      }`}
    >
      <div className="flex flex-col w-full h-full">
        <div className="flex justify-end w-full">
          <div className="text-sm font-semibold text-center">{(person as any)?.NAME || 'UNNAMED'}</div>
        </div>
        <div className="flex-grow"></div>
        <div className="w-full flex items-end justify-between">
          <div className="w-1/3"></div>
          <div className="w-1/3 flex justify-end">
            <span className="text-white text-2xl">{(person as any)?.EMOJIMETH || '💖'}</span>
          </div>
        </div>
      </div>

      {person && imageAddress && (
        <img
          src={imageAddress}
          alt={(person as any)?.IFATH?.path || 'Person IMAGETH'}
          className="absolute top-0 left-0 w-1/2 h-1/2 object-cover opacity-70 mix-blend-lighten"
          style={{ objectPosition: 'top left' }}
        />
      )}

      <CwayithimazCursorCurtain
        show={true}
        background="transparent"
        color="#ffffff"
        onCursorClick={onOpenForm}
      />
    </div>
  )
})

type ContentTypeCardProps = {
  person: Person
  contentType: string
  categoryImageBaseUrl: string
}

const ContentTypeCard = React.memo(function ContentTypeCard({
  person,
  contentType,
  categoryImageBaseUrl,
}: ContentTypeCardProps) {
  const isPlaceholder = person?.isPlaceholder
  const imageAddress = `${categoryImageBaseUrl}/${contentType}.jpg`

  return (
    <div
      className={`relative w-full h-full rounded-xl overflow-hidden p-4 shadow-md ${
        isPlaceholder ? 'bg-gray-700  text-white opacity-60' : 'bg-black text-white'
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
  )
})

type CwayithimazCursorCurtainProps = {
  show: boolean
  cwayithimazIndex?: number // which cursor blinks
  cwayithimazSpeed?: number // blink speed multiplier
  cursorCount?: number // number of cursors
  cursorWidth?: string
  cursorHeight?: string
  color?: string
  background?: string
  onCursorClick?: (index: number) => void
}

function CwayithimazCursorCurtain({
  show,
  cwayithimazIndex = 0,
  cwayithimazSpeed = 1,
  cursorCount = 6,
  cursorWidth = '20px',
  cursorHeight = '3px',
  color = '#ffffff',
  background = 'rgba(0,0,0,0.6)', // default translucent black
  onCursorClick,
}: CwayithimazCursorCurtainProps) {
  const [cwayithimaz, setCwayithimaz] = useState(true)

  useEffect(() => {
    const interval = setInterval(
      () => setCwayithimaz((prev) => !prev),
      500 * cwayithimazSpeed
    )
    return () => clearInterval(interval)
  }, [cwayithimazSpeed])

  if (!show) return null

  return (
    <div
      className="fixed inset-4 top-37 flex items-center justify-start z-50"
      style={{ background: background }}
    >
      <div className="flex gap-1">
        {Array.from({ length: cursorCount }).map((_, i) => (
          <span
            key={i}
            onClick={() => onCursorClick?.(i)}
            style={{
              width: cursorWidth,
              height: cursorHeight,
              display: 'inline-block',
              backgroundColor: 'transparent',
              border: `1px solid ${color}`,
              opacity: i === cwayithimazIndex ? (cwayithimaz ? 1 : 0.2) : 1,
              boxShadow:
                i === cwayithimazIndex && cwayithimaz ? `0 0 6px 2px ${color}` : 'none',
              transition: 'opacity 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function PreferedFamilyTreeSlider({
    personId,
    eventName = 'FamilyTreeSwipe',
    componentName,
    people,
  }: TelemetryProps & { people: Person[] }) {
    const telemetry = useTelemetryContext();
    const [firstActiveIndex, setFirstActiveIndex] = useState(0);
    const [secondActiveIndex, setSecondActiveIndex] = useState(0);

    const currentPerson = people[firstActiveIndex];
    const currentThings = (currentPerson as any)?.THINGS as any[] | undefined;
    const currentThing = currentThings?.[secondActiveIndex];
    const currentChildItems = (currentThing as any)?.childItems as any[] | undefined;
    const hasChildItems = Array.isArray(currentChildItems) && currentChildItems.length > 0;

    useEffect(() => {
        if (currentPerson) {
            setSecondActiveIndex(getPersonsHighestThingsValWhereChildItemsExist(currentPerson));
        }
    }, [currentPerson]);

    const handleMainSlideChange = useCallback(
        (swiper: any) => {
            const index = swiper.activeIndex;
            setFirstActiveIndex(index);
        },
        [people]
    );

    const handleContentTypeSlideChange = useCallback((swiper: SwiperClass) => {
        const index = swiper.activeIndex;
        setSecondActiveIndex(index);
    }, []);

    if (!currentPerson) return <p>No persons available</p>;

    return (
        <div className="flex flex-col items-center gap-1 w-full h-full bg-pink-100 rounded-xl mx-auto relative">
            <PanelGroup direction="vertical" className="w-full h-full">
                <Panel defaultSize={15} minSize={7} maxSize={33}>
                    <div className="flex w-full h-full gap-1 justify-center">
                        <div className="w-full h-full relative pointer-events-auto">
                            {currentPerson && currentThing && (
                                <Swiper
                                    key={firstActiveIndex}
                                    direction="vertical"
                                    slidesPerView={1}
                                    onSlideChange={handleMainSlideChange}
                                    allowTouchMove={true}
                                    className="w-full h-full"
                                    initialSlide={firstActiveIndex}
                                >
                                    {people.map((p, idx) => (
                                        <SwiperSlide
                                            key={p.IDNUM || idx}
                                            className="flex items-center justify-center w-full h-full"
                                        >
                                            <PersonCard person={p} imageBaseUrl={BACKEND_IMAGE_URL} onOpenForm={() => {}} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>

                        <div className="flex w-full h-full z-10 relative pointer-events-auto">
                            {currentPerson && currentThing?.val && (
                                <Swiper
                                    key={secondActiveIndex}
                                    direction="vertical"
                                    slidesPerView={1}
                                    onSlideChange={handleContentTypeSlideChange}
                                    allowTouchMove={true}
                                    className="w-full overflow-y-scroll scrollbar-thin scrollbar-thumb-pink-600 scrollbar-track-transparent"
                                    initialSlide={secondActiveIndex}
                                >
                                    {(currentThings ?? []).map((T: any, TDX: any) => (
                                        <SwiperSlide
                                            key={T.val || TDX}
                                            className="flex items-center justify-center w-full"
                                        >
                                            <ContentTypeCard
                                                person={currentPerson}
                                                contentType={T.val}
                                                categoryImageBaseUrl={BACKEND_IMAGE_CATAGORY_PATH}
                                            />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            )}
                        </div>
                    </div>
                </Panel>

                <PanelResizeHandle
                    className="h-1 w-full cursor-row-resize bg-transparent hover:bg-white/20 active:bg-white/30 transition-colors"
                />

                <Panel>
                    <div className="flex-col w-full h-full overflow-y-auto flex-1 z-10 relative pointer-events-auto">
                        {hasChildItems ? (
                            <div className="cursor-pointer w-full h-full">
                                <PersonCardDetails
                                    person={currentPerson}
                                    width="w-full"
                                    THING={(currentThing as any).val}
                                    childItems={currentChildItems!}
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
                                        IMAGETH: `${BACKEND_IMAGE_URL}/CULTURE.jpg`,
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
}