import React, { useMemo, useState, useRef } from 'react'
import { MusicPlayer } from './MusicPlayer'
import TransparentDrawer from './TransparentDrawer'
import { backendFetch } from '@/lib/backend'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Notepad } from './Notepad'

type MusicCardProps = {
  person: any
  childItems: any[]
}

function resolveAudioUrl(item: any) {
  if (typeof item.url === 'string' && item.url.trim()) return item.url
  if (item.audio) {
    try {
      const parsed = typeof item.audio === 'string' ? JSON.parse(item.audio) : item.audio
      if (parsed?.url) return parsed.url
    } catch {
      // ignore
    }
  }
  return item.path || item.file || ''
}

function resolveTitle(item: any) {
  return item.title || item.name || item.label || 'Untitled track'
}

export function MusicCard({ person, childItems }: MusicCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const musicPlayerRef = useRef<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<any>(null)

  const audioFiles = useMemo(() => {
    return childItems
      .flatMap((child) => Array.isArray(child.data) ? child.data : [])
      .filter((item: any) => item?.type === 'audio' || Boolean(resolveAudioUrl(item)))
      .map((item: any, index: number) => ({
        id: item.id ?? item._id ?? `music-${index}`,
        url: resolveAudioUrl(item),
        title: resolveTitle(item),
        thumbnailUrl: item.thumbnailUrl || item.image?.url || '/default-music.jpeg',
      }))
      .filter((item) => item.url)
  }, [childItems])

  const noteItems = useMemo(() => {
    return childItems
      .flatMap((child) => Array.isArray(child.data) ? child.data : [])
      .filter((item: any) => item?.type === 'note')
      .map((n: any) => ({
        id: n.id ?? n._id ?? `${n.type}-${Math.random()}`,
        title: n.title || n.name || 'Note',
        description: n.description || '',
        lat: Number(n.lat) || 0,
        lng: Number(n.lng) || 0,
        createdAt: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
        remind: !!n.remind,
        audio: n.audio ?? null,
        image: n.image ?? null,
        files: n.files ?? [],
      }))
  }, [childItems])

  async function handleUpload(
    formData: FormData,
    personId: string,
    mediaType: string
  ) {
    try {
      const endpoint = "media";
      const normalizedMediaType = mediaType.toLowerCase() as 'audio';

      const res = await backendFetch(`/api/persons/${endpoint}/${personId}`, {
        method: "POST",
        headers: {
          "x-category": "MUSIC",
          "x-mediatype": normalizedMediaType,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      return data[normalizedMediaType];
    } catch (err) {
      console.error(`Upload error (audio):`, err);
      throw err;
    }
  }

  const emptyState = (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded-xl bg-black/70 text-white p-6">
      <div className="text-center space-y-3">
        <p className="text-lg font-semibold">🎵 No music yet</p>
        <p className="text-sm text-white/70">Upload your favorite tracks to build your music library.</p>
      </div>
      <button
        onClick={() => setDrawerOpen(true)}
        className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-medium transition-colors"
      >
        + Add Audio
      </button>
    </div>
  )

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden bg-black/80">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={(s) => setActiveIndex(s.activeIndex)}
        onSwiper={(s) => (swiperRef.current = s)}
        className="h-full w-full"
      >
        <SwiperSlide className="h-full w-full flex items-center justify-center">
          <div className="relative h-full w-full">
            {audioFiles.length === 0 ? (
              emptyState
            ) : (
              <>
                <MusicPlayer ref={musicPlayerRef} audioFiles={audioFiles} />
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="absolute bottom-6 right-6 z-20 w-12 h-12 rounded-full bg-pink-500/80 hover:bg-pink-600 text-white flex items-center justify-center text-xl shadow-lg transition-all"
                  title="Add audio"
                >
                  +
                </button>
              </>
            )}
          </div>
        </SwiperSlide>

        <SwiperSlide className="h-full w-full">
          <div className="h-full w-full">
            <Notepad person={person} initialNotes={noteItems} />
          </div>
        </SwiperSlide>
      </Swiper>

      <TransparentDrawer
        person={person}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type="audio"
        onSubmit={async (formData, mediaType) => {
          const uploadedItem = await handleUpload(
            formData,
            person._id,
            mediaType
          );
          if (uploadedItem) {
            let musicThing = person.THINGS.find((t: any) => t.val === 'MUSIC');
            if (!musicThing) {
              musicThing = {
                key: person.THINGS.length,
                val: 'MUSIC',
                childItems: [{ key: 0, val: 'Tracks', data: [] }],
              };
              person.THINGS.push(musicThing);
            }
            let musicChild = musicThing.childItems?.find((c: any) => c.val === 'Tracks');
            if (!musicChild) {
              musicChild = { key: musicThing.childItems.length, val: 'Tracks', data: [] };
              musicThing.childItems.push(musicChild);
            }
            musicChild.data.push(uploadedItem);
          }
        }}
      />
      {/* Pager buttons for Music <-> Notes */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => swiperRef.current?.slideTo(i)}
            aria-label={i === 0 ? 'Music' : 'Notes'}
            className={`w-3 h-3 rounded-full transition-all ${activeIndex === i ? 'bg-pink-400 scale-110' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}
