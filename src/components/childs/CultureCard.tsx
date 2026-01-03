import React, { useState } from "react";
import 'swiper/css'

const VITE_IMAGE_CORE_PATH = "https://swiper-backend-production.up.railway.app/IMAGETHS";

interface CultureCardProps {
    person: any;
    width?: string;
    height?: string;
    childItems?: any[];
}

export function CultureCard({
    person,
    width = "w-[250px]",
    height = "h-[320px]",
    childItems: any
}: CultureCardProps) {
  const isPlaceholder = person?.isPlaceholder;
  const [activeTab, setActiveTab] = useState("Friends")
  const cultureTiles = ["Art", "History", "Books", "Language", "Philosophy"];

  const imageAddress = person?.IMAGETH
    ? person.IMAGETH.startsWith('/IMAGETHS')
      ? `${VITE_IMAGE_CORE_PATH}${person.IMAGETH.replace('/IMAGETHS', '')}`
      : `${VITE_IMAGE_CORE_PATH}/${person.IMAGETH.split('/').pop()}`
    : null;

    return (
        <div
            className={`relative w-full h-full rounded-xl overflow-hidden shadow-1xl flex flex-col 
      bg-gradient-to-tr bg-black/80 to-grey-400 text-white font-serif`}
        >
            {/* Subtle pattern overlay 
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-30"></div>
        // */}


            {/* Content */}
            <div className="flex-grow p-4 overflow-y-auto z-10 text-base leading-relaxed">
                {activeTab === "Art" && (
                    <div className="italic text-rose-800">🎨 {person?.ART?.join(", ") || "No art listed"}</div>
                )}
                {activeTab === "History" && (
                    <div className="italic text-stone-700">🏺 {person?.HISTORY?.join(", ") || "History untold"}</div>
                )}
                {activeTab === "Books" && (
                    <div className="italic text-amber-900">📖 {person?.BOOKS?.join(", ") || "No books recorded"}</div>
                )}
                {activeTab === "Language" && (
                    <div className="italic text-indigo-800">🗣️ {person?.LANGUAGE?.join(", ") || "Languages unknown"}</div>
                )}
                {activeTab === "Philosophy" && (
                    <div className="italic text-emerald-800">💭 {person?.PHILOSOPHY?.join(", ") || "No philosophy yet"}</div>
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-4 py-2 bg-stone-900 text-sm text-gray-300 z-10">
                <span>Culture Level</span>
                <span className="font-medium text-grey-900">{person?.CULTURELEVEL || "🌍"}</span>
            </div>

            {/* Tab bar - museum style */}
            <div className="flex justify-around text-xs font-medium border-t bg-black/60 bg-amber-200 z-10 text-stone-900">
                {cultureTiles.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 transition-all duration-300
            ${activeTab === tab
                                ? "bg-amber-400 text-stone-900 font-semibold"
                                : "text-stone-700 hover:bg-amber-300"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>
    );
}
