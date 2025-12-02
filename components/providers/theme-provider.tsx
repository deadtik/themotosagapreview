'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeContextType = {
    darkMode: boolean;
    toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
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
            if (darkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        } catch (e) { }
    }, [darkMode, mounted]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Prevent hydration mismatch by not rendering children until mounted, 
    // OR render them but with a default theme. 
    // Better to render to avoid layout shift, but we need to know the theme.
    // For now, let's just render.

    return (
        <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
