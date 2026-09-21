import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

export default function TiltedImage({ rotateAmplitude = 3, }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

    const [lastY, setLastY] = useState(0);

    function handleMouse(e: any) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }

    function handleMouseLeave() {
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    }

    return (
        <motion.figure ref={ref} className="relative w-full h-full perspective-midrange mt-16 max-w-4xl mx-auto flex flex-col items-center justify-center" onMouseMove={handleMouse} onMouseLeave={handleMouseLeave}
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 320, damping: 70, mass: 1 }}
        >
            <motion.div className="relative transform-3d w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl" style={{ rotateX, rotateY }} >
                {/* Mockup Topbar */}
                <div className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-white/80 font-medium">NestMate</div>
                    <div className="text-sm bg-pink-500/20 text-pink-400 px-3 py-1 rounded-full">Recommended Roommates</div>
                </div>
                
                {/* Mockup Content */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-900/20 via-black to-black">
                    {/* Card 1 */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500"></div>
                                <div>
                                    <h3 className="text-white font-medium text-lg">Ananya Sharma</h3>
                                    <p className="text-white/50 text-sm">Chandigarh University</p>
                                </div>
                            </div>
                            <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-md font-medium border border-green-500/30">
                                92% Compatible
                            </div>
                        </div>
                        <div className="text-white/70 text-sm mb-6 flex-1">
                            Budget: ₹6,000 - ₹8,000<br/>
                            Looking for: 2 Sharing<br/>
                            Non-smoker, Early bird
                        </div>
                        <div className="flex gap-3 mt-auto">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 text-sm transition-colors border border-white/10">View Profile</button>
                            <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg py-2 text-sm transition-colors shadow-lg shadow-pink-500/20">Connect</button>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col hover:bg-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500"></div>
                                <div>
                                    <h3 className="text-white font-medium text-lg">Rahul Mehta</h3>
                                    <p className="text-white/50 text-sm">Punjab University</p>
                                </div>
                            </div>
                            <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-md font-medium border border-green-500/30">
                                87% Compatible
                            </div>
                        </div>
                        <div className="text-white/70 text-sm mb-6 flex-1">
                            Budget: ₹7,000 - ₹9,000<br/>
                            Looking for: Single Room<br/>
                            Vegetarian, Night owl
                        </div>
                        <div className="flex gap-3 mt-auto">
                            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 text-sm transition-colors border border-white/10">View Profile</button>
                            <button className="flex-1 bg-pink-600 hover:bg-pink-700 text-white rounded-lg py-2 text-sm transition-colors shadow-lg shadow-pink-500/20">Connect</button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.figure>
    );
}