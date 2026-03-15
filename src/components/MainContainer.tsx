import React, { useState, useEffect, useCallback } from "react";
import { PreferedFamilyTreeSlider } from "./PreferedFamilyTreeSlider";
import FormPerson from "./other/FormPerson";
import { AnimatePresence, motion } from "framer-motion";
import { Person } from "@/person/personService";

export default function MainContainer() {
    const [personId, setPersonId] = useState<string | null>(null);
    const [showFormPerson, setShowFormPerson] = useState(true);
    const [people, setPeople] = useState<Person[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchPeople = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await fetch(`/api/persons/paginated-people?page=${page}&limit=5`);
            const data = await response.json();
            setPeople((prev) => [...prev, ...data.people]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
        } catch (error) {
            console.error("Failed to fetch people:", error);
        } finally {
            setLoading(false);
        }
    }, [page, hasMore, loading]);

    useEffect(() => {
        fetchPeople();
    }, [fetchPeople]);

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        ) {
            fetchPeople();
        }
    }, [fetchPeople]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <div className="w-full h-full flex">
            <PreferedFamilyTreeSlider
                personId={personId || ""} // Provide a fallback empty string
                componentName="PreferedFamilyTreeSlider"
                eventName="IdSubmitted"
                people={people}
            />

            {/* Modal */}
            <AnimatePresence>
                {showFormPerson && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFormPerson(false)} // backdrop click closes
                    >
                        <motion.div
                            className=" backdrop-blur-lg rounded-xl shadow-xl relative  w-full"
                            initial={{ y: -50, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()} // stop bubbling
                        >
                            <FormPerson
                                onClose={() => setShowFormPerson(false)}
                                onLogin={(idNum) => {
                                    setPersonId(idNum);
                                    setShowFormPerson(false);
                                }}
                                onCreate={(idNum) => {
                                    setPersonId(idNum);
                                    setShowFormPerson(false);
                                }}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
