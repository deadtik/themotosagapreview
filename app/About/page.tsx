'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/toaster';
import { Sun, Moon, ChevronLeft, Heart, Users, Calendar, Handshake } from 'lucide-react';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_motocommunity/artifacts/tt95bhwq_image.png';

export default function AboutTheMotoSaga() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('darkMode');
      setDarkMode(saved === 'true');
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('darkMode', darkMode.toString());
    } catch (e) {}
  }, [darkMode, mounted]);

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-zinc-950 text-amber-50' : 'bg-stone-100 text-stone-900'}`}>
      <Toaster />

      <header className={`sticky top-0 z-40 backdrop-blur border-b ${darkMode ? 'bg-zinc-950/95 border-amber-900/20' : 'bg-stone-100/95 border-stone-300/50'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full overflow-hidden border-2 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
                <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
              </div>
              <span className={`font-black tracking-tight ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>The Moto Saga</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className={`inline-flex items-center gap-2 font-semibold ${darkMode ? 'text-amber-100' : 'text-stone-700'}`}>
              <ChevronLeft className="w-4 h-4" /> Back
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className={darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-stone-700 hover:text-stone-900'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="max-w-4xl mx-auto text-center mb-12">
          <div className={`w-32 h-32 rounded-full overflow-hidden border-4 mx-auto mb-6 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
            <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
          </div>

          <h1 className={`text-5xl md:text-6xl font-black mb-4 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>
            About <span className={`bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-amber-400 to-red-500' : 'from-blue-600 to-red-600'}`}>The Moto Saga</span>
          </h1>

          <p className={`text-lg md:text-xl max-w-2xl mx-auto ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
            A community for every rider — from weekend explorers to track-day fanatics. We bring people together through rides, stories, events and collaboration with leading brands.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Button className={`font-bold px-6 ${darkMode ? 'bg-gradient-to-r from-amber-600 to-red-700' : 'bg-gradient-to-r from-blue-600 to-red-600'} text-white`}>
              Join The Saga
            </Button>
            <Button variant="outline" className={darkMode ? 'border-amber-600 text-amber-200' : 'border-stone-400 text-stone-700'}>
              Explore Events
            </Button>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className={`rounded-2xl p-8 ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-200/60'}`}>
            <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Our Mission</h3>
            <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>
              To make riding accessible, inclusive and joyful. We build tools for riders to share stories, organize events and find their tribe.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 mt-1 text-red-500" />
                <div>
                  <p className="font-semibold">Community First</p>
                  <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>Everything we do is to strengthen rider connections.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 mt-1 text-blue-500" />
                <div>
                  <p className="font-semibold">Events That Matter</p>
                  <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>From grassroots rides to curated track days.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Handshake className="w-5 h-5 mt-1 text-amber-500" />
                <div>
                  <p className="font-semibold">Brand Partnerships</p>
                  <p className={`text-sm ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>We work with top motorcycle brands to bring exclusive experiences.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-8 ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-200/60'}`}>
            <h3 className={`text-2xl font-black mb-4 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Who We Are</h3>
            <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>
              A small team of riders, designers and engineers building a home for riders in India and beyond.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{
                name: 'Arjun', role: 'Co-founder', img: ''
              },{
                name: 'Priya', role: 'Head of Community', img: ''
              },{
                name: 'Vikram', role: 'Product', img: ''
              },{
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

      <footer className={`py-8 border-t ${darkMode ? 'border-amber-900/20' : 'border-stone-200/40'}`}>
        <div className="container mx-auto px-4 text-center">
          <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>© {new Date().getFullYear()} The Moto Saga — Ride together, rise together.</p>
        </div>
      </footer>
    </div>
  );
}
