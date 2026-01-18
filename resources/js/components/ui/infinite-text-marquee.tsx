'use client';

import { motion } from 'motion/react';
import * as React from 'react';
import { useEffect, useState } from 'react';

type InfiniteTextMarqueeProps = {
    text?: string;
    link?: string;
    speed?: number;
    showTooltip?: boolean;
    tooltipText?: string;
    fontSize?: string;
    textColor?: string;
    hoverColor?: string;
};

export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
    text = "Let's Get Started",
    link = '/components',
    speed = 30,
    showTooltip = true,
    tooltipText = 'Time to Flex💪',
    fontSize = '8rem',
    textColor = '', // optional override
    hoverColor = '', // optional override
}) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [rotation, setRotation] = useState(0);
    const maxRotation = 8;

    useEffect(() => {
        if (!showTooltip) return;

        const handleMouseMove = (e: MouseEvent) => {
            setCursorPosition({ x: e.clientX, y: e.clientY });

            const midpoint = window.innerWidth / 2;
            const distanceFromMidpoint = Math.abs(e.clientX - midpoint);
            const rotation = (distanceFromMidpoint / midpoint) * maxRotation;

            setRotation(e.clientX > midpoint ? rotation : -rotation);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [showTooltip]);

    const repeatedText = Array(20).fill(text).join('     ');

    return (
        <>
            {showTooltip && (
                <div
                    className={`following-tooltip fixed z-[99] rounded-3xl px-12 py-6 font-bold text-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} bg-primary text-primary-foreground`}
                    style={{
                        top: `${cursorPosition.y}px`,
                        left: `${cursorPosition.x}px`,
                        transform: `rotateZ(${rotation}deg) translate(-50%, -140%)`,
                    }}
                >
                    <p>{tooltipText}</p>
                </div>
            )}

            <main className="w-full relative overflow-hidden">
                <motion.div
                    className="whitespace-nowrap will-change-transform"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    animate={{
                        x: [0, -2000],
                        transition: {
                            repeat: Infinity,
                            duration: speed,
                            ease: 'linear',
                        },
                    }}
                >
                    <div>
                        <span
                            className="m-0 py-10 font-bold tracking-tight transition-all text-zinc-900 dark:text-zinc-100"
                            style={{
                                fontSize,
                            }}
                        >
                            <span className="hoverable-text">
                                {repeatedText}
                            </span>
                            <style jsx>{`
                                .hoverable-text {
                                    transition: color 0.2s ease;
                                }
                                .hoverable-text:hover {
                                    color: rgb(63 63 70);
                                }
                                @media (prefers-color-scheme: dark) {
                                    .hoverable-text:hover {
                                        color: rgb(212 212 216);
                                    }
                                }
                            `}</style>
                        </span>
                    </div>
                </motion.div>
            </main>
        </>
    );
};
