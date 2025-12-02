'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_motocommunity/artifacts/tt95bhwq_image.png';

export function SiteHeader() {
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, setAuthMode, setShowAuthDialog } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className={`sticky top-0 left-0 right-0 z-50 border-b ${isMobileMenuOpen ? '' : 'backdrop-blur'} ${darkMode ? 'bg-zinc-950/95 border-amber-900/20' : 'bg-stone-100/95 border-stone-300/50'}`}>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
                            <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
                        </div>
                        {/* Optional: Add text logo if needed, but image might be enough */}
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDarkMode}
                        className={darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-stone-700 hover:text-stone-900'}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className={`font-semibold ${darkMode ? 'text-amber-100 hover:text-amber-400' : 'text-stone-700 hover:text-blue-600'}`}
                    >
                        <Link href="/About">
                            About Us
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className={`font-semibold ${darkMode ? 'text-amber-100 hover:text-amber-400' : 'text-stone-700 hover:text-blue-600'}`}
                    >
                        <Link href="/Contact">
                            Contact
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="ghost"
                        className={`font-semibold ${darkMode ? 'text-amber-100 hover:text-amber-400' : 'text-stone-700 hover:text-blue-600'}`}
                    >
                        <Link href="/events">
                            Events
                        </Link>
                    </Button>

                    {!user && (
                        <Button
                            variant="ghost"
                            className={`font-semibold ${darkMode ? 'text-amber-100 hover:text-amber-400' : 'text-stone-700 hover:text-blue-600'}`}
                            onClick={() => { setAuthMode('login'); setShowAuthDialog(true); }}
                        >
                            Sign In
                        </Button>
                    )}

                    {!user && (
                        <Button
                            className={`font-bold px-6 shadow-lg ${darkMode ? 'bg-gradient-to-r from-amber-600 to-red-700 hover:from-amber-700 hover:to-red-800 shadow-amber-900/50' : 'bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 shadow-blue-900/50'} text-white`}
                            onClick={() => { setAuthMode('signup'); setShowAuthDialog(true); }}
                        >
                            Join Now
                        </Button>
                    )}

                    {user && (
                        <div className="flex items-center gap-2">
                            <span className={`font-semibold ${darkMode ? 'text-amber-100' : 'text-stone-700'}`}>
                                Hi, {user.name?.split(' ')[0] || 'Rider'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDarkMode}
                        className={darkMode ? 'text-amber-400' : 'text-stone-700'}
                    >
                        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={darkMode ? 'text-amber-100' : 'text-stone-900'}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </Button>
                </div>
                {/* Mobile Navigation Overlay */}
                {isMobileMenuOpen && (
                    <div className={`fixed inset-0 z-50 flex flex-col ${darkMode ? 'bg-gradient-to-br from-zinc-950 via-red-950/30 to-zinc-950' : 'bg-gradient-to-br from-stone-200 via-amber-50 to-stone-100'}`}>
                        {/* Header inside overlay for close button */}
                        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
                                    <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={darkMode ? 'text-amber-100 hover:bg-white/10' : 'text-stone-900 hover:bg-black/5'}
                            >
                                <X className="w-8 h-8" />
                            </Button>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 flex flex-col items-center justify-center gap-8 p-8 animate-in fade-in slide-in-from-bottom-10 duration-300">
                            <Link href="/About" onClick={() => setIsMobileMenuOpen(false)}>
                                <span className={`text-3xl font-black uppercase tracking-tight hover:scale-110 transition-transform block ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>About Us</span>
                            </Link>
                            <Link href="/Contact" onClick={() => setIsMobileMenuOpen(false)}>
                                <span className={`text-3xl font-black uppercase tracking-tight hover:scale-110 transition-transform block ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Contact</span>
                            </Link>
                            <Link href="/events" onClick={() => setIsMobileMenuOpen(false)}>
                                <span className={`text-3xl font-black uppercase tracking-tight hover:scale-110 transition-transform block ${darkMode ? 'text-amber-50' : 'text-stone-900'}`}>Events</span>
                            </Link>

                            {!user ? (
                                <div className="flex flex-col gap-4 mt-8 w-full max-w-xs">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className={`w-full font-bold text-xl py-6 ${darkMode ? 'border-amber-600 text-amber-100 hover:bg-amber-900/20' : 'border-stone-400 text-stone-700'}`}
                                        onClick={() => { setIsMobileMenuOpen(false); setAuthMode('login'); setShowAuthDialog(true); }}
                                    >
                                        Sign In
                                    </Button>
                                    <Button
                                        size="lg"
                                        className="w-full font-bold text-xl py-6 bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-xl"
                                        onClick={() => { setIsMobileMenuOpen(false); setAuthMode('signup'); setShowAuthDialog(true); }}
                                    >
                                        Join Now
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-6 mt-4">
                                    <p className={`text-lg font-medium ${darkMode ? 'text-stone-400' : 'text-stone-500'}`}>
                                        Signed in as <span className={darkMode ? 'text-amber-400' : 'text-blue-600'}>{user.name}</span>
                                    </p>
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                        <Button size="lg" className={`font-bold text-lg px-8 ${darkMode ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-white text-stone-900 border border-stone-200'}`}>
                                            My Profile
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav >
    );
}
