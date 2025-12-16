import { VideoForm } from "./VideoForm";
import { ImageForm } from "./ImageForm";
import { AudioForm } from "./AudioForm";
import { PdfForm } from "./PdfForm";
import React from "react";

export function FormSelector({ type, onSubmit }) {
    switch (type) {
        case "video":
            return <VideoForm onSubmit={onSubmit} />;
        case "image":
            return <ImageForm onSubmit={onSubmit} />;
        case "audio":
            return <AudioForm onSubmit={onSubmit} />;
        case "pdf":
            return <PdfForm onSubmit={onSubmit} />;
        default:
            return <div className="text-white">No form available</div>;
    }
}