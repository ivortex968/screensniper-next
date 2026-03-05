import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import Image from 'next/image';
import { CitySelector } from './CitySelector';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300" suppressHydrationWarning>
            <div className="container mx-auto flex h-16 items-center flex-row justify-between px-4 max-w-7xl" suppressHydrationWarning>
                <div className="flex items-center gap-6" suppressHydrationWarning>
                    <div className="flex items-center gap-2" suppressHydrationWarning>
                        {/* Logo container */}
                        <div className="relative w-6 h-6 flex items-center justify-center" suppressHydrationWarning>
                            {/* Shows in Light Mode */}
                            <Image
                                src="/logo-light.png"
                                alt="ScreenSniper Logo"
                                width={24}
                                height={24}
                                className="object-contain dark:hidden"
                            />
                            {/* Shows in Dark Mode */}
                            <Image
                                src="/logo-dark.png"
                                alt="ScreenSniper Logo"
                                width={24}
                                height={24}
                                className="object-contain hidden dark:block"
                            />
                        </div>
                        <Link href="/" className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent transition-all duration-300 hover:opacity-80" suppressHydrationWarning>
                            ScreenSniper
                        </Link>
                    </div>

                    {/* Integrated City Selector */}
                    <div className="hidden md:block pl-6 border-l border-border/40" suppressHydrationWarning>
                        <CitySelector />
                    </div>
                </div>

                <div className="flex items-center gap-6" suppressHydrationWarning>
                    <Link href="/movies" className="text-sm font-medium hover:text-primary transition-colors">
                        Movies
                    </Link>
                    <Link href="/events" className="text-sm font-medium hover:text-primary transition-colors">
                        Events
                    </Link>
                    <Link href="/theaters" className="text-sm font-medium hover:text-primary transition-colors">
                        Theaters
                    </Link>

                    <div className="flex items-center gap-2 border-l border-border pl-4" suppressHydrationWarning>
                        <ThemeToggle />
                        <Button variant="default" className="rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5" size="sm">
                            Sign In
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
