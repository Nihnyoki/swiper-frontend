import React, { useState } from "react";
import { SafeFilePicker } from "./SafeFilePicker";
import { uploadToSupabase } from "../../services/uploadToSupabase";

interface AudioFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AudioForm({ onSubmit }: AudioFormProps) {
            const [draftAudio, setDraftAudio] = useState<File | null>(null);
            const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
    return (
        <form
            className="flex flex-col gap-3 text-white"
            onSubmit={onSubmit}
            encType="multipart/form-data" // ✅ must include this
        >
            <input type="text" name="title" placeholder="Title" className="p-2 bg-white/10 rounded" />
            <textarea name="description" placeholder="Description" className="p-2 bg-white/10 rounded"></textarea>
            <input type="text" name="tags" placeholder="Tags (comma separated)" className="p-2 bg-white/10 rounded" />
            <SafeFilePicker
                                                    accept="audio/*"
                                                    label={draftAudio ? draftAudio.name : "Attach Audio"}
                                                    onPick={setDraftAudio}
                                                    onUpload={async (file) => {
                                                    const audioUrl = await uploadToSupabase(file, "audios");
                                                    setAudioUrl(audioUrl);
                                                    }}
                                                />
            <input type="hidden" name="url" value={audioUrl ?? ""} />
            <button className="w-full mt-4 py-3 bg-pink-500 text-white rounded-xl font-semibold">Save</button>
        </form>
    );
}