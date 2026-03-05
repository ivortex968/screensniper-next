"use client"

import { Card, CardContent } from "./ui/card"
import { Play } from "lucide-react"
import Link from "next/link"

// Dummy data for visual representation
const DEMO_MOVIES = [
    { id: 1, title: "Dune: Part Two", genre: "Sci-Fi / Action", poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop" },
    { id: 2, title: "Oppenheimer", genre: "Drama / History", poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop" },
    { id: 3, title: "Spider-Man: Across the Spider-Verse", genre: "Animation / Action", poster: "https://images.unsplash.com/photo-1534809027769-6217b9a455a2?q=80&w=600&auto=format&fit=crop" },
    { id: 4, title: "The Dark Knight", genre: "Action / Thriller", poster: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop" }
];

import { useState, useEffect } from "react"

export default function MovieCarousel({ upcoming = false }: { upcoming?: boolean }) {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const movies = upcoming ? [...DEMO_MOVIES].reverse() : DEMO_MOVIES;

    if (!mounted) {
        return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse" suppressHydrationWarning>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[2/3] bg-muted rounded-xl" suppressHydrationWarning />
            ))}
        </div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" suppressHydrationWarning>
            {movies.map((movie) => (
                <Link href={`/movies/${movie.id}`} key={movie.id} suppressHydrationWarning>
                    <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full" suppressHydrationWarning>
                        <div className="relative aspect-[2/3] overflow-hidden" suppressHydrationWarning>
                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500 grayscale-[0.2] group-hover:grayscale-0"
                                suppressHydrationWarning
                            />
                            {/* Play button overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]" suppressHydrationWarning>
                                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300 delay-100" suppressHydrationWarning>
                                    <Play className="h-6 w-6 ml-1" suppressHydrationWarning />
                                </div>
                            </div>
                            {/* Genre Badge */}
                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-xs font-semibold text-white/90" suppressHydrationWarning>
                                {movie.genre}
                            </div>
                        </div>
                        <CardContent className="p-4" suppressHydrationWarning>
                            <h3 className="font-bold text-lg truncate mb-1" suppressHydrationWarning>{movie.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground" suppressHydrationWarning>
                                <span suppressHydrationWarning>English • 2D, IMAX</span>
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
