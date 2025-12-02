'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
    scale?: boolean;
    blur?: boolean;
}

export function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    className = '',
    scale = false,
    blur = false
}: ScrollRevealProps) {
    const directions = {
        up: { y: 60, x: 0 },
        down: { y: -60, x: 0 },
        left: { y: 0, x: 60 },
        right: { y: 0, x: -60 }
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: scale ? 0.8 : 1,
                filter: blur ? 'blur(10px)' : 'blur(0px)',
                ...directions[direction]
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                filter: 'blur(0px)'
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
