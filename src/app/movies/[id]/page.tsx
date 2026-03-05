import Image from "next/image";
import { Play, Calendar, Clock, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Simulated fetch based on ID for the demo
const getMovieInfo = (id: string) => ({
    id,
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.",
    backdropUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=1920&auto=format&fit=crop", // Dark Knight placeholder used for dramatic effect
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
    genre: "Sci-Fi, Action, Adventure",
    duration: "2h 46m",
    releaseDate: "March 1, 2024",
    rating: "8.8/10",
    director: "Denis Villeneuve",
    cast: "Timothée Chalamet, Zendaya, Rebecca Ferguson, Javier Bardem",
});

export default async function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const movie = getMovieInfo(id);

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Massive Hero Backdrop */}
            <div className="relative w-full h-[60vh] md:h-[70vh]">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-20" />
                <Image
                    src={movie.backdropUrl}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Play Trailer Floating Button */}
                <div className="absolute inset-0 z-30 flex items-center justify-center">
                    <button className="group flex flex-col items-center gap-3 transition-transform hover:scale-110">
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl group-hover:bg-primary/80 group-hover:border-primary transition-all">
                            <Play className="w-8 h-8 ml-1 fill-current" />
                        </div>
                        <span className="text-white font-medium tracking-widest uppercase text-sm">Trailer</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto max-w-7xl px-4 -mt-32 relative z-30 flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Left Col: Poster */}
                <div className="w-48 md:w-72 shrink-0 md:-mt-24">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-border/50 relative">
                        <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Right Col: Details & Booking CTA */}
                <div className="flex-1 pt-4 md:pt-0">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-foreground">{movie.title}</h1>
                            <p className="text-lg text-muted-foreground font-medium mb-6">{movie.genre}</p>

                            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-medium">
                                <div className="flex items-center gap-2 text-yellow-500">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="text-foreground text-base">{movie.rating}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="w-5 h-5" />
                                    <span>{movie.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="w-5 h-5" />
                                    <span>{movie.releaseDate}</span>
                                </div>
                            </div>

                            <div className="space-y-6 max-w-3xl">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Synopsis</h3>
                                    <p className="text-muted-foreground leading-relaxed">{movie.description}</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                                    <div>
                                        <h4 className="text-sm text-muted-foreground mb-1">Director</h4>
                                        <p className="font-semibold">{movie.director}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-muted-foreground mb-1">Cast</h4>
                                        <p className="font-semibold">{movie.cast}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Booking Card */}
                        <Card className="w-full md:w-80 shrink-0 border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                            <CardContent className="p-6">
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg mb-1">Book Tickets</h3>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <MapPin className="w-4 h-4" /> Mumbai
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <Link href={`/movies/${movie.id}/booking`}>
                                        <Button className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all">
                                            Select Seats
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
