import React, { useState } from "react";
import 'swiper/css'

const VITE_IMAGE_CORE_PATH = "https://swiper-backend-production.up.railway.app/IMAGETHS";

interface SocialCardProps {
    person: any;
    width?: string;
    height?: string;
    childItems?: any[];
}

export function SocialCard({
    person,
    width = "w-[250px]",
    height = "h-[320px]",
    childItems: any
}: SocialCardProps) {
  const isPlaceholder = person?.isPlaceholder;
  const [activeTab, setActiveTab] = useState("Friends")
  const socialTiles = ["Friends", "Drinks&Eats", "Activities", "Vids&Pics", "Love"]

  const imageAddress = person?.IMAGETH
    ? person.IMAGETH.startsWith('/IMAGETHS')
      ? `${VITE_IMAGE_CORE_PATH}${person.IMAGETH.replace('/IMAGETHS', '')}`
      : `${VITE_IMAGE_CORE_PATH}/${person.IMAGETH.split('/').pop()}`
    : null;

    return (
        <div
            className={`relative w-full h-full rounded-xl overflow-hidden p-4 shadow-md flex flex-col ${isPlaceholder
                ? "bg-gray-700 text-white opacity-60"
                : "bg-black text-white"
                }`}
        >
            {/* Top Section 
            <div className="flex justify-between items-start">
                {imageAddress && (
                    <img
                        src={imageAddress}
                        alt={person?.NAME || "Person IMAGETH"}
                        className="w-12 h-12 rounded-full object-cover border border-white"
                    />
                )}

        </div> */}

            {/* Middle content (changes with socialTiles) */}
            <div className="flex-grow mt-2 overflow-y-auto scrollbar-thin">
                {activeTab === "Friends" && (
                    <div className="p-2 text-sm">👥 {person?.FRIENDS?.join(", ") || "No friends listed"}</div>
                )}
                {activeTab === "Drinks&Eats" && (
                    <div className="p-2 text-sm">🍔 {person?.DRINKS?.join(", ") || "No favorites yet"}</div>
                )}
                {activeTab === "Activities" && (
                    <div className="p-2 text-sm">⚽ {person?.ACTIVITIES?.join(", ") || "No activities listed"}</div>
                )}
                {activeTab === "Vids&Pics" && (
                    <div className="p-2 text-sm">📸 {person?.MEDIASUM || 0} items</div>
                )}
                {activeTab === "Love" && (
                    <div className="p-2 text-sm">❤️ {person?.LOVE || "Nothing to show"}</div>
                )}
            </div>

            {/* Bottom: age + emoji */}
            <div className="flex items-center justify-between py-2">
                <span className="text-sm font-bold"></span>
                <span className="text-2xl">{person?.EMOJIMETH || "💖"}</span>
            </div>

            {/* Tab bar */}
            <div className="flex justify-between text-xs border-t border-gray-600 pt-1">
                {socialTiles.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 text-center py-1 rounded-md transition ${activeTab === tab ? "bg-pink-600 text-white" : "text-gray-400 hover:text-white"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
