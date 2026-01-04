import React, { useState } from "react";
import 'swiper/css'
import { getImageUrl } from "../../lib/utils"

const BACKEND_IMAGE_URL =`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_USER_IMAGES_PATH}`;

interface ProfessionalProps {
    person: any;
    width?: string;
    height?: string;
    childItems?: any[];
}

export function ProfessionalCard({
    person,
    width = "w-[250px]",
    height = "h-[320px]",
    childItems: any
}: ProfessionalProps) {
  const isPlaceholder = person?.isPlaceholder;
  const [activeTab, setActiveTab] = useState("Friends")
  const profTiles = ["Projects", "Tradings", "Certificates", "Sites", "Plans"]

    const imageAddress = getImageUrl(
    BACKEND_IMAGE_URL,
    person?.IMAGE
    );

    return (
        <div
            className={`relative w-full h-full rounded-xl overflow-hidden shadow-md flex bg-black/80 text-white`}
        >
            {/* Left Column: Image + Tabs */}
            <div className="flex flex-col items-start pr-2">
                {/* Top Spacer (to align with profile image row) */}
                <div className="h-12" /> {/* same as profile image height */}

                {/* Tabs like Folders */}
                <div className="flex flex-col flex-grow justify-between mt-2 mb-[6px] space-y-2">
                    {profTiles.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative w-20 px-2 py-2 text-xs text-left transition-all font-pacifico
              ${activeTab === tab
                                    ? "bg-pink-600/90 text-white shadow-md clip-folder font-pacifico"
                                    : "text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-r-md font-pacifico"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Bottom Spacer (to align with bottom section) */}
                <div className="h-10" /> {/* same as bottom section height */}
            </div>

            {/* Main Card Content */}
            <div className="flex flex-col flex-grow p-4">
                {/* Top Section 
                <div className="flex justify-between items-start">
                    {imageAddress && (
                        <img
                            src={imageAddress}
                            alt={person?.NAME || "Person IMAGETH"}
                            className="w-12 h-12 rounded-full object-cover border border-white"
                        />
                    )}
                </div>
                */}

                {/* Middle Section - Tab Content */}
                <div className="flex-grow mt-2 overflow-y-auto scrollbar-thin">
                    {activeTab === "Friends" && (
                        <div className="p-2 text-sm">
                            👥 {person?.PROJECTS?.join(", ") || "No friends listed"}
                        </div>
                    )}
                    {activeTab === "Drinks&Eats" && (
                        <div className="p-2 text-sm">
                            🍔 {person?.BUSINESSES?.join(", ") || "No favorites yet"}
                        </div>
                    )}
                    {activeTab === "Activities" && (
                        <div className="p-2 text-sm">
                            ⚽ {person?.CERTIFICATES?.join(", ") || "No activities listed"}
                        </div>
                    )}
                    {activeTab === "Vids&Pics" && (
                        <div className="p-2 text-sm">📸 {person?.MEDIASUM || 0} items</div>
                    )}
                    {activeTab === "Love" && (
                        <div className="p-2 text-sm">
                            ❤️ {person?.SITES || "Nothing to show"}
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}
