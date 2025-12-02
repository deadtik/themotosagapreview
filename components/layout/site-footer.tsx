'use client';

import { useTheme } from '@/components/providers/theme-provider';

export function SiteFooter() {
    const { darkMode } = useTheme();

    return (
        <footer className={`py-8 border-t ${darkMode ? 'bg-zinc-950 border-amber-900/20' : 'bg-stone-100 border-stone-200/40'}`}>
            <div className="container mx-auto px-4 text-center">
                <p className={darkMode ? 'text-zinc-400' : 'text-stone-600'}>
                    © {new Date().getFullYear()} The Moto Saga — Ride together, rise together.
                </p>
            </div>
        </footer>
    );
}
