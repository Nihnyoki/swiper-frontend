import React, { useRef } from "react";

interface SafeFilePickerProps {
    accept: string;
    label: string;

    // existing
    onPick?: (file: File | null) => void;

    // NEW (optional)
    onUpload?: (file: File) => Promise<void>;
}


export function SafeFilePicker({ accept, onPick, label }: SafeFilePickerProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const openPicker = (e: React.PointerEvent | React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        inputRef.current?.click();
    };

    return (
        <>
            <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={openPicker}
                className="flex w-full p-2 border border-pink-400 rounded-md text-pink-200 text-sm bg-black/20 overflow-hidden text-wrap truncate"
            >
                {label}
            </button>

            {/* MUST be offscreen, not display:none */}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                style={{ position: "fixed", left: "-9999px", top: "0" }}
                onChange={(e) => {
                    onPick(e.target.files?.[0] ?? null);
                    e.target.value = ""; // allow re-select same file
                }}
            />
        </>
    );
}
