import React, { useEffect, useState } from "react";

interface InputCursorProps {
    show?: boolean;
    color?: string;
    blinkSpeed?: number;
}

function InputCursor({ show = true, color = "#fff", blinkSpeed = 1 }: InputCursorProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => setVisible((v) => !v), 500 * blinkSpeed);
        return () => clearInterval(interval);
    }, [blinkSpeed]);

    if (!show) return null;

    return (
        <span
            style={{
                display: "inline-block",
                width: 2,
                height: "70%",
                backgroundColor: visible ? color : "transparent",
                verticalAlign: "middle",
                marginLeft: 1,
                animation: `blink ${0.5 * blinkSpeed}s step-start infinite`,
            }}
        />
    );
}

interface MakeFormPersonProps {
    onSubmit: (idNum: string) => void;
    onClose: () => void;
}

export default function MakeFormPerson({ onSubmit, onClose }: MakeFormPersonProps) {
    const [name, setName] = useState("");
    const [idNum, setIdNum] = useState("");
    const [gender, setGender] = useState("MALE");
    const [age, setAge] = useState("");
    const [type, setType] = useState("ADULT");
    const [activities, setActivities] = useState<string[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;


    const ACTIVITY_OPTIONS = [
        "SOCIAL",
        "PROFESSIONAL",
        "FUN",
        "CHILDREN",
        "CULTURE",
        "PERSONAL",
    ];

    const toggleActivity = (act: string) => {
        setActivities((prev) =>
            prev.includes(act) ? prev.filter((a) => a !== act) : [...prev, act]
        );
    };

    const handleActivityClick = (act: string) => {
        toggleActivity(act);
        setIsDropdownOpen(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            alert("Please select an image from the gallery!");
            return;
        }

        const formData = new FormData();
        formData.append("NAME", name);
        formData.append("IDNUM", idNum);
        formData.append("GENDER", gender);
        formData.append("TYPETH", type);
        formData.append("AGETH", age);
        formData.append("ACTIVITIES", JSON.stringify(activities));
        formData.append(
            "IFATH",
            JSON.stringify({
                name,
                tyte: imageFile.name.split(".").pop(),
                date: new Date().toISOString(),
            })
        );
        formData.append("IMAGE", imageFile);
        formData.append("EMOJIMETH", "💖");
        formData.append(
            "THINGS",
            JSON.stringify(
                activities.map((act, idx) => ({
                    key: idx,
                    val: act,
                    childItems: [
                        {
                            key: 0,
                            val: "Ngoma",
                            nkil: "nkil to song",
                        }
                ],
                }))
            )
        );

        try {
            const res = await fetch(`${VITE_BACKEND_BASE_URL}/api/persons`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to create person");
            const data = await res.json();
            onSubmit(data.IDNUM);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white/20 p-8 rounded-2xl w-[420px] max-w-full shadow-xl backdrop-blur-md">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 border-b border-gray-300 text-center pb-3">
                    Person
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none"
                    />

                    <input
                        type="text"
                        placeholder="ID Number"
                        value={idNum}
                        onChange={(e) => setIdNum(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none"
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-100">
                            Upload Image (Required)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            className="w-full text-white bg-white/10 rounded-lg p-2 cursor-pointer"
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-lg mt-1"
                            />
                        )}
                    </div>

                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>

                    <input
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-gray-300 outline-none"
                    />

                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full p-3 rounded-lg bg-white/10 text-white outline-none"
                    >
                        <option value="ADULT">Adult</option>
                        <option value="CHILD">Child</option>
                    </select>

                    <div className="relative">
                        <label className="text-sm font-semibold text-gray-100 mb-1 block">
                            Activities
                        </label>
                        <div
                            className="w-full p-3 rounded-lg bg-white/10 cursor-pointer flex flex-col gap-1"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            {activities.length
                                ? activities.map((act) => (
                                    <div
                                        key={act}
                                        className="flex justify-between items-center bg-white/10 p-1 rounded transition"
                                    >
                                        <span>{act}</span>
                                    </div>
                                ))
                                : "Select activities..."}
                        </div>

                        {isDropdownOpen && (
                            <ul className="absolute z-10 w-full mt-1 max-h-40 overflow-auto bg-white/100 backdrop-blur-md rounded-lg shadow-lg">
                                {ACTIVITY_OPTIONS.map((act) => (
                                    <li
                                        key={act}
                                        onClick={() => handleActivityClick(act)}
                                        className={`px-4 py-2 cursor-pointer flex justify-between items-center hover:bg-gray-500/30 ${activities.includes(act) ? "bg-white/10" : ""
                                            }`}
                                    >
                                        <span>{act}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white/10 text-white py-3 rounded-lg hover:bg-white/20 transition font-semibold backdrop-blur-md"
                    >
                        Create Person
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-2 text-sm text-gray-300 hover:underline"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
}
