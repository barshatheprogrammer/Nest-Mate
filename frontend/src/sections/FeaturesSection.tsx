'use client'
import SectionTitle from "../components/SectionTitle";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { featuresData } from "../data/features";
import type { IFeature } from "../types";

export default function FeaturesSection() {
    return (
        <div id="features" className="px-4 md:px-16 lg:px-24 xl:px-32">
            <SectionTitle text1="How It Works" text2="How NestMate Works" text3="Find your ideal flat and match with compatible roommates in just 4 simple steps." />
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-16 px-6">
                {featuresData.map((feature: IFeature, index: number) => (
                    <motion.div key={index} className={`${index === 1 ? 'p-px rounded-[13px] bg-linear-to-br from-pink-600 to-slate-800' : ''}`}
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        <div className="p-6 rounded-xl space-y-4 border border-slate-800 bg-slate-950 max-w-80 w-full">
                            {feature.icon}
                            <h3 className="text-base font-medium text-white">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 line-clamp-2 pb-4">
                                {feature.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
            <div className="mt-40 relative mx-auto max-w-5xl">
                <div className="absolute -z-50 size-100 -top-10 -left-20 aspect-square rounded-full bg-pink-500/40 blur-3xl"></div>
                <motion.p className="text-slate-300 text-lg text-left max-w-3xl"
                    initial={{ y: 150, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                >
                    NestMate helps students discover potential roommates based on budget, location, food preferences, study schedule, sleep habits, cleanliness, and lifestyle.
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10">
                    <motion.div className="md:col-span-2"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 240, damping: 70, mass: 1 }}
                    >
                        <img className="h-full w-auto" src="/assets/features-showcase-1.png" alt="features showcase" width={1000} height={500} />
                    </motion.div>
                    <motion.div className="md:col-span-1"
                        initial={{ y: 150, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 70, mass: 1 }}
                    >
                        {/* Custom UI Card for Compatibility */}
                        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl hover:-translate-y-0.5 transition duration-300">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-white font-medium">Compatibility</h4>
                                <span className="bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded-full">92%</span>
                            </div>
                            <p className="text-slate-300 text-sm mb-4">You and Ananya are highly compatible.</p>
                            <ul className="space-y-2 text-sm text-slate-400">
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Same location</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Similar budget</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Non-smoker</li>
                                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Similar study schedule</li>
                            </ul>
                        </div>
                        <h3 className="text-[24px]/7.5 text-slate-300 font-medium mt-6">Find Someone Who Matches Your Lifestyle</h3>
                        <p className="text-slate-400 mt-2">Connect with students who share your habits and preferences.</p>
                        <a href="#how-it-works" className="group flex items-center gap-2 mt-4 text-pink-600 hover:text-pink-700 transition">
                            Learn more about our matching
                            <ArrowUpRight className="size-5 group-hover:translate-x-0.5 transition duration-300" />
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}