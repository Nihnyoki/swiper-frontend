import React, { useState } from "react";
import { Plus, Camera, Video, Image, File } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChildItem {
    key: number;
    val: string;
}

interface ChildSectionProps {
    childItems: ChildItem[];
    activeTab: number;
    setActiveTab: (idx: number) => void;
    onAddChild: (child: { type: string; url: string; file?: File }) => void;
}

export default function ChildSection({
    childItems,
    activeTab,
    setActiveTab,
    onAddChild,
}: ChildSectionProps) {
    const [showShelf, setShowShelf] = useState(false);
    const [tab, setTab] = useState<"video" | "picture" | "file">("video");

    const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onAddChild({ type, url, file });
            setShowShelf(false);
        }
    };

    return (
        <div className="relative w-full">
            {/* Childs Horizontal Line */}
            <div className="flex justify-around items-center text-xs font-medium border-t bg-gray-100/80 backdrop-blur-sm shadow-inner relative z-10">
                {/* Floating Create Button */}
                <button
                    onClick={() => setShowShelf(true)}
                    className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-gradient-to-br from-white via-gray-200 to-gray-400 
          shadow-lg border border-gray-300 flex items-center justify-center hover:scale-105 transition"
                >
                    <Plus className="text-gray-800" size={28} />
                </button>

                {/* Existing Childs */}
                <div className="flex-1 flex justify-around pl-10">
                    {childItems &&
                        childItems.map((child, idx) => (
                            <button
                                key={child.key}
                                onClick={() => setActiveTab(idx)}
                                className={`flex-1 py-2 transition-all duration-300 ${activeTab === idx
                                        ? "bg-pink-400 text-black font-semibold rounded-t-md"
                                        : "text-gray-600 hover:bg-pink-200 hover:text-black"
                                    }`}
                            >
                                {child.val}
                            </button>
                        ))}
                </div>
            </div>

            {/* Bottom Shelf */}
            <AnimatePresence>
                {showShelf && (
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 h-[70vh] bg-white rounded-t-2xl shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-4 border-b">
                            <button
                                onClick={() => setShowShelf(false)}
                                className="text-gray-500 text-sm"
                            >
                                Close
                            </button>

                            {/* Camera-on input */}
                            <label className="cursor-pointer flex items-center gap-2 text-gray-700 font-medium">
                                <Camera className="w-6 h-6" />
                                <span>Record</span>
                                <input
                                    type="file"
                                    accept="video/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={(e) => handleFilePick(e, "video")}
                                />
                            </label>
                        </div>

                        {/* Tabs */}
                        <div className="flex justify-around border-b text-sm font-medium">
                            {["video", "picture", "file"].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t as any)}
                                    className={`flex-1 py-3 ${tab === t
                                            ? "text-pink-500 border-b-2 border-pink-500"
                                            : "text-gray-500"
                                        }`}
                                >
                                    {t === "video" ? "Videos" : t === "picture" ? "Pictures" : "Files"}
                                </button>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-3 gap-3">
                            {/* File inputs hidden, clickable proxies */}
                            {tab === "video" && (
                                <label className="bg-gray-200 rounded-lg h-28 flex flex-col items-center justify-center text-xs text-gray-600 cursor-pointer hover:bg-gray-300">
                                    <Video className="w-6 h-6 mb-1" />
                                    Pick Video
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={(e) => handleFilePick(e, "video")}
                                    />
                                </label>
                            )}

                            {tab === "picture" && (
                                <label className="bg-gray-200 rounded-lg h-28 flex flex-col items-center justify-center text-xs text-gray-600 cursor-pointer hover:bg-gray-300">
                                    <Image className="w-6 h-6 mb-1" />
                                    Pick Picture
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={(e) => handleFilePick(e, "picture")}
                                    />
                                </label>
                            )}

                            {tab === "file" && (
                                <label className="bg-gray-200 rounded-lg h-28 flex flex-col items-center justify-center text-xs text-gray-600 cursor-pointer hover:bg-gray-300">
                                    <File className="w-6 h-6 mb-1" />
                                    Pick File
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleFilePick(e, "file")}
                                    />
                                </label>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
