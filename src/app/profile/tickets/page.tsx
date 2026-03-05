"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Ticket, Calendar, Clock, MapPin, ChevronRight, Search, QrCode } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"

interface Booking {
    id: string
    show: {
        movie: { title: string, posterUrl: string }
        startTime: string
    }
    totalAmount: number
    qrCode: string
    status: string
}

export default function TicketsPage() {
    const [mounted, setMounted] = useState(false)
    const [bookings, setBookings] = useState<Booking[]>([])

    useEffect(() => {
        setMounted(true)
        // Mock data for now since we don't have a list action yet
        setBookings([
            {
                id: "1",
                show: {
                    movie: { title: "Dune: Part Two", posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401" },
                    startTime: new Date().toISOString()
                },
                totalAmount: 1250,
                qrCode: "MOCK-1",
                status: "CONFIRMED"
            }
        ])
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-2xl">
                <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tight">My Tickets</h1>
                    <div className="flex items-center gap-4">
                        <div className="relative group hidden md:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search movies..."
                                className="bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all w-64"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center">
                            <span className="text-primary font-black text-xs">DU</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex flex-col gap-6">
                    {bookings.length > 0 ? (
                        bookings.map((booking) => (
                            <motion.div
                                key={booking.id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                <Card className="overflow-hidden bg-white/2 border-white/5 hover:border-primary/20 transition-all group rounded-3xl">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Poster Section */}
                                        <div className="w-full md:w-48 aspect-[2/3] relative overflow-hidden">
                                            <img
                                                src={booking.show.movie.posterUrl}
                                                alt={booking.show.movie.title}
                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-primary px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider mb-2">Confirmed</div>
                                            </div>
                                        </div>

                                        {/* Details Section */}
                                        <div className="flex-1 p-8 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-start justify-between gap-4 mb-1">
                                                    <h2 className="text-2xl font-black leading-tight group-hover:text-primary transition-colors">{booking.show.movie.title}</h2>
                                                    <QrCode className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors cursor-pointer" />
                                                </div>
                                                <p className="text-muted-foreground font-bold text-sm mb-6 flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" /> PVR: Dynamic Mall, Mumbai
                                                </p>

                                                <div className="grid grid-cols-2 gap-8">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> Date
                                                        </span>
                                                        <p className="font-bold text-sm">Tomorrow, 25 Oct</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> Time
                                                        </span>
                                                        <p className="font-bold text-sm">08:15 PM</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-black">₹{booking.totalAmount}</span>
                                                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Paid</span>
                                                </div>
                                                <Button variant="ghost" className="rounded-xl font-bold group/btn" asChild>
                                                    <Link href={`/booking/success?session_id=${booking.id}`}>
                                                        View Ticket <ChevronRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                            <Ticket className="w-20 h-20 mb-6 stroke-1" />
                            <h3 className="text-2xl font-black">No tickets found</h3>
                            <p className="text-sm font-bold mt-2">Book a movie and it will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
