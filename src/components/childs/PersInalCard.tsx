import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TransparentDrawer from "./TransparentDrawer";
import { MusicPlayer } from "./MusicPlayer";

export function PersonalCard({ person, childItems }) {
    const [activeTab, setActiveTab] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const audioRefs = useRef<HTMLAudioElement[]>([]);
    const [showControls, setShowControls] = useState(true);
    const controlTimeout = useRef<NodeJS.Timeout | null>(null);

    const [volume, setVolume] = useState(0.7);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [activeItem, setActiveItem] = useState<any | null>(null);

    const [musicPinned, setMusicPinned] = useState(false);


    const handleUserActivity = () => {
        setShowControls(true);
        if (controlTimeout.current) clearTimeout(controlTimeout.current);
        controlTimeout.current = setTimeout(() => setShowControls(false), 2000);
    };

    const togglePlayPause = (item: any, index: number) => {
        if (item.type === "video") {
            const video = videoRefs.current[index];
            if (!video) return;
            if (video.paused) video.play(); else video.pause();
        }
        if (item.type === "audio") {
            const audio = audioRefs.current[index];
            if (!audio) return;
            if (audio.paused) audio.play(); else audio.pause();
        }
    };

    useEffect(() => {
        // Loop through all videos
        videoRefs.current.forEach((video, idx) => {
            if (!video) return;

            video.volume = volume;

            if (idx === activeIndex) {
                video.play().catch(() => {
                    console.warn(`Video at index ${idx} could not autoplay`);
                });
            } else {
                video.pause();
            }
        });
    }, [activeIndex, volume]);


    async function handleUpload(
        formData: FormData,
        personId: string,
        category: string,
        mediaType: string
    ) {
        try {
            const VITE_CORE_PATH = "http://localhost:3000";
            const endpoint = "media";
            const normalizedMediaType = mediaType.toLowerCase() as
                | 'video'
                | 'image'
                | 'audio'
                | 'pdf';

            const res = await fetch(
                `${VITE_CORE_PATH}/api/persons/${endpoint}/${personId}`,
                {
                    method: "POST",
                    headers: {
                        "x-category": category,
                        "x-mediatype": normalizedMediaType,
                    },
                    body: formData,
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            return data[normalizedMediaType];
        } catch (err) {
            console.error(`Upload error (${mediaType}):`, err);
            throw err;
        }
    }

    const allItems = childItems[activeTab]?.data ?? [];

    const audioItems = allItems.filter((i) => i.type === "audio");
    const nonAudioItems = allItems.filter((i) => i.type !== "audio");

    const slides = [
        ...(audioItems.length > 0
            ? [
                {
                    type: "audio",
                    id: "audio-slide",
                },
            ]
            : []),
        ...nonAudioItems,
    ];

    
    const stopAllMedia = () => {
        videoRefs.current.forEach((v) => v?.pause());
        audioRefs.current.forEach((a) => a?.pause());
    };

    const playActiveMedia = (index: number) => {
        const item = childItems[activeTab]?.data?.[index];
        if (!item) return;

        if (item.type === "video") {
            const video = videoRefs.current[index];
            if (video) {
                video.volume = volume;
                video.play().catch(() => { });
            }
        }

        if (item.type === "audio") {
            const audio = audioRefs.current[index];
            if (audio) {
                audio.volume = volume;
                audio.play().catch(() => { });
            }
        }
    };

    return (
        <div className="relative flex-col w-full h-full overflow-y-auto rounded-xl shadow-1xl flex bg-gradient-to-tr from-black/80 to-gray-400 text-white">
            {/* MAIN CONTENT */}
            <div
                className="flex-grow flex-col overflow-hidden  relative"
                onMouseMove={handleUserActivity}
                onTouchStart={handleUserActivity}
            >
                {childItems?.length > 0 && childItems[activeTab]?.data?.length > 0 ? (
                    <Swiper
                        spaceBetween={1}
                        slidesPerView={1}
                        className="flex flex-grow h-full"
                        onSlideChange={(swiper) => {
                            stopAllMedia();   
                            setActiveIndex(swiper.activeIndex);
                            playActiveMedia(swiper.activeIndex); // 2️⃣ autoplay new media
                        }}
                    >
                        {slides.map((item, index) => (
                            <SwiperSlide
                                key={item.id}
                                className="relative flex h-full w-full items-center justify-center"
                            >
                                {/* VIDEO */}
                                {item.type === "video" && (
                                    <div className="relative w-full h-full">
                                        <video
                                            ref={(el) => (videoRefs.current[index] = el!)}
                                            src={item.url}
                                            playsInline
                                            className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                                            onMouseMove={handleUserActivity}
                                            onTouchStart={handleUserActivity}
                                        />

                                        {showControls && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-2 bg-black/30 backdrop-blur-md rounded-xl z-30 flex items-center space-x-3">
                                                {/* Play / Pause */}
                                                <button
                                                    onClick={() => togglePlayPause(item, index)}
                                                    className="w-8 h-8 flex items-center justify-center text-white bg-pink-500/80 rounded-full text-sm"
                                                >
                                                    {videoRefs.current[index]?.paused ? "⏸" : "▶"}
                                                </button>

                                                {/* Volume */}
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={1}
                                                    step={0.05}
                                                    value={volume}
                                                    onChange={(e) => setVolume(Number(e.target.value))}
                                                    className="w-20 accent-pink-400"
                                                />

                                                {/* Add button */}
                                                <button
                                                    onClick={() => setDrawerOpen(true)}
                                                    className="w-8 h-8 flex items-center justify-center text-white bg-white/20 border border-white/10 rounded-full text-xl"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}



                                {/* AUDIO */}
                                {item.type === "audio" && (
                                    <div className="w-full h-full flex justify-center items-start">
                                        <MusicPlayer
                                            audioFiles={childItems[activeTab].data.filter((i) => i.type === "audio")}
                                            stopAllSignal={activeIndex !== index} // stop if not active
                                        />
                                    </div>
                                )}



                                {/* IMAGE */}
                                {item.type === "image" && (
                                    <img
                                        src={item.url}
                                        alt={item.title}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                )}

                                {/* PDF */}
                                {item.type === "pdf" && (
                                    <iframe
                                        src={item.url}
                                        title={item.title}
                                        className="w-full h-full rounded-xl"
                                    />
                                )}

                                {/* Foreground text */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-center">
                                    <p className="text-sm text-pink-100">{item?.title}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="italic text-gray-500 text-center">
                        No personal content available.
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end px-4 py-2 bg-pink-10 text-sm text-pink-300 font-medium z-10">
                <span>✨</span>
                <span>{person?.VIBE || "✨ Nice ✨"}</span>
            </div>


            {/* UPLOAD DRAWER */}
            <TransparentDrawer
                person={person}
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                type="video"
                onSubmit={async (formData, mediaType) => {
                    const uploadedItem = await handleUpload(
                        formData,
                        person._id,
                        "PERSONAL",
                        mediaType
                    );
                    if (uploadedItem) {
                        const personalThing = person.THINGS.find((t) => t.val === "PERSONAL");
                        const personalThings =
                            personalThing?.childItems?.find((c) => c.val === "Things");
                        personalThings?.data.push(uploadedItem);
                        // setPerson({ ...person });
                    }
                }}
            />
        </div>
    );
}
