'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toaster';
import { Sun, Moon, ChevronLeft, Heart, Users, Calendar, Handshake } from 'lucide-react';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { FloatingElement } from '@/components/parallax/floating-element';
import { useTheme } from '@/components/providers/theme-provider';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_motocommunity/artifacts/tt95bhwq_image.png';

export default function AboutTheMotoSaga() {
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-zinc-950 text-amber-50' : 'bg-stone-100 text-stone-900'}`}>
      <Toaster />



      <main className="container mx-auto px-4 py-16">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <ScrollReveal direction="up" delay={0.1}>
            <FloatingElement duration={4} yOffset={10}>
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 mx-auto mb-6 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
                <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
              </div>
            </FloatingElement>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className={`text-3xl md:text-6xl font-black mb-4 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>
              The Pulse of <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-amber-400 to-red-500' : 'from-blue-600 to-red-600'}`}>Indian Motorcycling</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
              We are the digital home for every rider. A platform built to connect the fragmented world of motorcycling into one unified, pulsating community.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Button className={`font-bold px-6 ${darkMode ? 'bg-gradient-to-r from-amber-600 to-red-700' : 'bg-gradient-to-r from-blue-600 to-red-600'} text-white`}>
                Join The Saga
              </Button>
              <Button variant="outline" className={darkMode ? 'border-amber-600 text-amber-200' : 'border-stone-400 text-stone-700'}>
                Explore Events
              </Button>
            </div>
          </ScrollReveal>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <ScrollReveal direction="up" delay={0}>
            <div className={`rounded-2xl p-8 ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-200/60'}`}>
              <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Our Mission</h3>
              <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>
                To bridge the gap between digital connection and physical adventure. We empower riders to find their pack, share their journey, and ride more.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 mt-1 text-red-500" />
                  <div>
                    <p className="font-semibold">Authenticity First</p>
                    <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>Real stories from real riders. No filters, just the road.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 mt-1 text-blue-500" />
                  <div>
                    <p className="font-semibold">Unity in Diversity</p>
                    <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>All bikes, all riders, one passion. We leave judgment at the door.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Handshake className="w-5 h-5 mt-1 text-amber-500" />
                  <div>
                    <p className="font-semibold">Safety & Respect</p>
                    <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>Promoting responsible riding culture and mutual respect on the road.</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.15}>
            <div className={`rounded-2xl p-8 ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-200/60'}`}>
              <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Who We Are</h3>
              <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>
                A team of tech-savvy riders building the platform we always wished existed. We code by day and ride by night.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{
                  name: 'Arjun', role: 'Co-founder', img: ''
                }, {
                  name: 'Priya', role: 'Head of Community', img: ''
                }, {
                  name: 'Vikram', role: 'Product', img: ''
                }, {
                  name: 'Meera', role: 'Design', img: ''
                }].map((member, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${darkMode ? 'bg-zinc-800/30' : 'bg-stone-50'}`}>
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.img || undefined} />
                      <AvatarFallback className={darkMode ? 'bg-amber-600 text-zinc-900' : 'bg-blue-600 text-white'}>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{member.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        <section className="mb-12">
          <h3 className={`text-3xl font-black mb-6 text-center ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Partners</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 items-center">
            {['Royal Enfield', 'Kawasaki', 'KTM', 'BMW Motorrad', 'Harley-Davidson'].map((b, i) => (
              <div key={i} className={`rounded-xl p-6 flex items-center justify-center ${darkMode ? 'bg-zinc-900/30 border border-amber-800/20' : 'bg-white border border-stone-200/40'}`}>
                <div className="w-24 h-24 rounded-lg overflow-hidden flex items-center justify-center">
                  <img src={`https://via.placeholder.com/160x100?text=${encodeURIComponent(b)}`} alt={b} className="object-contain" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto text-center">
          <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Want to help build this community?</h3>
          <p className={`mb-6 ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>We welcome contributors — riders, developers, creators and brand partners. Reach out and let’s ride together.</p>
          <div className="flex justify-center gap-4">
            <Button className={`px-6 font-bold ${darkMode ? 'bg-amber-600 text-zinc-900' : 'bg-blue-600 text-white'}`}>Get Involved</Button>
            <Button variant="outline" className={darkMode ? 'border-amber-600 text-amber-200' : 'border-stone-400 text-stone-700'}>Contact Us</Button>
          </div>
        </section>

      </main>


    </div>
  );
}
