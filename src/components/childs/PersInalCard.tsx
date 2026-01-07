import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import TransparentDrawer from "./TransparentDrawer";
import { MusicPlayer } from "./MusicPlayer";
import type { MusicPlayerHandle } from "./MusicPlayer";
import { Notepad } from "./Notepad";

import { useMediaPlayback } from "../../features/media/hooks/useMediaPlayback";

export function PersonalCard({ person, childItems }) {
  const [activeTab, setActiveTab] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mapBeingDragged, setMapBeingDragged] = useState(false);

  const swiperRef = useRef<any>(null);
  const musicPlayerRef = useRef<MusicPlayerHandle | null>(null);

  const playback = useMediaPlayback();

  const allItems = childItems[activeTab]?.data ?? [];
  const audioItems = allItems.filter(i => i.type === "audio");
  const nonAudioItems = allItems.filter(
    i => i.type !== "audio" && i.type !== "note"
  );

  const slides = [
    ...(audioItems.length
      ? [{ type: "audio", id: "audio-slide" }]
      : []),
    { type: "notes", id: "notes-slide" },
    ...nonAudioItems,
  ];

  async function handleUpload(
    formData: FormData,
    personId: string,
    category: string,
    mediaType: string
  ) {
    const BASE = import.meta.env.VITE_BACKEND_BASE_URL;
    const res = await fetch(
      `${BASE}/api/persons/media/${personId}`,
      {
        method: "POST",
        headers: {
          "x-category": category,
          "x-mediatype": mediaType.toLowerCase(),
        },
        body: formData,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data[mediaType.toLowerCase()];
  }

  return (
    <div className="relative flex w-full h-full flex-col bg-gradient-to-tr from-black/80 to-gray-400 text-white rounded-xl">
      {/* MAIN */}
      <div className="flex-grow overflow-hidden relative">
        {slides.length ? (
          <Swiper
            className="h-full"
            onSwiper={s => (swiperRef.current = s)}
            onSlideChange={s => setActiveIndex(s.activeIndex)}
            allowTouchMove={!mapBeingDragged}
          >
            {slides.map((item, index) => (
              <SwiperSlide key={item.id} className="relative">
                {/* VIDEO */}
                {item.type === "video" && (
                  <video
                    ref={el =>
                      playback.register(item.id, el)
                    }
                    src={item.url}
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    onClick={() =>
                      playback.play({
                        id: item.id,
                        kind: "video",
                        src: item.url,
                        title: item.title,
                      })
                    }
                  />
                )}

                {/* AUDIO */}
                {item.type === "audio" && (
                  <MusicPlayer
                    ref={musicPlayerRef}
                    audioFiles={audioItems}
                    onTrackChange={() => {}}
                    onPlayStateChange={() => {}}
                  />
                )}

                {/* IMAGE */}
                {item.type === "image" && (
                  <img
                    src={item.url}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}

                {/* PDF */}
                {item.type === "pdf" && (
                  <iframe
                    src={item.url}
                    className="w-full h-full rounded-xl"
                  />
                )}

                {/* NOTES */}
                {item.type === "notes" && (
                  <Notepad
                    onMapDrag={setMapBeingDragged}
                    person={person}
                    initialNotes={allItems
                      .filter(i => i.type === "note")
                      .map(n => ({
                        ...n,
                        lat: Number(n.lat),
                        lng: Number(n.lng),
                      }))}
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center italic text-gray-400">
            No personal content available
          </div>
        )}
      </div>

      {/* FOOTER */}
      {playback.activeSource && (
        <div className="flex items-center gap-3 px-4 py-2 bg-black/70">
          <span className="truncate text-sm">
            🎵 {playback.activeSource.title ?? "Now playing"}
          </span>

          <button onClick={playback.pause}>⏸</button>
          <button onClick={playback.play}>▶</button>

          <label className="ml-auto text-xs flex gap-1">
            <input
              type="checkbox"
              checked={playback.pinned}
              onChange={
                playback.pinned
                  ? playback.unpin
                  : playback.pin
              }
            />
            Pin
          </label>
        </div>
      )}

      {/* UPLOAD */}
      <TransparentDrawer
        person={person}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        type="video"
        onSubmit={async (formData, mediaType) => {
          await handleUpload(
            formData,
            person._id,
            "PERSONAL",
            mediaType
          );
        }}
      />
    </div>
  );
}
