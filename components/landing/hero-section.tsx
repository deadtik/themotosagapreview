'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { ParallaxSection } from '@/components/parallax/parallax-section';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { FloatingElement } from '@/components/parallax/floating-element';
import { ParallaxMouse } from '@/components/parallax/parallax-mouse';
import { VideoBackground } from '@/components/ui/video-background';
import { useTheme } from '@/components/providers/theme-provider';
import { LOGO_URL } from '@/lib/mock-data';

interface HeroSectionProps {
    onSignup: () => void;
}

export function HeroSection({ onSignup }: HeroSectionProps) {
    const { darkMode } = useTheme();

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Video Background */}
            <VideoBackground
                videoSrc="/landingpagevideo.mp4"
                overlayOpacity={darkMode ? 0.7 : 0.6}
                className="z-0"
            />

            {/* Parallax Gradient Overlay */}
            <ParallaxSection speed={0.3} className="absolute inset-0 pointer-events-none z-10">
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-red-950/30 via-transparent to-amber-950/30' : 'bg-gradient-to-br from-blue-100/20 via-transparent to-red-100/20'}`} />
            </ParallaxSection>

            {/* Dot Pattern Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10" style={{
                backgroundImage: darkMode
                    ? 'radial-gradient(circle at 2px 2px, rgba(251, 191, 36, 0.05) 1px, transparent 0)'
                    : 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.08) 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }} />

            <div className="relative z-20 text-center px-4 max-w-6xl">
                <ScrollReveal direction="down" scale blur>
                    <div className="mb-8">
                        <ParallaxMouse strength={15}>
                            <FloatingElement duration={4} yOffset={15}>
                                <div className={`w-40 h-40 rounded-full overflow-hidden border-4 mx-auto mb-8 shadow-2xl ${darkMode ? 'bg-amber-900/20 border-amber-600 shadow-amber-900/50' : 'bg-stone-100 border-blue-500 shadow-blue-900/50'}`}>
                                    <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
                                </div>
                            </FloatingElement>
                        </ParallaxMouse>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.2} scale>
                    <h1 className={`text-4xl md:text-8xl font-black mb-6 tracking-tight leading-tight ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>
                        THE PULSE OF <span className={`bg-gradient-to-r bg-clip-text text-transparent ${darkMode ? 'from-amber-400 to-red-500' : 'from-blue-600 to-red-600'}`}> MOTORCYCLING</span>
                    </h1>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.4}>
                    <div className="max-w-3xl mx-auto space-y-4 mb-12">
                        <p className={`text-lg md:text-3xl font-light ${darkMode ? 'text-amber-100' : 'text-stone-700'}`}>
                            Your journey. Your stories. Your tribe.
                        </p>
                        <p className={`text-base md:text-xl ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
                            The ultimate digital home for every rider. Connect, share, and ride as one.
                        </p>
                    </div>
                </ScrollReveal>

                <ScrollReveal direction="up" delay={0.6} scale>
                    <div className="flex gap-4 justify-center flex-wrap">
                        <Button
                            size="lg"
                            className={`font-bold px-6 py-6 md:px-10 md:py-7 text-lg md:text-xl font-black uppercase shadow-xl transition-all hover:scale-105 ${darkMode ? 'bg-gradient-to-r from-amber-600 to-blue-700 hover:from-amber-700 hover:to-blue-800 shadow-amber-900/50' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-900/50'} text-white`}
                            onClick={onSignup}
                        >
                            Start Your Saga <ChevronRight className="ml-2" />
                        </Button>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
}
