"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Play, Ticket } from "lucide-react";

export default function HeroSection() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return (
        <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-muted/20 animate-pulse" suppressHydrationWarning>
            <div className="w-1/2 h-12 bg-muted rounded-lg" suppressHydrationWarning />
        </section>
    );

    return (
        <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden" suppressHydrationWarning>
            {/* Dynamic Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-background to-rose-500/20 dark:from-indigo-900/40 dark:via-background dark:to-rose-900/40" suppressHydrationWarning />
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" suppressHydrationWarning />

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6" suppressHydrationWarning>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="inline-block rounded-full px-4 py-1.5 text-sm font-medium bg-secondary text-secondary-foreground mb-4 border border-border/50 backdrop-blur-md shadow-sm"
                    suppressHydrationWarning
                >
                    ✨ The ultimate cinematic experience
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-muted-foreground"
                    suppressHydrationWarning
                >
                    Book tickets for the latest <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">blockbusters</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl"
                    suppressHydrationWarning
                >
                    Skip the queue. Select your favorite seats, grab your snacks, and get ready for the show with ScreenSniper Next.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 mt-8"
                    suppressHydrationWarning
                >
                    <Button size="lg" className="rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all h-14 px-8 text-base group">
                        <Ticket className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                        Book Tickets
                    </Button>
                    <Button size="lg" variant="outline" className="rounded-full backdrop-blur-sm bg-background/50 hover:bg-background/80 hover:-translate-y-1 h-14 px-8 text-base group shadow-sm transition-all border-border/50">
                        <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform text-indigo-500" />
                        Watch Trailers
                    </Button>
                </motion.div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob pointer-events-none" suppressHydrationWarning />
            <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-rose-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000 pointer-events-none" suppressHydrationWarning />
            <div className="absolute -bottom-16 left-1/3 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000 pointer-events-none" suppressHydrationWarning />
        </section>
    );
}
