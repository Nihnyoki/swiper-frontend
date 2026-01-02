import React, { useState } from "react";
import 'swiper/css'

const VITE_IMAGE_CORE_PATH = "https://swiper-backend-production.up.railway.app/IMAGETHS";

interface FunCardProps {
    person: any;
    width?: string;
    height?: string;
    childItems?: any[];
}

export function FunCard({
    person,
    width = "w-[250px]",
    height = "h-[320px]",
    childItems: any
}: FunCardProps) {
  const isPlaceholder = person?.isPlaceholder;
  const [activeTab, setActiveTab] = useState("Friends")
  const funTiles = ["Parties", "Gaming", "Travel", "Jokes", "Music"];

  const imageAddress = person?.IMAGETH
    ? person.IMAGETH.startsWith('/IMAGETHS')
      ? `${VITE_IMAGE_CORE_PATH}${person.IMAGETH.replace('/IMAGETHS', '')}`
      : `${VITE_IMAGE_CORE_PATH}/${person.IMAGETH.split('/').pop()}`
    : null;

    return (
        <div
            className={`relative flex-col w-full h-full overflow-y-auto rounded-xl shadow-1xl flex bg-gradient-to-tr bg-black/80 to-grey-400 text-white animate-pulse-slow`}
        >
            {/* Confetti sparkle background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/confetti.png')] opacity-20"></div>

            {/* Top Section */}
            <div className="flex justify-between items-center p-3 z-10">
                <div className="flex items-center gap-2">
                    {imageAddress && (
                        <img
                            src={imageAddress}
                            alt={person?.NAME || "Person IMAGETH"}
                            className="w-12 h-12 rounded-full object-cover border border-white"
                        />
                    )}
                </div>
                <span className="text-3xl animate-bounce">✨</span>
            </div>

            {/* Fun content area */}
            <div className="flex-grow px-3 py-2 overflow-y-auto z-10 font-semibold text-center text-base">
                {activeTab === "Parties" && (
                    <div className="text-yellow-200">🥳 {person?.PARTIES?.join(", ") || "No parties yet!"}</div>
                )}
                {activeTab === "Gaming" && (
                    <div className="text-green-200">🎮 {person?.GAMES?.join(", ") || "No games played"}</div>
                )}
                {activeTab === "Travel" && (
                    <div className="text-blue-200">✈️ {person?.TRAVEL?.join(", ") || "Still grounded"}</div>
                )}
                {activeTab === "Jokes" && (
                    <div className="text-pink-200">😂 {person?.JOKES?.[0] || "No jokes yet"}</div>
                )}
                {activeTab === "Music" && (
                    <div className="text-purple-200">🎶 {person?.MUSIC?.join(", ") || "Silence..."}</div>
                )}
            </div>

            {/* Footer fun stats */}
            <div className="flex justify-between items-center px-4 py-2 bg-black/40 z-10">
                <span className="text-xl font-bold text-lime-300">{person?.FUNLEVEL || "🔥"}</span>
                <span className="text-3xl animate-spin-slow">{person?.EMOJIMETH || "🎮"}</span>
            </div>

            {/* Tab bar - colorful buttons */}
            <div className="flex justify-around text-xs font-bold border-t border-white/20 bg-black/30 z-10">
                {funTiles.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 transition-all duration-300 
            ${activeTab === tab
                                ? "bg-white text-black scale-105 shadow-md"
                                : "text-white hover:scale-105 hover:bg-white/20"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
