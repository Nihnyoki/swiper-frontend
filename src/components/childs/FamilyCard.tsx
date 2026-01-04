import React, { useState } from "react";
import 'swiper/css'
import { getImageUrl } from "../../lib/utils"

const BACKEND_IMAGE_URL =`${import.meta.env.VITE_BACKEND_BASE_URL}/${import.meta.env.VITE_USER_IMAGES_PATH}`;

interface FamilyCard {
    person: any;
    width?: string;
    height?: string;
    childItems?: any[];
}

export function FamilyCard({
    person,
    width = "w-[250px]",
    height = "h-[320px]",
    childItems: any
}: FamilyCard) {
    const isPlaceholder = person?.isPlaceholder;
    const [activeTab, setActiveTab] = useState("Friends")
    const familyTiles = ["Friends", "Drinks&Eats", "Activities", "Vids&Pics", "Love"]
        
    const imageAddress = getImageUrl(
    BACKEND_IMAGE_URL,
    person?.IMAGE
    );

    return (
        <div
            className={`relative flex-1 overflow-y-auto w-full h-full rounded-xl overflow-hidden shadow-md ${isPlaceholder ? "bg-gray-700 text-white opacity-60" : "bg-black text-white"
                }`}
        >
            <div className="flex flex-col h-full">

                {/* Spacer */}
                <div className="flex-grow"></div>

                {/* Bottom: Age + Emoji */}
                <div className="w-full flex items-end justify-between">
                    <div className="w-1/3"></div>
                    <div className="w-1/3 flex justify-center">
                    </div>
                    <div className="w-1/3 flex justify-end">
                        <span className="text-white text-2xl">{person?.EMOJIMETH || "💖"}</span>
                    </div>
                </div>
            </div>

            {imageAddress && (
                <img
                    src={imageAddress}
                    alt={person?.NAME || "Person Image"}
                    className="absolute top-0 left-0 w-1/2 h-1/2 object-cover opacity-70 mix-blend-lighten"
                    style={{ objectPosition: "top left" }}
                />
            )}
        </div>
    );
}
