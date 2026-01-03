import React, { useState } from "react";
import { Image, Video, BookOpen, FilePlus } from "lucide-react";

interface AddChildItemProps {
    personId: string;
    thingKey: number;
    onSuccess?: () => void;
}

const mediaTypes = [
    { type: "image", label: "Image", icon: Image },
    { type: "video", label: "Video", icon: Video },
    { type: "book", label: "Book", icon: BookOpen },
    { type: "file", label: "Other File", icon: FilePlus },
];

export function AddChildItem({ personId, thingKey, onSuccess }: AddChildItemProps) {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!selectedType || !title) {
            alert("Please select a type and add a title");
            return;
        }

        const newChildItem = {
            key: Date.now(),
            val: title,
            type: selectedType,
            url,
            description,
        };

        try {
            setLoading(true);
            const res = await fetch("https://swiper-backend-production.up.railway.app/api/persons/addChild", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    personId,
                    thingKey,
                    childItem: newChildItem,
                }),
            });

            if (!res.ok) throw new Error("Failed to add child item");

            if (onSuccess) onSuccess();
            setTitle("");
            setDescription("");
            setUrl("");
            setSelectedType(null);
        } catch (err) {
            console.error(err);
            alert("Failed to add child item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 w-full rounded-2xl shadow-xl 
          bg-gradient-to-br from-white via-gray-100 to-gray-200 
          border border-gray-300 text-gray-800">

            {/* Media Type Grid */}
            <div className="grid grid-cols-4 gap-4 mb-4">
                {mediaTypes.map((mt) => {
                    const Icon = mt.icon;
                    return (
                        <button
                            key={mt.type}
                            onClick={() => setSelectedType(mt.type)}
                            className={`flex flex-col items-center p-3 rounded-xl transition shadow-sm
                ${selectedType === mt.type
                                    ? "bg-gradient-to-br from-pink-400 to-pink-500 text-white shadow-md"
                                    : "bg-white hover:bg-gray-100 border border-gray-300"}
              `}
                        >
                            <Icon className="h-6 w-6 mb-1" />
                            <span className="text-xs">{mt.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Inputs */}
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
                type="text"
                placeholder="Media URL (optional)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full mb-3 px-3 py-2 rounded-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />

            {/* Submit Button */}
            <button
                onClick={handleAdd}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 
                text-white font-semibold shadow-md disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add Item"}
            </button>
        </div>
    );
}
    