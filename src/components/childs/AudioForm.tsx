import React from "react";

interface AudioFormProps {
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function AudioForm({ onSubmit }: AudioFormProps) {
    return (
        <form
            className="flex flex-col gap-3 text-white"
            onSubmit={onSubmit}
            encType="multipart/form-data" // ✅ must include this
        >
            <input type="text" name="title" placeholder="Title" className="p-2 bg-white/10 rounded" />
            <textarea name="description" placeholder="Description" className="p-2 bg-white/10 rounded"></textarea>
            <input type="text" name="tags" placeholder="Tags (comma separated)" className="p-2 bg-white/10 rounded" />
            <input type="file" name="files" accept="audio/*" className="p-2 bg-white/10 rounded" />
            <button className="w-full mt-4 py-3 bg-pink-500 text-white rounded-xl font-semibold">Save</button>
        </form>
    );
}