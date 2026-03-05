import AdminLayout from "@/components/admin/AdminLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    TrendingUp,
    Users,
    Ticket,
    Film,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from "lucide-react"

const STATS = [
    { name: "Total Revenue", value: "₹2,54,800", change: "+12.5%", trending: "up", icon: TrendingUp },
    { name: "Active Users", value: "12,482", change: "+4.2%", trending: "up", icon: Users },
    { name: "Tickets Sold", value: "542", change: "-2.1%", trending: "down", icon: Ticket },
    { name: "Now Showing", value: "18", change: "Stable", trending: "none", icon: Film },
]

export default function AdminDashboardPage() {
    return (
        <AdminLayout>
            <div className="space-y-12">
                <header>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Platform Overview</h1>
                    <p className="text-muted-foreground font-medium">Real-time metrics and business analytics at a glance.</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {STATS.map((stat) => (
                        <Card key={stat.name} className="p-6 bg-white/2 border-white/5 rounded-3xl group hover:border-primary/20 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                                    <stat.icon className="w-5 h-5 text-primary" />
                                </div>
                                {stat.trending !== "none" && (
                                    <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.trending === "up" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                        }`}>
                                        {stat.trending === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {stat.change}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.name}</p>
                            <h2 className="text-3xl font-black">{stat.value}</h2>
                        </Card>
                    ))}
                </div>

                {/* Activity Mockup */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <Card className="lg:col-span-2 p-8 bg-white/2 border-white/5 rounded-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black flex items-center gap-3">
                                <Activity className="w-5 h-5 text-primary" />
                                Revenue Distribution
                            </h3>
                            <select className="bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary/50">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                        <div className="h-64 flex items-end gap-2 px-4">
                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-primary/20 rounded-t-xl group relative cursor-pointer"
                                    style={{ height: `${h}%` }}
                                >
                                    <div className="absolute inset-0 bg-primary opacity-20 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover font-black text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-2xl">
                                        ₹{(h * 100).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-6 px-4">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <span key={day} className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">{day}</span>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-8 bg-white/2 border-white/5 rounded-3xl">
                        <h3 className="text-xl font-black mb-8">Recent Bookings</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-xs text-primary">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black group-hover:text-primary transition-colors">Dune: Part Two</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">A1, A2 • ₹1,250</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/10 hover:text-primary">
                            View all transactions
                        </Button>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    )
}
