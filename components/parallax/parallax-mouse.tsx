'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, ReactNode } from 'react';

interface ParallaxMouseProps {
    children: ReactNode;
    strength?: number;
    className?: string;
}

export function ParallaxMouse({ children, strength = 20, className = '' }: ParallaxMouseProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-strength, strength]), springConfig);
    const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-strength, strength]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            mouseX.set(clientX / innerWidth - 0.5);
            mouseY.set(clientY / innerHeight - 0.5);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <motion.div
            style={{ x, y }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
