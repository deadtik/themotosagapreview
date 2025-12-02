'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Toaster } from '@/components/ui/toaster';
import { Sun, Moon, ChevronLeft, Mail, Phone, MapPin } from 'lucide-react';
import { ScrollReveal } from '@/components/parallax/scroll-reveal';
import { FloatingElement } from '@/components/parallax/floating-element';
import { useTheme } from '@/components/providers/theme-provider';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_motocommunity/artifacts/tt95bhwq_image.png';

export default function ContactPage() {
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [form, setForm] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-zinc-950 text-amber-50' : 'bg-stone-100 text-stone-900'}`}>
      <Toaster />

      {/* HEADER */}


      {/* MAIN */}
      <main className="container mx-auto px-4 py-16 max-w-3xl">
        <h1 className={`text-5xl font-black text-center mb-6 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Contact Us</h1>
        <p className={`text-center mb-12 text-lg ${darkMode ? 'text-zinc-400' : 'text-stone-600'}`}>
          We’d love to hear from you. Whether you're a rider, a brand, or a creator — let’s connect.
        </p>

        {/* CONTACT CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-300/50'}`}>
            <Mail className={`w-8 h-8 mx-auto mb-3 ${darkMode ? 'text-amber-400' : 'text-blue-600'}`} />
            <h3 className="font-bold mb-1">Email</h3>
            <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>support@thematosaga.com</p>
          </div>

          <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-300/50'}`}>
            <Phone className={`w-8 h-8 mx-auto mb-3 ${darkMode ? 'text-amber-400' : 'text-blue-600'}`} />
            <h3 className="font-bold mb-1">Phone</h3>
            <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>+91 90000 00000</p>
          </div>

          <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-300/50'}`}>
            <MapPin className={`w-8 h-8 mx-auto mb-3 ${darkMode ? 'text-amber-400' : 'text-blue-600'}`} />
            <h3 className="font-bold mb-1">Location</h3>
            <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>Mumbai, India</p>
          </div>
        </div>

        {/* FORM */}
        <div className={`p-8 rounded-2xl ${darkMode ? 'bg-zinc-900/40 border border-amber-800/30' : 'bg-white border border-stone-300/50'}`}>
          <h2 className={`text-2xl font-black mb-6 ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Send us a message</h2>

          <div className="space-y-4">
            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={darkMode ? 'bg-zinc-900 border-stone-800 text-white' : ''}
            />

            <Input
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={darkMode ? 'bg-zinc-900 border-stone-800 text-white' : ''}
            />

            <Textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={darkMode ? 'bg-zinc-900 border-stone-800 text-white' : 'min-h-32'}
            />
          </div>

          <Button className={`w-full mt-6 font-bold uppercase ${darkMode ? 'bg-gradient-to-r from-amber-600 to-red-700 text-white' : 'bg-gradient-to-r from-blue-600 to-red-600 text-white'}`}>
            Send Message
          </Button>
        </div>
      </main>

      {/* FOOTER */}

    </div>
  );
}
