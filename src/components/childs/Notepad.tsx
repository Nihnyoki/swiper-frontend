import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import { v4 as uuid } from "uuid";
import { DisableSwiperOnMapInteraction } from "./DisableSwiperOnMapInteraction";
import { LocateUser } from "./LocateUser";
import { Person } from "@/person/personService";
import { SafeFilePicker } from "./SafeFilePicker";
import { uploadToSupabase } from "@/services/uploadToSupabase";
//import { LocateUser } from "./LocateUser";

export interface Note {
    id: string;
    title: string;
    description: string;
    lat: number;
    lng: number;
    createdAt: number;
    remind?: boolean;
        audio?: { type: string, url: string };
        image?: { type: string, url: string };
}

interface NotepadProps {
    person: Person;
    initialNotes?: Note[];
    onMapDrag?: (dragging: boolean) => void;
}

const noteIcon = new L.Icon({
    iconUrl: "/location-pin.svg",
    iconRetinaUrl: "/location-pin.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
    iconUrl: "/user-pin.png",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
});

export const Notepad = forwardRef((props: NotepadProps, ref) => {
    const { initialNotes = [], onMapDrag } = props;
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [draftTitle, setDraftTitle] = useState("");
    const [draftDescription, setdraftDescription] = useState("");
    const [draftAudio, setDraftAudio] = useState<File | null>(null);
    const [draftImage, setDraftImage] = useState<File | null>(null);
    const [playedNotes, setPlayedNotes] = useState<Set<string>>(new Set());
    const firedRemindersRef = useRef<Set<string>>(new Set());
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
    const mapRef = useRef<L.Map | null>(null);
    const [audioMedia, setAudioMedia] = useState<{ type: string; url: string } | null>(null);
    const [imageMedia, setImageMedia] = useState<{ type: string; url: string } | null>(null);

    /** Imperative handle to add note at current location */
    useImperativeHandle(ref, () => ({
        addNoteAtCurrentLocation() {
            if (!draftTitle || !draftDescription || !userLocation) return;
            setNotes(prev => [
                {
                    id: uuid(),
                    title: draftTitle,
                    description: draftDescription,
                    lat: userLocation.lat,
                    lng: userLocation.lng,
                    createdAt: Date.now(),
                    remind: false,
                },
                ...prev,
            ]);
            setDraftTitle("");
            setdraftDescription("");
        }
    }));

    /** Map click to select location */
    function LocationPicker() {
        useMapEvents({
            click(e) {
                setSelectedLocation(e.latlng);
            },
        });
        return null;
    }

    useEffect(() => {
        const recover = () => {
            if (mapRef.current) {
                setTimeout(() => {
                    mapRef.current.invalidateSize({ animate: false });
                }, 100);
            }
        };

        window.addEventListener("focus", recover);
        return () => window.removeEventListener("focus", recover);
    }, []);

    // Load initialNotes on mount or when they change
    useEffect(() => {
        if (initialNotes && initialNotes.length > 0) {
            setNotes(initialNotes);
            console.log(`\n\n\n\nInicial Notes: &{JSON.stringify(initialNotes)}`);
        }
    }, [initialNotes]);     

    /** Add note at selected location */
    const addNote = async (person: Person) => {
        if (!draftTitle.trim() || !draftDescription.trim() || !selectedLocation) return;

        const newNote = {
            id: uuid(),
            title: draftTitle,
            description: draftDescription,
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
            createdAt: Date.now(),
            remind: false,
            files: [] as Array<{ type: string; url: string }>,
        };

        // Prepare FormData for upload
        const formData = new FormData();
        formData.append("title", newNote.title);
        formData.append("description", newNote.description);
        formData.append("lat", String(newNote.lat));
        formData.append("lng", String(newNote.lng));
        formData.append("remind", "true");

        if (audioMedia) {
            formData.append(
                "audio",
                JSON.stringify(audioMedia)
            );
        }

        if (imageMedia) {
            formData.append(
                "image",
                JSON.stringify(imageMedia)
            );
        }
        if (draftAudio) formData.append("files", draftAudio);
        if (draftImage) formData.append("files", draftImage);

        try {
            console.log(`person: ${person}`);
            const savedNote = await postNote(person._id!, formData);
            console.log("Note saved to backend:", savedNote);

            // Combine uploaded files into the note object
            const uploadedFiles: Array<{ type: string; url: string }> = [];
            if (savedNote.audio) uploadedFiles.push({ type: "note", url: savedNote.audio.url });
            if (savedNote.image) uploadedFiles.push({ type: "note", url: savedNote.image.url });

            // Update frontend state
            setNotes(prev => [
                {
                    ...newNote,
                    files: uploadedFiles,
                },
                ...prev,
            ]);

            // Clear drafts
            setDraftTitle("");
            setdraftDescription("");
            setSelectedLocation(null);
            setDraftAudio(null);
            setDraftImage(null);
            setAudioMedia(null);
            setImageMedia(null);
        } catch (err) {
            console.error("Failed to save note:", err);
        }
    };


    /** Haversine distance in km */
    const distanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const toRad = (x: number) => (x * Math.PI) / 180;
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    /** Proximity check every 5 seconds */
    useEffect(() => {
        if (!userLocation) return;
        const interval = setInterval(() => {
            notes.forEach(note => {
                if (note.remind && note.audio) {
                    // Compute distance to note
                    const dist = distanceKm(userLocation.lat, userLocation.lng, note.lat, note.lng);

                    if (dist <= 0.5!&& playedNotes.has(note.id)) { // within 0.5 km
                        alert(`You are near your note: "${note.title}"`);
                        // Play attached audio
                        const audioEl = new Audio(note.audio.url);
                        audioEl.play().catch(err => console.warn("Audio playback failed:", err));
                        setPlayedNotes(prev => new Set(prev).add(note.id));
                    }
                } else if (note.remind) {
                    // No audio, just alert
                    const dist = distanceKm(userLocation.lat, userLocation.lng, note.lat, note.lng);
                    if (dist <= 0.5) {
                        alert(`You are near your note: "${note.title}"`);
                    }
                }
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [notes, userLocation]);

    function UserLocationMarker() {
        const map = useMap();

        useEffect(() => {
            map.locate({ setView: false });

            map.on("locationfound", (e) => {
                L.marker(e.latlng, { icon: userIcon })
                    .addTo(map)
                    .bindPopup("You are here");
            });

            return () => {
                map.off("locationfound");
            };
        }, [map]);

        return null;
    }

    function MapInitializer({ mapRef }: { mapRef: React.RefObject<L.Map | null> }) {
        const map = useMap();

        useEffect(() => {
            if (!mapRef.current) mapRef.current = map;
        }, [map]);

        return null;
    }


    function SwiperGestureController({
        onMapInteraction,
    }: {
        onMapInteraction?: (active: boolean) => void;
    }) {
        const map = useMap();

        useEffect(() => {
            if (!onMapInteraction) return;

            const start = () => onMapInteraction(true);
            const end = () => onMapInteraction(false);

            map.on("mousedown touchstart dragstart", start);
            map.on("mouseup touchend dragend", end);

            return () => {
                map.off("mousedown touchstart dragstart", start);
                map.off("mouseup touchend dragend", end);
            };
        }, [map, onMapInteraction]);

        return null;
    }

    function MapInteractionHandler({ onDrag }: { onDrag?: (dragging: boolean) => void }) {
        const map = useMap();

        useEffect(() => {
            if (!onDrag) return;

            const start = () => onDrag(true);
            const end = () => onDrag(false);

            map.on("dragstart", start);
            map.on("dragend", end);
            map.on("touchstart", start);
            map.on("touchend", end);

            return () => {
                map.off("dragstart", start);
                map.off("dragend", end);
                map.off("touchstart", start);
                map.off("touchend", end);
            };
        }, [map, onDrag]);

        return null;
    }

    /** POST note to backend */
    async function postNote(
        personId: string,
        formData: FormData
    ): Promise<any> {
        try {

            console.log(`formData: ${formData}`);

            const VITE_CORE_PATH = "https://swiper-backend-production.up.railway.app";
            const res = await fetch(`${VITE_CORE_PATH}/api/persons/media/${personId}`, {
                method: "POST",
                headers: {
                    "x-category": "PERSONAL",
                    "x-mediatype": "note",
                },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            return data.note; // return saved note object with audio/image URLs
        } catch (err) {
            console.error("Post note error:", err);
            throw err;
        }
    }

    // Backend update helper
    async function updateNoteReminder(person: Person ,noteId: string, remind: boolean) {
        try {
            if (!person?._id) return;
            const VITE_CORE_PATH = "https://swiper-backend-production.up.railway.app";
            const endpoint = "media"; // Or 'notes' if you have a dedicated endpoint
            const formData = new FormData();
            formData.append("remind", String(remind));
            formData.append("noteId", noteId);

            const res = await fetch(`${VITE_CORE_PATH}/api/persons/${endpoint}/${person._id}`, {
                method: "PATCH", // assuming PATCH for updating existing childItems
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");
            console.log("Reminder updated:", data);
        } catch (err) {
            console.error("Failed to update reminder:", err);
        }
    }

    
    return (
        <div className="flex flex-col w-full h-full bg-gradient-to-b from-purple-800 via-pink-800 to-purple-700 rounded-xl overflow-hidden">

            {/* MAP */}
            <div className="h-1/3 w-full border-b border-black/10">
                <MapContainer className="w-full h-full rounded-b-xl">
                    <LocateUser fallback={[-26.2041, 28.0473]} zoom={27} /> 
                    <UserLocationMarker />
                    <MapInitializer mapRef={mapRef} />
                    <MapInteractionHandler onDrag={props.onMapDrag} />
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker />
                    {selectedLocation && <Marker position={[selectedLocation.lat, selectedLocation.lng]} />}
                    {notes.map(note => <Marker key={note.id} position={[note.lat, note.lng]} />)}
                </MapContainer>

            </div>

            {/* INPUT */}
            <div className="p-2 border-t border-pink-400 flex flex-col gap-2">
                <div className="flex gap-2">
                    <input
                        className="flex-1 p-2 text-sm rounded-md bg-purple-900/50 text-pink-200 placeholder-pink-300 outline-none"
                        placeholder="Note Title"
                        value={draftTitle}
                        onChange={e => setDraftTitle(e.target.value)}
                    />
                    <label className="flex items-center gap-1 text-xs text-pink-200 shrink-0">
                        <input
                            type="checkbox"
                            checked={!!notes.find(n => n.remind)}
                            onChange={(e) => {
                                if (notes.length > 0) {
                                    setNotes(prev => prev.map(n => ({ ...n, remind: e.target.checked })));
                                }
                            }}
                        />
                        Remind
                    </label>
                </div>

                <textarea
                    className="w-full h-20 p-2 text-sm rounded-md bg-purple-900/50 text-pink-200 placeholder-pink-300 resize-y outline-none overflow-y-auto"
                    placeholder={selectedLocation ? "Write your note…" : "Tap on the map to select a location"}
                    value={draftDescription}
                    onChange={e => setdraftDescription(e.target.value)}
                />

                <div className="flex w-full gap-2">
                    <div className="flex w-full h-13 gap-2 ">
                        <SafeFilePicker
                            accept="audio/*"
                            label={draftAudio ? draftAudio.name : "Attach Audio"}
                            onPick={setDraftAudio}
                            onUpload={async (file) => {
                            const url = await uploadToSupabase(file, "audios");
                            setAudioMedia({ type: "audio", url });
                            console.log(`uploadToSupabase - path: ${url}`)
                            }}
                        />
                        
                        <SafeFilePicker
                            accept="image/*"
                            label={draftImage ? draftImage.name : "Attach Image"}
                            onPick={setDraftImage}
                            onUpload={async (file) => {
                            const url = await uploadToSupabase(file, "images");
                            setImageMedia({ type: "image", url });
                            console.log(`uploadToSupabase - path: ${url}`)
                            }}
                        />
                    </div>

                </div>

                <button
                    className="mt-2 w-full py-2 rounded-md bg-gradient-to-r from-purple-600 via-pink-600 to-purple-500 disabled:opacity-40 text-white font-semibold"
                    disabled={!draftTitle || !draftDescription || !selectedLocation}
                    onClick={() => addNote(props.person)}
                >
                    Add Note
                </button>
            </div>

            {/* NOTES LIST */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
                {notes.map(note => {
                    const isExpanded = expandedNotes.has(note.id);
                    const timestamp = new Date(note.createdAt).toLocaleString();

                    return (
                        <div
                            key={note.id}
                            className="bg-purple-900/40 rounded-md p-2 text-sm cursor-pointer border border-pink-500"
                            onDoubleClick={() => {
                                setExpandedNotes(prev => {
                                    const copy = new Set(prev);
                                    if (copy.has(note.id)) copy.delete(note.id);
                                    else copy.add(note.id);
                                    return copy;
                                });
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <p className="text-pink-300 font-semibold truncate">{note.title}</p>
                                <label className="flex items-center gap-1 text-xs text-pink-200">
                                    <input
                                        type="checkbox"
                                        checked={!!note.remind}
                                        onChange={async (e) => {
                                            const newRemind = e.target.checked;
                                            setNotes(prev => prev.map(n => n.id === note.id ? { ...n, remind: newRemind } : n));
                                            await updateNoteReminder(props.person, note.id, newRemind);
                                            if (!newRemind) firedRemindersRef.current.delete(note.id);
                                        }}
                                    />
                                    Remind
                                </label>
                            </div>


                            {isExpanded && <p className="text-pink-100 text-sm max-h-40 overflow-y-auto mt-1">{note.description}</p>}
                            <p className="text-[10px] text-pink-200/70 mt-1">
                                📍 {note.lat.toFixed(4)}, {note.lng.toFixed(4)} — {timestamp}
                            </p>
                            {note.audio && <p className="text-[10px] text-green-200 mt-1">🎵 Audio attached</p>}
                            {note.image && <p className="text-[10px] text-yellow-200 mt-1">🖼 Image attached</p>}
                        </div>
                    );
                })}
            </div>

        </div>
    );
});
