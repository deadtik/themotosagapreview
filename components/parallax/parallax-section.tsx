'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxSectionProps {
    children: ReactNode;
    speed?: number; // -1 to 1, negative for slower, positive for faster
    className?: string;
    enableScale?: boolean;
    enableOpacity?: boolean;
}

export function ParallaxSection({
    children,
    speed = 0.5,
    className = '',
    enableScale = false,
    enableOpacity = false
}: ParallaxSectionProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);
    const scale = enableScale ? useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]) : 1;
    const opacity = enableOpacity ? useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]) : 1;

    return (
        <motion.div
            ref={ref}
            style={{ y, scale, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
