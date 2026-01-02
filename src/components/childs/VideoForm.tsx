import React, { useState } from "react";
import { SafeFilePicker } from "./SafeFilePicker";
import { uploadToSupabase } from "../../services/uploadToSupabase";
import { Underline } from "lucide-react";

interface VideoFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function VideoForm({ onSubmit }: VideoFormProps) {
        const [draftVideo, setDraftVideo] = useState<File | null>(null);
        const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
        
    return (
        <form
            className="flex flex-col gap-3 text-white"
            onSubmit={onSubmit}
            encType="multipart/form-data" // ✅ must include this
        >
            <input type="text" name="title" placeholder="Title" className="p-2 bg-white/10 rounded" />
            <textarea name="description" placeholder="Description" className="p-2 bg-white/10 rounded"></textarea>
            <input type="text" name="tags" placeholder="Tags (comma separated)" className="p-2 bg-white/10 rounded" />
            <input type="text" name="creator" placeholder="Creator" className="p-2 bg-white/10 rounded" />
            <SafeFilePicker
                                        accept="video/*"
                                        label={draftVideo ? draftVideo.name : "Attach Video"}
                                        onPick={setDraftVideo}
                                        onUpload={async (file) => {
                                        const videoUrl = await uploadToSupabase(file, "videos");
                                        setVideoUrl(videoUrl);
                                        console.log(`uploadToSupabase - path: ${videoUrl}`)
                                        }}
                                    />
            <input type="hidden" name="url" value={videoUrl ?? ""} />
            {/* <input type="file" name="files" accept="video/*" className="p-2 bg-white/10 rounded" /> */} 
            <button className="w-full mt-4 py-3 bg-pink-500 text-white rounded-xl font-semibold">Save</button>
        </form>
    );
}
