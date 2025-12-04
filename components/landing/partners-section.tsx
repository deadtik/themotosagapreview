'use client';

import { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { useTheme } from '@/components/providers/theme-provider';
import { BRAND_PARTNERS } from '@/lib/mock-data';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

export function PartnersSection() {
    const { darkMode } = useTheme();
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className={`py-24 px-4 border-t ${darkMode ? 'bg-gradient-to-br from-zinc-950 to-amber-950/20 border-amber-900/30' : 'bg-gradient-to-br from-stone-100 to-amber-50 border-stone-300/50'}`}>
            <div className="max-w-7xl mx-auto">
                <ScrollReveal direction="up" scale>
                    <div className="flex items-center justify-between mb-12 px-4">
                        <div className="flex items-center gap-3">
                            <Handshake className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-blue-600'}`} />
                            <h2 className={`text-4xl font-black uppercase tracking-tight ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Brand Partners</h2>
                        </div>
                        {/* Counter */}
                        <div className={`text-xl font-mono font-bold ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                            {String(current + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
                        </div>
                    </div>
                    <p className={`text-center mb-12 text-lg ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>Collaborating with India's leading motorcycle brands</p>
                </ScrollReveal>

                <div className="px-12 relative">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "center",
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 3000,
                                stopOnMouseEnter: true,
                            }),
                        ]}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 items-center">
                            {BRAND_PARTNERS.map((brand, idx) => (
                                <CarouselItem key={idx} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 transition-all duration-500 ease-out"
                                    style={{
                                        transform: idx === current ? 'scale(1)' : 'scale(0.85)',
                                        opacity: idx === current ? 1 : 0.5,
                                        zIndex: idx === current ? 10 : 0,
                                        filter: idx === current ? 'none' : 'blur(1px)',
                                    }}
                                >
                                    <div className="group relative h-[450px] overflow-hidden rounded-2xl cursor-pointer shadow-2xl">
                                        {/* Card Background - Using a gradient since we don't have unique bg images */}
                                        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-zinc-900 to-zinc-950' : 'bg-gradient-to-br from-stone-100 to-stone-200'}`}>
                                            {/* Subtle pattern or texture could go here */}
                                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
                                        </div>

                                        {/* Logo Container - Centered */}
                                        <div className="absolute inset-0 flex items-center justify-center p-12">
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-black/90 via-black/40 to-transparent' : 'from-stone-900/80 via-transparent to-transparent'}`} />

                                        {/* Content Overlay */}
                                        <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                            <div className="space-y-2 transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                                                <h3 className="text-3xl font-black leading-tight mb-2 uppercase tracking-wide text-center">{brand.name}</h3>

                                                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 flex justify-center">
                                                    <span className="text-sm font-medium text-stone-300 uppercase tracking-widest border-b border-amber-500 pb-1">View Collection</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: count }).map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => api?.scrollTo(idx)}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === current ? (darkMode ? 'w-8 bg-amber-500' : 'w-8 bg-blue-600') : (darkMode ? 'w-2 bg-zinc-700' : 'w-2 bg-stone-300')}`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
