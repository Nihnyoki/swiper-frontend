import React, { useState, useEffect, useCallback, useRef } from "react";
import { PreferedFamilyTreeSlider } from "./PreferedFamilyTreeSlider";
import FormPerson from "./other/FormPerson";
import { AnimatePresence, motion } from "framer-motion";
import { Person } from "@/person/personService";
import { backendFetch } from "@/lib/backend";

const PAGE_LIMIT = 2; // Increased from 3 to reduce round-trips

export default function MainContainer() {
    const [personId, setPersonId] = useState<string | null>(null);
    const [showFormPerson, setShowFormPerson] = useState(true);
    const [people, setPeople] = useState<Person[]>([]);

    // Use refs for pagination state to avoid stale closures and re-fetch loops
    const pageRef = useRef(1);
    const hasMoreRef = useRef(true);
    const loadingRef = useRef(false);

    const fetchPeople = useCallback(async () => {
        if (loadingRef.current || !hasMoreRef.current) return;
        loadingRef.current = true;
        try {
            const response = await backendFetch(
                `/api/persons/paginated-people?page=${pageRef.current}&limit=${PAGE_LIMIT}`
            );
            const data = await response.json();

            if (Array.isArray(data.data)) {
                const processedPeople = data.data.map((person) => {
                    return {
                        ...person,
                        THINGS: person.THINGS.map((thing) => ({
                            ...thing,
                            childItems: thing.childItems.map((child) => ({
                                ...child,
                                data: child.data || [],
                            })),
                        })),
                    };
                });
                setPeople((prev) => [...prev, ...processedPeople]);
            } else {
                console.error("Unexpected response structure:", data);
            }

            hasMoreRef.current = data.page < Math.ceil(data.total / data.limit);
            pageRef.current += 1;
        } catch (error) {
            console.error("Failed to fetch people:", error);
        } finally {
            loadingRef.current = false;
        }
    }, []); // ✅ No changing deps — refs keep state stable

    // Initial fetch — runs once on mount
    useEffect(() => {
        fetchPeople();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Throttled scroll handler using IntersectionObserver for better performance
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) fetchPeople();
            },
            { threshold: 0.1 }
        );
        if (sentinelRef.current) observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [fetchPeople]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Sentinel div for IntersectionObserver-based infinite scroll */}
            <div ref={sentinelRef} className="h-1 w-full" />
            <PreferedFamilyTreeSlider
                personId={personId || ""}
                componentName="PreferedFamilyTreeSlider"
                eventName="IdSubmitted"
                people={people}
                onRequestMorePeople={fetchPeople}
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
