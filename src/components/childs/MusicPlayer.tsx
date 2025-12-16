import React, { useRef, useState, useEffect } from "react";

interface AudioFile {
    id: string;
    url: string;
    title: string;
    thumbnailUrl?: string;
}

interface MusicPlayerProps {
    audioFiles: AudioFile[];
    defaultThumbnail?: string;
    stopAllSignal?: boolean;
}

const formatTime = (seconds = 0) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

export function MusicPlayer({
    audioFiles,
    defaultThumbnail = "/default-music.jpeg",
    stopAllSignal = false,
}: MusicPlayerProps) {
    const audioRefs = useRef<HTMLAudioElement[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [volume, setVolume] = useState(0.7);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    /** Play a specific track */
    const playTrack = (index: number) => {
        audioRefs.current.forEach((audio, i) => {
            if (!audio) return;

            audio.pause();
            audio.currentTime = 0;

            if (i === index) {
                audio.volume = volume;
                audio.play().catch(() => { });
            }
        });

        setActiveIndex(index);
    };

    const togglePlay = (index: number) => {
        const audio = audioRefs.current[index];
        if (!audio) return;

        if (audio.paused) {
            playTrack(index);
        } else {
            audio.pause();
            setActiveIndex(null);
        }
    };

    /** Auto-play next track */
    const playNext = () => {
        if (activeIndex === null) return;
        const next = activeIndex + 1;
        if (next < audioFiles.length) playTrack(next);
        else setActiveIndex(null);
    };

    /** Stop playback when slide changes */
    useEffect(() => {
        if (stopAllSignal) {
            audioRefs.current.forEach((a) => a?.pause());
            setActiveIndex(null);
        }
    }, [stopAllSignal]);

    /** Sync volume */
    useEffect(() => {
        audioRefs.current.forEach((a) => {
            if (a) a.volume = volume;
        });
    }, [volume]);

    useEffect(() => {
        if (!stopAllSignal && audioRefs.current[0]) {
            audioRefs.current[0].play().catch(() => { });
            setActiveIndex(0);
        }
    }, [stopAllSignal]);
    
    /** Bind progress listeners to active audio */
    useEffect(() => {
        if (activeIndex === null) return;

        const audio = audioRefs.current[activeIndex];
        if (!audio) return;

        const update = () => {
            setCurrentTime(audio.currentTime);
            setDuration(audio.duration || 0);
        };

        audio.addEventListener("timeupdate", update);
        audio.addEventListener("loadedmetadata", update);
        audio.addEventListener("ended", playNext);

        return () => {
            audio.removeEventListener("timeupdate", update);
            audio.removeEventListener("loadedmetadata", update);
            audio.removeEventListener("ended", playNext);
        };
    }, [activeIndex]);

    /** Seek via shared progress bar */
    const seek = (value: number) => {
        if (activeIndex === null) return;
        const audio = audioRefs.current[activeIndex];
        if (audio) audio.currentTime = value;
    };

    const thumbnail = audioFiles[activeIndex ?? 0]?.thumbnailUrl || defaultThumbnail;

    
    
    return (
        <div className="relative flex flex-col w-full h-full bg-black/80 rounded-xl overflow-hidden">

            {/* 🎨 Thumbnail */}
            <div className="relative h-1/3 w-full">
                <img
                    src={thumbnail}
                    alt="Audio Thumbnail"
                    className="w-full h-full object-cover"
                />

                {/* 🎚 Shared Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 px-4 pb-2">
                    <input
                        type="range"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={currentTime}
                        onChange={(e) => seek(Number(e.target.value))}
                        className="w-full accent-pink-400"
                    />

                    <div className="flex justify-between text-[10px] text-white/70 mt-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            {/* 🎵 Audio List */}
            <div className="h-2/3 overflow-y-auto px-2 py-1">
                {audioFiles.map((file, index) => (
                    <div
                        key={file.id}
                        onClick={() => togglePlay(index)}
                        className={`
                            group flex items-center gap-3 p-2 rounded-md cursor-pointer
                            transition-all
                            ${activeIndex === index
                                ? "bg-pink-600/40 border border-pink-400"
                                : "bg-black/30 hover:bg-white/10"}
                        `}
                    >
                        <audio
                            ref={(el) => (audioRefs.current[index] = el!)}
                            src={file.url}
                        />

                        <p className="flex-1 min-w-0 text-white text-sm truncate">
                            {file.title}
                        </p>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePlay(index);
                            }}
                            className="w-8 h-8 rounded-full bg-pink-500/80 text-white flex items-center justify-center"
                        >
                            {activeIndex === index ? "⏸" : "▶"}
                        </button>
                    </div>
                ))}
            </div>

            {/* 🔊 Floating Volume */}
            <div className="absolute bottom-4 right-4 bg-white/40 backdrop-blur-md px-3 py-2 rounded-xl flex items-center gap-2">
                <span className="text-white text-xs">🔊</span>
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-24 accent-pink-400"
                />
            </div>
        </div>
    );
}
