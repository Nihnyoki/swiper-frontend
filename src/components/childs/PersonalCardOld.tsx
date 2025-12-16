import React, { useState } from "react";
import 'swiper/css'

const VITE_IMAGE_CORE_PATH = "http://localhost:3000/IMAGETHS";

interface PersonalCardProps {
    person: any;
    width?: string;
    height?: string;
    childItems?: any[];
}

export function PersonalCard({
    person,
    width = "w-[250px]",
    height = "h-[320px]",
    childItems: any
}: PersonalCardProps) {
  const isPlaceholder = person?.isPlaceholder;
  const [activeTab, setActiveTab] = useState("Friends")
    const personalTiles = ["Selfish", "Dreams", "Healths", "Feeliths", "Brainmaths"];

  const imageAddress = person?.IMAGETH
    ? person.IMAGETH.startsWith('/IMAGETHS')
      ? `${VITE_IMAGE_CORE_PATH}${person.IMAGETH.replace('/IMAGETHS', '')}`
      : `${VITE_IMAGE_CORE_PATH}/${person.IMAGETH.split('/').pop()}`
    : null;

    return (
        <div
            className={`relative ${width} ${height} rounded-xl overflow-hidden shadow-1xl flex flex-col bg-black/80 text-white font-[cursive]`}
        >

            {/* Header */}
            <div className="relative flex items-center p-3 z-10">
                {/* Left side: image + nickname */}
                <div className="flex items-center gap-3">
                    {imageAddress && (
                        <img
                            src={imageAddress}
                            alt={person?.NAME || "Person IMAGETH"}
                            className="w-12 h-12 rounded-full object-cover border border-white"
                        />
                    )}
                    <div className="text-l font-bold tracking-wide">NickName</div>
                </div>

                {/* Short border (30%) */}
                <div className="absolute bottom-0 left-0 w-[39%] border-b border-gray-400/40"></div>

                {/* Heart on top of the border */}
                <span className="absolute right-65 -bottom-3 text-2xl leading-none">
                    💖
                </span>
            </div>



            {/* Content */}
            <div className="flex-grow p-4 overflow-y-auto z-10 text-base leading-relaxed">
                {activeTab === "Bio" && (
                    <div className="italic text-rose-400">📜 {person?.BIO || "No bio written yet..."}</div>
                )}
                {activeTab === "Feelings" && (
                    <div className="italic text-pink-300">💭 {person?.FEELINGS?.join(", ") || "Feelings hidden..."}</div>
                )}
                {activeTab === "Health" && (
                    <div className="italic text-red-300">💊 {person?.HEALTH?.join(", ") || "Health unknown"}</div>
                )}
                {activeTab === "Habits" && (
                    <div className="italic text-purple-300">☕ {person?.HABITS?.join(", ") || "No habits shared"}</div>
                )}
                {activeTab === "Dreams" && (
                    <div className="italic text-amber-300">🌙 {person?.DREAMS?.join(", ") || "Dreams not shared"}</div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end px-4 py-2 bg-stone-900 text-sm text-gray-300 font-medium z-10">
                <span>✨</span>
                <span>{person?.VIBE || "✨ Nice ✨"}</span>
            </div>

            {/* Tab bar */}
            <div className="flex justify-around text-xs font-medium border-t bg-black/60 z-10">
                {personalTiles.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 transition-all duration-300
            ${activeTab === tab
                                ? "bg-pink-400 text-black font-semibold"
                                : "text-gray-300 hover:bg-pink-300 hover:text-black"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
