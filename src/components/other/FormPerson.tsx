import React, { useState } from "react";
import MakeFormPerson from "./MakeFormPerson";
import LoginFormPerson from "./LoginFormPerson";

interface FormPersonProps {
    idNum?: string;
    onClose: () => void;
    onLogin: (idNum: string) => void;
    onCreate: (idNum: string) => void;
}

export default function FormPerson({
    idNum: initialIdNum,
    onClose,
    onLogin,
    onCreate,
}: FormPersonProps) {
    const [mode, setMode] = useState<"choose" | "login" | "create">("choose");
    const [idNum, setIdNum] = useState(initialIdNum ?? "");
    const [error, setError] = useState<string>("");

    const handleIdNumChange = (value: string) => {
        setIdNum(value);
        setError("");
    };

    const handleLoginSubmit = (idNum: string) => {
        onLogin(idNum);
    };

    const handleLoginError = (msg: string) => {
        setError(msg);
    };

    if (mode === "login" && idNum) {
        return (
            <LoginFormPerson
                idNum={idNum}
                onSubmit={handleLoginSubmit}
                onError={handleLoginError} // pass error callback
                onClose={onClose}
            />
        );
    }

    if (mode === "create") {
        return <MakeFormPerson onSubmit={onCreate} onClose={onClose} />;
    }

    // Default choice screen
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white/20 p-8 rounded-2xl w-[420px] max-w-full shadow-xl backdrop-blur-md">
                <h2 className="text-2xl font-bold text-gray-100 mb-6 border-b border-gray-300 text-center pb-3">
                    Person Options
                </h2>

                <div className="flex flex-col gap-3">
                    {/* IDNUM input */}
                    <input
                        type="text"
                        placeholder="Enter ID Number"
                        value={idNum}
                        onChange={(e) => handleIdNumChange(e.target.value)}
                        className={`w-full p-3 rounded-lg bg-white/10 text-pink-300 placeholder-gray-300 outline-none
    ${error ? "border border-white-500 text-white-300" : ""}`}
                    />
                    
                    {/* Display error */}
                    {error && <p className="text-white-300 text-sm">{error}</p>}

                    {/* Login with IDNUM */}
                    <button
                        onClick={() => setMode("login")}
                        disabled={!idNum}
                        className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-white/20 transition font-semibold backdrop-blur-md disabled:opacity-50"
                    >
                        Login with ID Number
                    </button>

                    {/* Create new person */}
                    <button
                        onClick={() => setMode("create")}
                        className="w-full bg-green-600/70 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold backdrop-blur-md"
                    >
                        Create New Person
                    </button>

                    {/* Cancel */}
                    <button
                        onClick={onClose}
                        className="w-full bg-purple-600/70 text-white py-3 rounded-lg hover:bg-purple-600 transition font-semibold backdrop-blur-md"
                    >
                        See Others
                    </button>
                </div>
            </div>
        </div>
    );
}
