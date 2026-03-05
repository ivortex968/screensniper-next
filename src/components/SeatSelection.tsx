"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Info, Armchair, Timer, UtensilsCrossed, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { lockSeats, unlockSeats, getShowStatus } from "@/app/actions/booking"
import { createCheckoutSession } from "@/app/actions/stripe"
import { toast } from "sonner"
import FoodSelection from "@/components/FoodSelection"

interface Seat {
    id: string
    row: string
    number: number
    category: "STANDARD" | "PREMIUM" | "VIP"
    status: "AVAILABLE" | "SELECTED" | "OCCUPIED" | "LOCKED"
    price: number
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"]
const COLS = 12

const CATEGORIES = {
    STANDARD: { price: 250, color: "bg-muted-foreground/20", label: "Standard" },
    PREMIUM: { price: 450, color: "bg-blue-500/20", label: "Premium" },
    VIP: { price: 850, color: "bg-primary/20", label: "VIP" },
}

export default function SeatSelection({ movieId }: { movieId: string }) {
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [lockedSeats, setLockedSeats] = useState<string[]>([])
    const [bookedSeats, setBookedSeats] = useState<string[]>([])
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [showFoodSelection, setShowFoodSelection] = useState(false)
    const [selectedFood, setSelectedFood] = useState<Record<string, number>>({})
    const showId = "demo-show-123" // For demo purposes

    // Generate base seats structure
    const generateSeats = useCallback((): Seat[] => {
        let seats: Seat[] = []
        ROWS.forEach((row, rowIndex) => {
            for (let col = 1; col <= COLS; col++) {
                const id = `${row}${col}`
                let category: "STANDARD" | "PREMIUM" | "VIP" = "STANDARD"
                if (rowIndex < 2) category = "VIP"
                else if (rowIndex < 5) category = "PREMIUM"

                seats.push({
                    id,
                    row,
                    number: col,
                    category,
                    status: "AVAILABLE",
                    price: CATEGORIES[category].price,
                })
            }
        })
        return seats
    }, [])

    const [seats, setSeats] = useState<Seat[]>(() => generateSeats())

    // Initial status fetch
    useEffect(() => {
        const fetchStatus = async () => {
            const { lockedByMe, lockedByOthers, booked } = await getShowStatus(showId, "demo-user")
            setLockedSeats(lockedByOthers)
            setBookedSeats(booked)
            // Sync local selection only once on initial load if we have DB locks
            if (selectedSeats.length === 0 && lockedByMe.length > 0) {
                setSelectedSeats(lockedByMe)
            }
        }
        fetchStatus()
        const interval = setInterval(fetchStatus, 5000) // Poll every 5s
        return () => clearInterval(interval)
    }, [])

    // Expiry timer
    useEffect(() => {
        if (selectedSeats.length === 0) {
            setTimeLeft(null)
            return
        }

        if (timeLeft === null) setTimeLeft(600) // 10 mins

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev !== null && prev <= 0) {
                    setSelectedSeats([])
                    toast.error("Session expired. Seats released.")
                    return null
                }
                return prev !== null ? prev - 1 : null
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [selectedSeats.length, timeLeft])

    const toggleSeat = async (id: string) => {
        const isCurrentlySelected = selectedSeats.includes(id)

        if (isCurrentlySelected) {
            setSelectedSeats(prev => prev.filter(s => s !== id))
            await unlockSeats(showId, [id], "demo-user")
        } else {
            const result = await lockSeats(showId, [id], "demo-user")
            if (result.success) {
                setSelectedSeats(prev => [...prev, id])
                if (result.mode === "mock") {
                    toast.info("Database unreachable. Using development mock lock.", {
                        description: "Real-time prevents double-selection in this tab session."
                    })
                }
            } else {
                toast.error("Seat already taken or unavailable.")
            }
        }
    }

    const foodPrice = Object.entries(selectedFood).reduce((acc, [id, count]) => {
        const item = [
            { id: "popcorn-l", price: 350 },
            { id: "nachos", price: 280 },
            { id: "pepsi-l", price: 180 },
            { id: "combo-1", price: 450 }
        ].find(i => i.id === id)
        return acc + (item?.price || 0) * count
    }, 0)

    const seatsPrice = selectedSeats.reduce((acc, id) => {
        const seat = seats.find((s) => s.id === id)
        return acc + (seat?.price || 0)
    }, 0)

    const totalPrice = seatsPrice + foodPrice

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handleConfirmFood = (selected: Record<string, number>) => {
        setSelectedFood(selected)
        setShowFoodSelection(false)
        if (Object.keys(selected).length > 0) {
            toast.success("Food added to your order!")
        }
        handlePayment(selected) // Trigger payment after food selection confirm
    }

    const handlePayment = async (fnbSelection: Record<string, number> = selectedFood) => {
        try {
            const items = []

            // Add seats
            selectedSeats.forEach(seatId => {
                const seat = seats.find(s => s.id === seatId)
                if (seat) {
                    items.push({
                        name: `Seat ${seatId} (${seat.category})`,
                        amount: seat.price,
                        quantity: 1
                    })
                }
            })

            // Add Food
            Object.entries(fnbSelection).forEach(([id, quantity]) => {
                if (quantity > 0) {
                    items.push({
                        name: id.replace("-", " ").toUpperCase(),
                        amount: 350, // Simplified for demo
                        quantity
                    })
                }
            })

            // Add GST and Fees
            items.push({ name: "GST (18%)", amount: Math.round((totalPrice + foodPrice) * 0.18), quantity: 1 })
            items.push({ name: "Convenience Fee", amount: 50, quantity: 1 })


            console.log("Initiating payment session...")
            const session = await createCheckoutSession(items, {
                movieId,
                showId,
                selectedSeats: JSON.stringify(selectedSeats),
                fnbSelection: JSON.stringify(fnbSelection),
                userId: "demo-user"
            })

            console.log("Received session response:", session)

            if (session.url) {
                console.log("Redirecting to:", session.url)
                window.location.href = session.url
            } else {
                console.error("No session URL received")
                toast.error("Failed to generate payment link.")
            }
        } catch (error: any) {
            console.error("Payment initiation error:", error)
            toast.error(error.message || "Failed to initiate payment. Please try again.")
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground pb-24" suppressHydrationWarning>
            {/* Header */}
            <header className="sticky top-0 z-[60] w-full border-b border-white/5 bg-background/80 backdrop-blur-2xl" suppressHydrationWarning>
                <div className="container mx-auto px-4 h-20 flex items-center justify-between" suppressHydrationWarning>
                    <div className="flex items-center gap-6" suppressHydrationWarning>
                        <Link href={`/movies/${movieId}`}>
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                                <ChevronLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                        <div className="flex flex-col" suppressHydrationWarning>
                            <h1 className="text-xl font-black tracking-tight leading-tight">Dune: Part Two</h1>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground font-bold" suppressHydrationWarning>
                                <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-primary text-primary" /> 8.8</span>
                                <span>•</span>
                                <span>PVR: Dynamic Mall, Mumbai</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5" suppressHydrationWarning>
                        <Timer className="w-4 h-4 text-primary animate-pulse" />
                        <div className="flex flex-col" suppressHydrationWarning>
                            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Session Expires</span>
                            <span className={`text-sm font-black tabular-nums ${timeLeft !== null && timeLeft < 60 ? "text-red-500" : "text-foreground"}`}>
                                {timeLeft !== null ? formatTime(timeLeft) : "10:00"}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 pt-12 max-w-4xl" suppressHydrationWarning>
                {/* Screen Info */}
                <div className="relative mb-20 group" suppressHydrationWarning>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 group-hover:text-primary/40 transition-colors">Screen This Way</div>
                    <div className="h-2 w-full bg-gradient-to-b from-primary/40 to-transparent rounded-t-[100px] blur-sm" />
                    <div className="h-1.5 w-full bg-gradient-to-b from-primary/20 to-transparent rounded-t-[100px]" />
                </div>

                {/* Seat Map */}
                <div className="flex flex-col gap-3 items-center" suppressHydrationWarning>
                    {ROWS.map((row) => (
                        <div key={row} className="flex gap-2 items-center" suppressHydrationWarning>
                            <span className="w-6 text-[10px] font-black text-muted-foreground/40">{row}</span>
                            <div className="flex gap-2" suppressHydrationWarning>
                                {Array.from({ length: COLS }).map((_, i) => {
                                    const seatId = `${row}${i + 1}`
                                    const seat = seats.find(s => s.id === seatId)
                                    const isSelected = selectedSeats.includes(seatId)
                                    const isLockedByOthers = lockedSeats.includes(seatId)
                                    const isBooked = bookedSeats.includes(seatId)

                                    let statusColor = CATEGORIES[seat?.category || "STANDARD"].color
                                    if (isSelected) statusColor = "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] scale-110 z-10"
                                    else if (isLockedByOthers) statusColor = "bg-orange-500/40 cursor-not-allowed opacity-50"
                                    if (isBooked) statusColor = "bg-muted-foreground/10 cursor-not-allowed opacity-20"

                                    return (
                                        <button
                                            key={seatId}
                                            onClick={() => !isLockedByOthers && !isBooked && toggleSeat(seatId)}
                                            disabled={isBooked || (isLockedByOthers && !isSelected)}
                                            className={`w-6 h-6 md:w-8 md:h-8 rounded-md transition-all duration-300 relative group/seat ${statusColor}`}
                                            suppressHydrationWarning
                                        >
                                            {!isBooked && !isLockedByOthers && (
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] font-bold px-2 py-1 rounded shadow-xl opacity-0 group-hover/seat:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-border/50">
                                                    {seatId} • ₹{seat?.price}
                                                </div>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                            <span className="w-6 text-[10px] font-black text-muted-foreground/40 text-right">{row}</span>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="mt-20 flex flex-wrap justify-center gap-8 bg-white/2 px-8 py-6 rounded-3xl border border-white/5" suppressHydrationWarning>
                    <div className="flex items-center gap-3" suppressHydrationWarning>
                        <div className="w-4 h-4 rounded bg-muted-foreground/20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Available</span>
                    </div>
                    <div className="flex items-center gap-3" suppressHydrationWarning>
                        <div className="w-4 h-4 rounded bg-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Selected</span>
                    </div>
                    <div className="flex items-center gap-3" suppressHydrationWarning>
                        <div className="w-4 h-4 rounded bg-orange-500/40" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Hold</span>
                    </div>
                    <div className="flex items-center gap-3" suppressHydrationWarning>
                        <div className="w-4 h-4 rounded bg-muted-foreground/10" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Booked</span>
                    </div>
                </div>
            </main>

            {/* Floating Action Bar */}
            <AnimatePresence>
                {selectedSeats.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50"
                        suppressHydrationWarning
                    >
                        <Card className="bg-background/80 backdrop-blur-2xl border-primary/20 shadow-2xl overflow-hidden rounded-2xl" suppressHydrationWarning>
                            <div className="p-5 flex items-center justify-between gap-6" suppressHydrationWarning>
                                <div className="flex flex-col" suppressHydrationWarning>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Total Checkout</span>
                                    <div className="flex items-baseline gap-2" suppressHydrationWarning>
                                        <span className="text-2xl font-black">₹{totalPrice}</span>
                                        <div className="flex flex-col" suppressHydrationWarning>
                                            <span className="text-[10px] text-muted-foreground font-bold">{selectedSeats.length} Seats {foodPrice > 0 ? "+ Food" : ""}</span>
                                            {foodPrice > 0 && <span className="text-[8px] text-primary font-black uppercase tracking-tighter">Food Save ₹80</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2" suppressHydrationWarning>
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowFoodSelection(true)}
                                        className="h-12 px-4 rounded-xl font-bold border-primary/20 hover:bg-primary/5 transition-all"
                                    >
                                        <UtensilsCrossed className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        className="h-12 px-8 rounded-xl font-extrabold text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all"
                                        onClick={() => handlePayment()}
                                    >
                                        Book Now
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="h-12 px-4 rounded-xl font-bold text-muted-foreground/60 hover:text-primary transition-all text-[10px] uppercase tracking-tighter"
                                        onClick={() => {
                                            toast.info("Dev Bypass: Redirecting to success page...")
                                            window.location.href = `/booking/success?session_id=dev-bypass-${Date.now()}`
                                        }}
                                    >
                                        Dev Confirm
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Food Selection Modal Overlay */}
            <AnimatePresence>
                {showFoodSelection && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md" suppressHydrationWarning>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0"
                            onClick={() => setShowFoodSelection(false)}
                        />
                        <FoodSelection
                            initialSelected={selectedFood}
                            onClose={() => setShowFoodSelection(false)}
                            onConfirm={handleConfirmFood}
                        />
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
