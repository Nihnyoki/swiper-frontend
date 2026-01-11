"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { backendUrl } from "../../lib/backend";

const VITE_IMAGE_CORE_PATH = backendUrl("/IMAGETHS");

interface PersonalCardProps {
    person: any;
    onAddChildItem?: (video: File) => void;
}

export function PersonalCardPinkPlus({ person, onAddChildItem }: PersonalCardProps) {
    const [peelOpen, setPeelOpen] = useState(false);
    const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

    const imageAddress = person?.IMAGETH
        ? person.IMAGETH.startsWith("/IMAGETHS")
            ? `${VITE_IMAGE_CORE_PATH}${person.IMAGETH.replace("/IMAGETHS", "")}`
            : `${VITE_IMAGE_CORE_PATH}/${person.IMAGETH.split("/").pop()}`
        : null;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedVideos([...selectedVideos, ...Array.from(e.target.files)]);
        }
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-800">
            {/* Video Grid Underneath */}
            <div className="absolute inset-0 grid grid-cols-2 gap-2 p-4 z-0 bg-gray-900 overflow-y-auto">
                {selectedVideos.length > 0 ? (
                    selectedVideos.map((video, idx) => (
                        <div
                            key={idx}
                            className="relative cursor-pointer rounded overflow-hidden border border-gray-600 hover:border-pink-400"
                            onClick={() => onAddChildItem?.(video)}
                        >
                            <video
                                src={URL.createObjectURL(video)}
                                className="w-full h-40 object-cover"
                                controls
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                                {video.name}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center text-gray-500 italic mt-10">
                        No videos selected. Click the + to add videos.
                    </div>
                )}
            </div>

            {/* Full-Screen Card */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-black/90 to-gray-700 text-white shadow-2xl overflow-hidden z-10"
                initial={{ rotateX: 0 }}
                animate={{ rotateX: peelOpen ? -75 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{
                    transformOrigin: "left bottom",
                    perspective: 1200,
                }}
            >
                {/* Card Content */}
                <div className="p-6 flex flex-col gap-4 h-full">
                    <h1 className="text-2xl font-bold">{person.name || "Unnamed"}</h1>
                    {imageAddress && (
                        <img
                            src={imageAddress}
                            alt={person.name}
                            className="w-full h-80 object-cover rounded-lg shadow-lg"
                        />
                    )}
                    <p className="text-gray-300 flex-grow">
                        {person.description || "No description available"}
                    </p>
                </div>

                {/* Plus Button on bottom-right */}
                <label
                    className="absolute bottom-6 right-6 z-20 bg-pink-400 text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                    <Plus className="w-8 h-8" />
                    <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={handleFileSelect}
                    />
                    {/* Open peel on first click */}
                    {!peelOpen && (
                        <div
                            className="absolute inset-0"
                            onClick={() => setPeelOpen(true)}
                        />
                    )}
                </label>
            </motion.div>
        </div>
    );
}
