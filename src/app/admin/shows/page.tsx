"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Calendar,
    Clock,
    Monitor,
    MapPin,
    Plus,
    Filter,
    ChevronRight,
    Search
} from "lucide-react"
import { motion } from "framer-motion"

export default function AdminShowsPage() {
    const [shows, setShows] = useState<any[]>([])

    useEffect(() => {
        // Mock show data
        setShows([
            {
                id: "1",
                movie: "Dune: Part Two",
                theater: "PVR: Dynamic Mall",
                screen: "Screen 1 (IMAX)",
                startTime: "07:30 PM",
                endTime: "10:15 PM",
                price: 450,
                occupancy: "82%"
            },
            {
                id: "2",
                movie: "The Batman",
                theater: "PVR: Dynamic Mall",
                screen: "Screen 3",
                startTime: "04:15 PM",
                endTime: "07:10 PM",
                price: 350,
                occupancy: "45%"
            }
        ])
    }, [])

    return (
        <AdminLayout>
            <div className="space-y-12">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Show Scheduling</h1>
                        <p className="text-muted-foreground font-medium">Manage screening times and screen allocations.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold border-white/5 bg-white/2 hover:bg-white/5 transition-all flex items-center gap-3">
                            <Filter className="w-5 h-5" /> Filter
                        </Button>
                        <Button className="h-12 px-8 rounded-2xl font-black text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3">
                            <Plus className="w-5 h-5" /> Schedule Show
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {shows.map((show) => (
                        <motion.div
                            key={show.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <Card className="p-8 bg-white/2 border-white/5 rounded-[2.5rem] hover:border-primary/20 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />

                                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
                                    <div className="flex items-center gap-8">
                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group-hover:border-primary/20 transition-colors">
                                            <Calendar className="w-6 h-6 text-primary mb-1" />
                                            <span className="text-[10px] font-black uppercase text-muted-foreground">Today</span>
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors">{show.movie}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground/60">
                                                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {show.theater}</span>
                                                <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" /> {show.screen}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-12">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> Timing
                                            </span>
                                            <p className="font-black text-lg">{show.startTime} <span className="text-muted-foreground/30 font-bold mx-1">→</span> {show.endTime}</p>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50 flex items-center gap-1">
                                                Base Price
                                            </span>
                                            <p className="font-black text-lg text-primary">₹{show.price}</p>
                                        </div>

                                        <div className="space-y-1 min-w-[120px]">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Occupancy</span>
                                                <span className="text-[10px] font-black text-primary">{show.occupancy}</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className="h-full bg-primary transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.5)]"
                                                    style={{ width: show.occupancy }}
                                                />
                                            </div>
                                        </div>

                                        <button className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-all group/btn">
                                            <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-0.5 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
                    <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-white/10">
                        <Search className="w-8 h-8 stroke-1" />
                    </div>
                    <h3 className="text-2xl font-black">Refine your schedule</h3>
                    <p className="text-sm font-bold mt-2">Use filters to manage specific theaters or date ranges.</p>
                </div>
            </div>
        </AdminLayout>
    )
}
