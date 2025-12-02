'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface VideoBackgroundProps {
    videoSrc: string;
    posterSrc?: string;
    className?: string;
    overlayOpacity?: number;
    enableParallax?: boolean;
}

export function VideoBackground({
    videoSrc,
    posterSrc,
    className = '',
    overlayOpacity = 0.6,
    enableParallax = true
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Ensure video plays on load
        const playVideo = async () => {
            try {
                await video.play();
            } catch (error) {
                console.log('Video autoplay prevented:', error);
            }
        };

        playVideo();

        // Handle visibility change to pause/play video
        const handleVisibilityChange = () => {
            if (document.hidden) {
                video.pause();
            } else {
                playVideo();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`}>
            {/* Video Element */}
            <motion.video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                poster={posterSrc}
                className="absolute inset-0 w-full h-full object-cover min-w-full min-h-full"
                style={{
                    transform: enableParallax ? 'scale(1.2)' : 'scale(1)',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </motion.video>

            {/* Gradient Overlay for text readability */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"
                style={{ opacity: overlayOpacity }}
            />

            {/* Additional dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/20" />
        </div>
    );
}
