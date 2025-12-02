'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/providers/theme-provider';
import { useAuth } from '@/components/providers/auth-provider';

const LOGO_URL = 'https://customer-assets.emergentagent.com/job_motocommunity/artifacts/tt95bhwq_image.png';

export function SiteHeader() {
    const { darkMode, toggleDarkMode } = useTheme();
    const { user, setAuthMode, setShowAuthDialog } = useAuth();

    return (
        <nav className={`sticky top-0 left-0 right-0 z-50 backdrop-blur border-b ${darkMode ? 'bg-zinc-950/95 border-amber-900/20' : 'bg-stone-100/95 border-stone-300/50'}`}>
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${darkMode ? 'bg-amber-900/20 border-amber-600' : 'bg-stone-100 border-blue-500'}`}>
                            <img src={LOGO_URL} alt="The Moto Saga" className="w-full h-full object-cover" />
                        </div>
                        {/* Optional: Add text logo if needed, but image might be enough */}
                    </Link>
                </div>

                <div className="flex items-center gap-4">
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
            </div>
        </nav>
    );
}
