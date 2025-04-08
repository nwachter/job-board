"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { motion } from 'framer-motion';

const AuthLayout = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [message, setMessage] = useState("Prêt à trouver le job de vos rêves ?");

    useEffect(() => {
        try {
            const url = new URL(window.location.href);
            if (url.hostname.startsWith('employer.')) {
                setMessage("Prêt à trouver l'employé de vos rêves ?");
            }
        } catch (e) {
            console.error("Error determining host:", e);
        }
    }, []);

    const handleToggleMode = () => setIsSignUp(!isSignUp);

    // Animation constants
    const SPRING_TRANSITION = {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5
    };

    const EASE_OUT = { ease: [0.16, 1, 0.3, 1] };

    // Left pane animation
    const leftPaneVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                ...SPRING_TRANSITION,
                delay: 0.2
            }
        }
    };

    // Wave animation
    const waveVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: i === 0 ? 0.1 : 0.08,
            transition: {
                y: { duration: 1.5, ...EASE_OUT, delay: 0.4 + i * 0.2 },
                opacity: { duration: 1.2, delay: 0.4 + i * 0.2 }
            }
        })
    };

    // Floating circles animation
    const circleVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.8 },
        visible: (i: number) => ({
            opacity: [0.3, 0.5, 0.3],
            y: [0, -15, 0],
            scale: 1,
            transition: {
                opacity: { duration: 3, repeat: Infinity, delay: 0.8 + i * 0.15 },
                y: { 
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 0.8 + i * 0.15
                },
                scale: { duration: 0.5, ease: "backOut" }
            }
        })
    };

    // Text animation
    const textVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                ...SPRING_TRANSITION,
                delay: 0.6
            }
        }
    };

    // Form animation
    const formVariants = {
        hidden: { 
            x: 100, 
            opacity: 0,
            transition: { duration: 0 }
        },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                ...SPRING_TRANSITION,
                delay: 0.8
            }
        }
    };

    return (
        <div className="relative flex w-full min-h-screen items-center justify-center font-dm-sans overflow-hidden">
            {/* Left Pane - Animated first */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={leftPaneVariants}
                className="hidden md:flex w-full md:w-1/2 lg:w-3/5 h-screen relative items-center justify-center bg-gradient-to-br"
            >
                <div className="relative w-full h-full flex flex-col justify-center items-center text-center p-8">
                    {/* Text Content */}
                    <motion.div variants={textVariants} className="z-10 relative max-w-lg">
                        <h1 className='font-merriweather-sans text-4xl lg:text-5xl font-bold text-gray-800 mb-4'>
                            Bienvenue
                        </h1>
                        <p className='font-dm-sans text-xl lg:text-2xl text-gray-600'>
                            {message}
                        </p>
                    </motion.div>

                    {/* Animated Waves */}
                    <motion.svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 800 600" 
                        className='z-0 absolute w-full bottom-0 inset-x-0'
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="authGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#A855F7" />
                                <stop offset="100%" stopColor="#7C3AED" />
                            </linearGradient>
                            <linearGradient id="authGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#7C3AED" />
                                <stop offset="100%" stopColor="#A855F7" />
                            </linearGradient>
                        </defs>
                        
                        <motion.path
                            custom={0}
                            variants={waveVariants}
                            d="M0 150C150 100 250 200 400 150C550 100 650 200 800 150V600H0V150Z"
                            fill="url(#authGradient1)"
                        />
                        
                        <motion.path
                            custom={1}
                            variants={waveVariants}
                            d="M0 200C200 150 300 250 500 200C700 150 750 250 800 200V600H0V200Z"
                            fill="url(#authGradient2)"
                        />
                        
                        {/* Floating Circles */}
                        <motion.circle cx="150" cy="450" r="4" fill="#9333EA" custom={0} variants={circleVariants} />
                        <motion.circle cx="650" cy="400" r="5" fill="#9333EA" custom={1} variants={circleVariants} />
                        <motion.circle cx="300" cy="500" r="6" fill="#9333EA" custom={2} variants={circleVariants} />
                        <motion.circle cx="500" cy="550" r="3" fill="#9333EA" custom={3} variants={circleVariants} />
                    </motion.svg>
                </div>
            </motion.div>

            {/* Right Pane - Animated after left pane */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={formVariants}
                className="w-full md:w-1/2 lg:w-2/5  rounded-ss-3xl flex h-full min-h-screen items-center justify-center p-6 sm:p-8 md:p-12 bg-white/50 backdrop-blur-sm"
            >
                <Card className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100">
                    {isSignUp ? (
                        <SignUpForm onToggleMode={handleToggleMode} />
                    ) : (
                        <SignInForm onToggleMode={handleToggleMode} />
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default AuthLayout;