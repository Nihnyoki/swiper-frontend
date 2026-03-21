import React, { useEffect, useState } from "react";
import { Person } from "@/person/personService";
import { api } from "@/lib/backend";

interface LoginFormPersonProps {
    idNum: string;
    onSubmit: (idNum: string) => void;
    onError: (error: string) => void;
    onClose: () => void;
}

export default function LoginFormPerson({ idNum, onSubmit, onError, onClose }: LoginFormPersonProps) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!idNum) return;

        const checkPerson = async () => {
            setLoading(true);
            try {
                const response = await api.get<Person>(`/api/persons/${idNum}/with-children`);
                const person = response.data;

                if (!person || !person.IDNUM) {
                    // Person not found → show error, **do not close**
                    onError(`Person with IDNUM ${idNum} not found`);
                } else {
                    // Person exists → submit and close
                    onSubmit(person.IDNUM);
                    onClose();
                }
            } catch (err) {
                console.error("Failed to fetch person:", err);
                onError(`Failed to fetch person with IDNUM ${idNum}`);
            } finally {
                setLoading(false);
            }
        };

        checkPerson();
    }, [idNum]);

    return null;
}
