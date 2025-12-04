'use client';

import { Sparkles, Calendar, Users } from 'lucide-react';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { FloatingElement } from '@/components/parallax/floating-element';
import { ParallaxMouse } from '@/components/parallax/parallax-mouse';
import { useTheme } from '@/components/providers/theme-provider';

export function FeaturesSection() {
    const { darkMode } = useTheme();

    return (
        <div className={`py-24 px-4 border-t ${darkMode ? 'bg-gradient-to-br from-zinc-950 to-red-950/20 border-amber-900/30' : 'bg-gradient-to-br from-stone-200 to-amber-100 border-stone-300/50'}`}>
            <div className="max-w-7xl mx-auto">
                <ScrollReveal direction="up" scale blur>
                    <h2 className={`text-5xl font-black text-center mb-4 uppercase tracking-tight ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Experience</h2>
                    <h3 className={`text-3xl font-light text-center mb-20 bg-gradient-to-r bg-clip-text text-transparent ${darkMode ? 'from-amber-400 to-red-500' : 'from-blue-600 to-red-600'}`}>The Digital Revolution</h3>
                </ScrollReveal>

                <div className="grid md:grid-cols-3 gap-8">
                    <ScrollReveal direction="left" delay={0.1} scale>
                        <div className="group">
                            <ParallaxMouse strength={10}>
                                <div className={`rounded-2xl p-8 h-full transition-all hover:shadow-xl shadow-lg ${darkMode ? 'bg-gradient-to-br from-amber-950/50 to-zinc-900 border-2 border-amber-800/50 hover:border-amber-600' : 'bg-gradient-to-br from-blue-100 to-white border-2 border-blue-300/50 hover:border-blue-500'}`}>
                                    <FloatingElement duration={3.5} yOffset={12}>
                                        <Sparkles className={`w-16 h-16 mb-6 ${darkMode ? 'text-amber-500' : 'text-blue-600'}`} />
                                    </FloatingElement>
                                    <h3 className={`text-2xl font-black mb-4 uppercase ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Chronicle Your Rides</h3>
                                    <p className={`leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
                                        Create your digital garage. Document every mile, every turn, and every memory in high fidelity.
                                    </p>
                                </div>
                            </ParallaxMouse>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="up" delay={0.2} scale>
                        <div className="group">
                            <ParallaxMouse strength={10}>
                                <div className={`rounded-2xl p-8 h-full transition-all hover:shadow-xl shadow-lg ${darkMode ? 'bg-gradient-to-br from-red-950/50 to-zinc-900 border-2 border-red-800/50 hover:border-red-600' : 'bg-gradient-to-br from-red-100 to-white border-2 border-red-300/50 hover:border-red-500'}`}>
                                    <FloatingElement duration={4} yOffset={15}>
                                        <Calendar className={`w-16 h-16 mb-6 ${darkMode ? 'text-red-500' : 'text-red-600'}`} />
                                    </FloatingElement>
                                    <h3 className={`text-2xl font-black mb-4 uppercase ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Ride Together</h3>
                                    <p className={`leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
                                        Find your next adventure. From breakfast runs to cross-country expeditions, never ride alone again.
                                    </p>
                                </div>
                            </ParallaxMouse>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal direction="right" delay={0.3} scale>
                        <div className="group">
                            <ParallaxMouse strength={10}>
                                <div className={`rounded-2xl p-8 h-full transition-all hover:shadow-xl shadow-lg ${darkMode ? 'bg-gradient-to-br from-zinc-800/50 to-zinc-900 border-2 border-zinc-700/50 hover:border-amber-500' : 'bg-gradient-to-br from-stone-100 to-white border-2 border-stone-300/50 hover:border-stone-500'}`}>
                                    <FloatingElement duration={3} yOffset={10}>
                                        <Users className={`w-16 h-16 mb-6 ${darkMode ? 'text-amber-400' : 'text-stone-700'}`} />
                                    </FloatingElement>
                                    <h3 className={`text-2xl font-black mb-4 uppercase ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Find Your Pack</h3>
                                    <p className={`leading-relaxed ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
                                        Connect with riders who share your machine and your mindset. Build your tribe, locally and globally.
                                    </p>
                                </div>
                            </ParallaxMouse>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </div>
    );
}
