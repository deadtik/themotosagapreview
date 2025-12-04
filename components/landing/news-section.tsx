'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { useTheme } from '@/components/providers/theme-provider';
import { MOCK_NEWS } from '@/lib/mock-data';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

export function NewsSection() {
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
        <div className={`py-24 px-4 border-t ${darkMode ? 'bg-gradient-to-br from-zinc-950 to-amber-950/20 border-amber-900/30' : 'bg-gradient-to-br from-amber-50 to-stone-100 border-stone-300/50'}`}>
            <div className="max-w-7xl mx-auto">
                <ScrollReveal direction="left" scale>
                    <div className="flex items-center justify-between mb-12 px-4">
                        <div className="flex items-center gap-3">
                            <Newspaper className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-blue-600'}`} />
                            <div>
                                <h2 className={`text-4xl font-black uppercase tracking-tight ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Latest Moto News</h2>
                                <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>Stay updated with the riding world</p>
                            </div>
                        </div>
                        {/* Counter */}
                        <div className={`text-xl font-mono font-bold ${darkMode ? 'text-zinc-500' : 'text-stone-400'}`}>
                            {String(current + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
                        </div>
                    </div>
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
                            {MOCK_NEWS.map((news, idx) => (
                                <CarouselItem key={news.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3 transition-all duration-500 ease-out"
                                    style={{
                                        transform: idx === current ? 'scale(1)' : 'scale(0.85)',
                                        opacity: idx === current ? 1 : 0.5,
                                        zIndex: idx === current ? 10 : 0,
                                        filter: idx === current ? 'none' : 'blur(1px)',
                                    }}
                                >
                                    <div className="group relative h-[450px] overflow-hidden rounded-2xl cursor-pointer shadow-2xl">
                                        {/* Image Background */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={news.image}
                                                alt={news.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className={`absolute inset-0 bg-gradient-to-t ${darkMode ? 'from-black/90 via-black/50 to-transparent' : 'from-black/80 via-black/40 to-transparent'}`} />
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="relative h-full flex flex-col justify-end p-6 text-white">
                                            <Badge className="mb-3 w-fit bg-blue-600 hover:bg-blue-700 border-none text-white">
                                                {news.category}
                                            </Badge>

                                            <div className="space-y-2 transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
                                                <div className="flex items-center gap-2 text-xs text-stone-300 font-medium">
                                                    <span>{news.source}</span>
                                                    <span>•</span>
                                                    <span>{new Date(news.date).toLocaleDateString()}</span>
                                                </div>

                                                <h3 className="text-2xl font-black leading-tight mb-2">{news.title}</h3>

                                                <p className="text-sm text-stone-300 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                                    {news.excerpt}
                                                </p>

                                                <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black transition-colors">
                                                        Read Article <ChevronRight className="w-4 h-4 ml-1" />
                                                    </Button>
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
