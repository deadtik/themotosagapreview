'use client';

import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { useTheme } from '@/components/providers/theme-provider';

interface CTASectionProps {
    onSignup: () => void;
}

export function CTASection({ onSignup }: CTASectionProps) {
    const { darkMode } = useTheme();

    return (
        <div className={`py-24 px-4 border-t ${darkMode ? 'bg-gradient-to-br from-red-950/30 via-zinc-950 to-amber-950/30 border-amber-900/30' : 'bg-gradient-to-br from-blue-100/50 via-stone-50 to-red-100/50 border-stone-300/50'}`}>
            <div className="max-w-4xl mx-auto text-center">
                <ScrollReveal direction="up" scale blur>
                    <h2 className={`text-5xl font-black mb-6 uppercase ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>The Road is Calling</h2>
                    <p className={`text-xl mb-10 ${darkMode ? 'text-zinc-400' : 'text-stone-700'}`}>Join thousands of riders documenting their journey on The Moto Saga</p>
                </ScrollReveal>
                <ScrollReveal direction="up" delay={0.2} scale>
                    <Button
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 text-white px-12 py-8 text-2xl font-black uppercase shadow-2xl shadow-blue-900/50 transition-all hover:scale-105"
                        onClick={onSignup}
                    >
                        Join The Saga Now
                    </Button>
                </ScrollReveal>
            </div>
        </div>
    );
}
