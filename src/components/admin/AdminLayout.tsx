"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    LayoutDashboard,
    Film,
    Calendar,
    Users,
    LogOut,
    ChevronRight,
    Search,
    Bell,
    Settings
} from "lucide-react"
import { motion } from "framer-motion"

const MENU_ITEMS = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { name: "Movies", icon: Film, href: "/admin/movies" },
    { name: "Shows", icon: Calendar, href: "/admin/shows" },
    { name: "Users", icon: Users, href: "/admin/users" },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col sticky top-0 h-screen">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
                            <Film className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xl font-black tracking-tighter">SCREEN<span className="text-primary">SNIPER</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${isActive ? "bg-primary text-black font-bold" : "text-muted-foreground hover:bg-white/5"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={`w-5 h-5 ${isActive ? "text-black" : "group-hover:text-primary transition-colors"}`} />
                                    <span className="text-sm">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5">
                    <button className="flex items-center gap-3 text-red-500/60 hover:text-red-500 transition-colors w-full p-3 rounded-xl hover:bg-red-500/5">
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-bold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Universal search..."
                            className="bg-white/5 border border-white/5 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all w-full"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative text-muted-foreground hover:text-primary transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                        </button>
                        <div className="flex items-center gap-3 border-l border-white/10 pl-6 cursor-pointer">
                            <div className="text-right">
                                <p className="text-xs font-black">Admin User</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center">
                                <span className="text-primary font-black text-xs">AD</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-12">
                    {children}
                </div>
            </main>
        </div>
    )
}
