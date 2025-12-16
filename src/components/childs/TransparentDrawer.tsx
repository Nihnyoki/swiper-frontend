import React, { useEffect, useRef, useState } from "react";
import { VideoForm } from "./VideoForm";
import { PdfForm } from "./PdfForm";
import { ImageForm } from "./ImageForm";
import { AudioForm } from "./AudioForm";
import { Person } from "@/person/personService";

type MediaType = "video" | "image" | "audio" | "pdf" | "custom";

interface TransparentDrawerProps {
    person: Person;
    isOpen: boolean;
    onClose: () => void;
    type?: MediaType;
    onSubmit: (
        formData: FormData,
        mediaType: Exclude<MediaType, "custom">
    ) => Promise<void>;
}

export default function TransparentDrawer({
    person,
    isOpen,
    onClose,
    type = "audio",
    onSubmit,
}: TransparentDrawerProps) {
    const [activeTab, setActiveTab] =
        useState<Exclude<MediaType, "custom">>("video");

    const wasOpenRef = useRef(false);

    // ✅ Set landing tab ONLY when drawer transitions closed → open
    useEffect(() => {
        if (isOpen && !wasOpenRef.current) {
            if (type && type !== "custom") {
                setActiveTab(type);
            }
        }

        wasOpenRef.current = isOpen;
    }, [isOpen, type]);

    if (!isOpen) return null;

    const handleFormSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await onSubmit(formData, activeTab);
        onClose();
    };

    const renderForm = () => {
        switch (activeTab) {
            case "video":
                return <VideoForm onSubmit={handleFormSubmit} />;
            case "image":
                return <ImageForm onSubmit={handleFormSubmit} />;
            case "audio":
                return <AudioForm onSubmit={handleFormSubmit} />;
            case "pdf":
                return <PdfForm onSubmit={handleFormSubmit} />;
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative w-full max-w-lg rounded-t-2xl bg-white/20 backdrop-blur-md shadow-xl border border-white/10 animate-slide-up">

                {/* Tabs */}
                <div className="flex justify-between border-b border-white/20 px-4 pt-4">
                    {[
                        { key: "video", label: "Video" },
                        { key: "image", label: "Image" },
                        { key: "audio", label: "Audio" },
                        { key: "pdf", label: "PDF" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() =>
                                setActiveTab(tab.key as Exclude<MediaType, "custom">)
                            }
                            className={`pb-2 px-3 text-sm font-medium transition-all
                ${activeTab === tab.key
                                    ? "text-white border-b-2 border-white"
                                    : "text-white/60 hover:text-white"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Active Form */}
                <div className="p-6">{renderForm()}</div>
            </div>
        </div>
    );
}
