'use client'
import SectionTitle from "../components/SectionTitle"
import { motion } from "motion/react";

export default function PricingSection() {
    const steps = [
        {
            title: "Create Profile",
            description: "Tell us about yourself, your college, budget, location and lifestyle.",
            buttonText: "Create Profile",
            link: "/register"
        },
        {
            title: "Set Preferences",
            description: "Choose your preferred budget, location, food, room type and lifestyle preferences.",
            buttonText: "Set Preferences",
            link: "/profile"
        },
        {
            title: "Find & Connect",
            description: "Discover compatible roommates and send connection requests.",
            buttonText: "Find Roommates",
            link: "/dashboard"
        }
    ];

    return (
        <div id="how-it-works" className="px-4 md:px-16 lg:px-24 xl:px-32 mt-20">
            <SectionTitle text1="HOW NESTMATE WORKS" text2="Simple Steps to Find Your Roommate" text3="We make it easy to find and connect with the right person." />

            <div className="flex flex-wrap items-stretch justify-center gap-8 mt-20">
                {steps.map((step, index) => (
                    <motion.div key={index} className="w-72 text-center border border-pink-950 p-6 pb-8 rounded-xl bg-pink-950/30 flex flex-col"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <p className="font-semibold text-xl mb-4 text-pink-400">{step.title}</p>
                        <p className="text-slate-300 flex-1">{step.description}</p>
                        <a href={step.link} className="w-full block py-2.5 rounded-md font-medium mt-7 transition-all bg-pink-500 hover:bg-pink-600 text-white">
                            {step.buttonText}
                        </a>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}