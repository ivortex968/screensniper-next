"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, QrCode, Calendar, Clock, MapPin, Armchair } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { QRCodeSVG } from "qrcode.react"

import { finalizeBooking } from "@/app/actions/booking"

function BookingSuccessContent() {
    const searchParams = useSearchParams()
    const sessionId = searchParams.get("session_id")
    const [mounted, setMounted] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [bookingData, setBookingData] = useState<any>(null)

    useEffect(() => {
        setMounted(true)
        if (sessionId) {
            finalizeBooking(sessionId).then(res => {
                if (res.success) {
                    setBookingData(res.booking)
                } else {
                    setError(true)
                }
                setLoading(false)
            })
        }
    }, [sessionId])

    if (!mounted || loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Processing Your Ticket...</p>
            </div>
        </div>
    )

    if (error) return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="max-w-md w-full p-8 text-center space-y-4 bg-black/40 backdrop-blur-xl border-red-500/20">
                <h1 className="text-2xl font-black text-red-500">Payment Verification Failed</h1>
                <p className="text-muted-foreground">We couldn't verify your payment session. If money was deducted, please contact support.</p>
                <Button className="w-full" asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </Card>
        </div>
    )

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full"
            >
                <Card className="overflow-hidden border-primary/20 shadow-2xl bg-black/40 backdrop-blur-xl rounded-3xl">
                    <div className="bg-primary/20 p-8 flex flex-col items-center text-center gap-4">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 12 }}
                        >
                            <CheckCircle2 className="w-20 h-20 text-primary" />
                        </motion.div>
                        <h1 className="text-3xl font-black tracking-tight">Booking Confirmed!</h1>
                        <p className="text-muted-foreground font-medium text-sm">Your cinematic adventure is ready. Show this QR code at the theater.</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Ticket Details */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2 opacity-50 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Date
                                </span>
                                <p className="font-bold text-sm">Today, 24 Oct</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2 opacity-50 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> Time
                                </span>
                                <p className="font-bold text-sm">07:30 PM</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2 opacity-50 flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> Theater
                                </span>
                                <p className="font-bold text-sm">PVR: Dynamic Mall</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2 opacity-50 flex items-center gap-1">
                                    <Armchair className="w-3 h-3" /> Seats
                                </span>
                                <p className="font-bold text-sm">A1, A2</p>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center gap-4 py-8 bg-white/5 rounded-3xl border border-white/5 relative group overflow-hidden">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="bg-white p-4 rounded-2xl shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                                <QRCodeSVG value={sessionId || "booking-id-123"} size={160} level="H" includeMargin />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 transition-colors group-hover:text-primary relative z-10">Scan to Enter</span>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button className="w-full h-12 rounded-xl font-bold text-base shadow-xl shadow-primary/10" asChild>
                                <Link href="/profile/tickets">View My Tickets</Link>
                            </Button>
                            <Button variant="ghost" className="w-full h-12 rounded-xl font-bold text-muted-foreground hover:text-foreground" asChild>
                                <Link href="/">Back to Home</Link>
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <BookingSuccessContent />
        </Suspense>
    )
}
