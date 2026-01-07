import React, { useState } from "react";
import { FamilyTreeSlider } from "../features/family-tree/components/FamilyTreeSlider";
import FormPerson from "./other/FormPerson";
import { AnimatePresence, motion } from "framer-motion";

export default function MainContainer() {
    const [personId, setPersonId] = useState<string>("AFEGATH"); // active person ID
    const [showFormPerson, setShowFormPerson] = useState(true);

    return (
        <div className="w-full h-full flex">
            <FamilyTreeSlider
                personId={personId}
                componentName="PreferedFamilyTreeSlider"
                eventName="IdSubmitted"
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
