import React, { useRef, useState } from "react";

interface SafeFilePickerProps {
    accept: string;
    label: string;

    // existing
    onPick?: (file: File | null) => void;

    // NEW (optional)
    onUpload?: (file: File) => Promise<void>;
}


export function SafeFilePicker({
    accept,
    onPick,
    onUpload,
    label,
}: SafeFilePickerProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [uploading, setUploading] = useState(false);

    const openPicker = (e: React.PointerEvent | React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        e.target.value = ""; // allow re-select same file

        if (!file) return;

        // local state usage (filename, preview, etc.)
        onPick?.(file);

        // upload flow
        if (onUpload) {
            try {
                setUploading(true);
                await onUpload(file);
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <>
            <button
                type="button"
                disabled={uploading}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={openPicker}
                className="
                    flex w-full p-2 border border-pink-400 rounded-md
                    text-pink-200 text-sm bg-black/20
                    overflow-hidden whitespace-nowrap truncate
                    disabled:opacity-60
                "
            >
                {uploading ? "Uploading…" : label}
            </button>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                style={{ position: "fixed", left: "-9999px", top: "0" }}
                onChange={handleChange}
            />
        </>
    );
}