import HeroSection from "@/components/HeroSection";
import MovieCarousel from "@/components/MovieCarousel";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center overflow-x-hidden" suppressHydrationWarning>
      <HeroSection />

      <div className="w-full max-w-7xl px-4 py-16 space-y-24 relative z-10" suppressHydrationWarning>
        <section suppressHydrationWarning>
          <div className="flex items-center justify-between mb-8" suppressHydrationWarning>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent" suppressHydrationWarning>Now Showing</h2>
            <button className="text-primary font-semibold hover:underline transition-all" suppressHydrationWarning>View All →</button>
          </div>
          <MovieCarousel />
        </section>

        <section suppressHydrationWarning>
          <div className="flex items-center justify-between mb-8" suppressHydrationWarning>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-muted-foreground to-muted-foreground/60 bg-clip-text text-transparent" suppressHydrationWarning>Coming Soon</h2>
            <button className="text-primary font-semibold hover:underline transition-all" suppressHydrationWarning>View All →</button>
          </div>
          <MovieCarousel upcoming />
        </section>
      </div>
    </div>
  );
}
