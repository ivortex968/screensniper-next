"use client"

import { useState, useEffect } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Plus,
    Search,
    MoreVertical,
    Film,
    Calendar,
    Languages,
    Clock,
    Trash2,
    Edit3
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminMoviesPage() {
    const [movies, setMovies] = useState<any[]>([])
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        // Mock data fetch
        setMovies([
            {
                id: "1",
                title: "Dune: Part Two",
                genre: "Sci-Fi, Adventure",
                language: "English",
                duration: 166,
                releaseDate: "2024-03-01",
                posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401"
            },
            {
                id: "2",
                title: "The Batman",
                genre: "Action, Crime",
                language: "English",
                duration: 176,
                releaseDate: "2022-03-04",
                posterUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c"
            }
        ])
    }, [])

    return (
        <AdminLayout>
            <div className="space-y-12">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Movie Management</h1>
                        <p className="text-muted-foreground font-medium">Curate the latest cinematic releases for your theaters.</p>
                    </div>
                    <Button
                        onClick={() => setShowAddModal(true)}
                        className="h-12 px-8 rounded-2xl font-black text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-3"
                    >
                        <Plus className="w-5 h-5" /> Add New Movie
                    </Button>
                </header>

                <Card className="bg-white/2 border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/2">
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Movie</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Details</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Release Date</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {movies.map((movie) => (
                                    <tr key={movie.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-20 rounded-xl overflow-hidden shadow-2xl relative">
                                                    <img src={movie.posterUrl} className="absolute inset-0 w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-lg group-hover:text-primary transition-colors">{movie.title}</p>
                                                    <p className="text-xs text-muted-foreground font-bold">{movie.genre}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                    <Languages className="w-3 h-3 text-primary" /> {movie.language}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                                    <Clock className="w-3 h-3 text-primary" /> {movie.duration} mins
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm font-black text-foreground">
                                                <Calendar className="w-4 h-4 text-muted-foreground" /> {movie.releaseDate}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground hover:text-white">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-muted-foreground hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Add Movie Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowAddModal(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-[#0A0A0A] border border-white/5 p-12 rounded-[3rem] max-w-2xl w-full shadow-2xl relative z-10"
                        >
                            <h2 className="text-3xl font-black mb-8 tracking-tight">Post New Entry</h2>
                            <form className="grid grid-cols-2 gap-8">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Film Title</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="e.g. Inception: Rebirth"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Genre</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="Action, Sci-Fi"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Language</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="English, Hindi"
                                    />
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Poster URL</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="https://images.unsplash.com/..."
                                    />
                                </div>
                                <div className="col-span-2 flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        className="flex-1 h-14 rounded-2xl font-black text-sm uppercase tracking-widest"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Save Movie Entry
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="px-8 h-14 rounded-2xl font-black text-sm uppercase tracking-widest border-white/5 hover:bg-white/5"
                                        onClick={() => setShowAddModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}
