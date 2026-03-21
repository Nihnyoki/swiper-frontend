import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TransparentDrawer from "./TransparentDrawer";
import { MusicPlayer } from "./MusicPlayer";
import type { MusicPlayerHandle } from "./MusicPlayer";
import { Notepad } from "./Notepad";
import { backendFetch } from "../../lib/backend";
import { supabase } from "../../services/supabaseClient"; // Ensure Supabase client is imported


type PersonalCardProps = {
    person: any;
    childItems: any[];
};

type SlideItem =
    | { kind: "audio"; id: string }
    | { kind: "notes"; id: string }
    | { kind: "media"; id: string; mediaType: "video" | "image" | "pdf"; title?: string; url: string };

function MiniMusicFooter({
    pinned,
    currentTrack,
    isPlaying,
    onTogglePlay,
    onNext,
    onTogglePinned,
}: {
    pinned: boolean;
    currentTrack: { index: number; title: string } | null;
    isPlaying: boolean;
    onTogglePlay: () => void;
    onNext: () => void;
    onTogglePinned: () => void;
}) {
    if (!pinned) {
        return (
            <div className="flex justify-between items-center px-4 py-2 bg-black/40">
                <label className="flex items-center gap-2 text-xs text-white">
                    <input type="checkbox" checked={false} onChange={onTogglePinned} />
                    Pin music
                </label>
                <span className="text-sm text-pink-300">✨ Nice ✨</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-black/70 backdrop-blur-md">
            <label className="flex items-center gap-1 text-xs text-white">
                <input type="checkbox" checked={true} onChange={onTogglePinned} />
                Pinned
            </label>

            <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">🎵 {currentTrack?.title ?? "No track playing"}</p>
            </div>

            <button onClick={onTogglePlay} className="w-5 h-5  text-white">
                {isPlaying ? "⏸" : "▶"}
            </button>

            <button onClick={onNext} className="w-5 h-5  text-white">
                ⏭
            </button>
        </div>
    );
}

export function PersonalCard({ person, childItems }: PersonalCardProps) {
    const [activeTab, setActiveTab] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const videoRefs = useRef<HTMLVideoElement[]>([]);
    const audioRefs = useRef<HTMLAudioElement[]>([]);
    const [showControls, setShowControls] = useState(true);
    const controlTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [volume, setVolume] = useState(0.7);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [musicPinned, setMusicPinned] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<{
        index: number;
        title: string;
    } | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const musicPlayerRef = useRef<MusicPlayerHandle | null>(null);

    const [mapBeingDragged, setMapBeingDragged] = useState(false);

    const handleUserActivity = useCallback(() => {
        setShowControls(true);
        if (controlTimeout.current) clearTimeout(controlTimeout.current);
        controlTimeout.current = setTimeout(() => setShowControls(false), 2000);
    }, []);

    useEffect(() => {
        return () => {
            if (controlTimeout.current) clearTimeout(controlTimeout.current);
        };
    }, []);

    const togglePlayPause = useCallback((slide: SlideItem, slideIndex: number) => {
        if (slide.kind === "media" && slide.mediaType === "video") {
            const video = videoRefs.current[slideIndex];
            if (!video) return;
            if (video.paused) video.play(); else video.pause();
        }
        if (slide.kind === "audio") {
            const audio = audioRefs.current[slideIndex];
            if (!audio) return;
            if (audio.paused) audio.play(); else audio.pause();
        }
    }, []);

    const allItems = useMemo(() => childItems?.[activeTab]?.data ?? [], [childItems, activeTab]);
    const audioItems = useMemo(() => allItems.filter((i: any) => i.type === "audio"), [allItems]);
    const nonAudioItems = useMemo(
        () => allItems.filter((i: any) => i.type !== "audio" && i.type !== "note"),
        [allItems]
    );
    const noteItems = useMemo(() => allItems.filter((i: any) => i.type === "note"), [allItems]);

    const slides: SlideItem[] = useMemo(() => {
        const built: SlideItem[] = [];
        if (audioItems.length > 0) built.push({ kind: "audio", id: "audio-slide" });
        built.push({ kind: "notes", id: "notes-slide" });
        for (const item of nonAudioItems) {
            if (item.type === "video" || item.type === "image" || item.type === "pdf") {
                built.push({
                    kind: "media",
                    id: item.id ?? item._id ?? item.url ?? `${item.type}-${Math.random()}`,
                    mediaType: item.type,
                    title: item.title,
                    url: item.url,
                });
            }
        }
        return built;
    }, [audioItems.length, nonAudioItems]);

    useEffect(() => {
        // Keep refs aligned with slides (avoid stale entries)
        videoRefs.current = videoRefs.current.slice(0, slides.length);
        audioRefs.current = audioRefs.current.slice(0, slides.length);
    }, [slides.length]);

    useEffect(() => {
        const activeSlide = slides[activeIndex];

        videoRefs.current.forEach((video, idx) => {
            if (!video) return;
            video.volume = volume;

            const shouldPlay =
                activeSlide?.kind === "media" && activeSlide.mediaType === "video" && idx === activeIndex;

            if (shouldPlay) {
                video.play().catch(() => {
                    console.warn(`Video at index ${idx} could not autoplay`);
                });
            } else {
                video.pause();
            }
        });
    }, [activeIndex, slides, volume]);


    async function handleUpload(
        formData: FormData,
        personId: string,
        category: string,
        mediaType: string
    ) {
        try {
            const endpoint = "media";
            const normalizedMediaType = mediaType.toLowerCase() as
                | 'video'
                | 'image'
                | 'audio'
                | 'pdf';

            const res = await backendFetch(`/api/persons/${endpoint}/${personId}`, {
                method: "POST",
                headers: {
                    "x-category": category,
                    "x-mediatype": normalizedMediaType,
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            return data[normalizedMediaType];
        } catch (err) {
            console.error(`Upload error (${mediaType}):`, err);
            throw err;
        }
    }

    const stopAllMedia = useCallback(() => {
        videoRefs.current.forEach((v) => v?.pause());
        audioRefs.current.forEach((a) => a?.pause());
    }, []);

    const playActiveMedia = useCallback(
        (slideIndex: number) => {
            const slide = slides[slideIndex];
            if (!slide) return;

            if (slide.kind === "media" && slide.mediaType === "video") {
                const video = videoRefs.current[slideIndex];
                if (video) {
                    video.volume = volume;
                    video.play().catch(() => {});
                }
            }

            if (slide.kind === "audio") {
                const audio = audioRefs.current[slideIndex];
                if (audio) {
                    audio.volume = volume;
                    audio.play().catch(() => {});
                }
            }
        },
        [slides, volume]
    );

    useEffect(() => {
        // When switching tabs, reset to the first slide and stop any media.
        stopAllMedia();
        setActiveIndex(0);
    }, [activeTab, stopAllMedia]);

    const handleDeleteMedia = async (mediaToDelete: { name: string }, personId: string) => {
        try {
            // Remove from Supabase
            const { error: supabaseError } = await supabase.storage
                .from("media")
                .remove([mediaToDelete.name]);

            if (supabaseError) {
                console.error("Failed to delete media from Supabase:", supabaseError);
                alert("Failed to delete media from storage.");
                return;
            }

            // Remove from MongoDB
            const response = await backendFetch(`/api/persons/delete-media/${personId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mediaName: mediaToDelete.name }),
            });

            if (!response.ok) {
                console.error("Failed to delete media from MongoDB:", await response.text());
                alert("Failed to delete media from database.");
                return;
            }

            alert("Media deleted successfully.");
        } catch (error) {
            console.error("Error deleting media:", error);
            alert("An error occurred while deleting the media.");
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
                        allowTouchMove={!mapBeingDragged}
                        touchStartPreventDefault={true}
                        onSlideChange={(swiper) => {
                            if (!musicPinned) {
                                stopAllMedia();
                                playActiveMedia(swiper.activeIndex);
                            }
                            setActiveIndex(swiper.activeIndex);

                            //stopAllMedia();   
                            //setActiveIndex(swiper.activeIndex);
                            //playActiveMedia(swiper.activeIndex); // 2️⃣ autoplay new media
                        }}
                    >
                        {slides.map((item, index) => (
                            <SwiperSlide
                                key={item.id}
                                className="relative flex h-full w-full items-center justify-center"
                            >
                                {/* VIDEO */}
                                {item.kind === "media" && item.mediaType === "video" && (
                                    <div className="relative w-full h-full">
                                        <video
                                            ref={(el) => {
                                                videoRefs.current[index] = el!;
                                            }}
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

                                                {/* Delete button */}
                                                <button
                                                    onClick={() => {
                                                        if (slides[activeIndex]?.kind === "media") {
                                                            const activeMedia = slides[activeIndex];
                                                            if (activeMedia.mediaType === "video" || activeMedia.mediaType === "image" || activeMedia.mediaType === "pdf") {
                                                                const confirmDelete = confirm(`Are you sure you want to delete this ${activeMedia.mediaType}?`);
                                                                if (confirmDelete) {
                                                                    const mediaName = activeMedia.url.split("/").pop() || ""; // Ensure mediaName is always a string
                                                                    handleDeleteMedia({ name: mediaName }, person._id);
                                                                }
                                                            }
                                                        }
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-white bg-white/20 border border-white/10 border-white/10 rounded-full text-xl"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* AUDIO */}
                                {item.kind === "audio" && (
                                    <div className="w-full h-full flex justify-center items-start">
                                        <MusicPlayer
                                            ref={musicPlayerRef}
                                            audioFiles={audioItems}
                                            stopAllSignal={!musicPinned && activeIndex !== index}
                                            onTrackChange={setCurrentTrack}
                                            onPlayStateChange={setIsPlaying}
                                        />
                                    </div>
                                )}

                                {/* IMAGE */}
                                {item.kind === "media" && item.mediaType === "image" && (
                                    <img
                                        src={item.url}
                                        alt={item.title}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                )}

                                {/* PDF */}
                                {item.kind === "media" && item.mediaType === "pdf" && (
                                    <iframe
                                        src={item.url}
                                        title={item.title}
                                        className="w-full h-full rounded-xl"
                                    />
                                )}

                                {item.kind === "notes" && (
                                    <div className="w-full h-full">
                                        <Notepad
                                            onMapDrag={setMapBeingDragged}
                                            person={person}
                                            initialNotes={noteItems.map((n: any) => ({
                                                ...n,
                                                lat: Number(n.lat),
                                                lng: Number(n.lng),
                                            }))}
                                        />
                                    </div>
                                )}

                                {/* Foreground text */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 text-center">
                                    <p className="text-sm text-pink-100">
                                        {item.kind === "media" ? item.title : ""}
                                    </p>
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
            <MiniMusicFooter
                pinned={musicPinned}
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                onTogglePinned={() => setMusicPinned(p => !p)}

                onTogglePlay={() => {
                    musicPlayerRef.current?.togglePlay();
                }}

                onNext={() => {
                    musicPlayerRef.current?.next();
                }}
            />

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
                        const personalThing = person.THINGS.find((t: any) => t.val === "PERSONAL");
                        const personalThings =
                            personalThing?.childItems?.find((c: any) => c.val === "Things");
                        personalThings?.data.push(uploadedItem);
                        // setPerson({ ...person });
                    }
                }}
            />
        </div>
    );
}
