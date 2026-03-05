"use server"

import prisma from "@/lib/prisma"

// Mock storage for development when DB is unreachable
const MOCK_LOCKS: Record<string, { seatIds: string[], expiresAt: number }> = {}

/**
 * Attempts to lock seats for a specific show.
 * If the database is unreachable, it falls back to a memory-based lock for development.
 */
export async function lockSeats(showId: string, seatIds: string[], userId: string) {
    try {
        const expiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        // Try database first
        try {
            const locks = await prisma.$transaction(
                seatIds.map(seatId =>
                    prisma.seatLock.upsert({
                        where: { seatId_showId: { seatId, showId } },
                        update: { expiresAt: expiry, userId },
                        create: { seatId, showId, userId, expiresAt: expiry }
                    })
                )
            )
            return { success: true, locks }
        } catch (dbError) {
            console.warn("DB unreachable, falling back to mock locks:", dbError)

            // Mock implementation
            const lockId = `${userId}-${showId}`
            MOCK_LOCKS[lockId] = {
                seatIds: [...(MOCK_LOCKS[lockId]?.seatIds || []), ...seatIds],
                expiresAt: expiry.getTime()
            }
            return { success: true, mode: "mock", expiresAt: expiry }
        }
    } catch (error) {
        console.error("Lock error:", error)
        return { success: false, error: "Failed to lock seats" }
    }
}

/**
 * Unlocks seats (e.g., if the user cancels or deselects)
 */
export async function unlockSeats(showId: string, seatIds: string[], userId: string) {
    try {
        try {
            await prisma.seatLock.deleteMany({
                where: {
                    showId,
                    userId,
                    seatId: { in: seatIds }
                }
            })
            return { success: true }
        } catch (dbError) {
            const lockId = `${userId}-${showId}`
            if (MOCK_LOCKS[lockId]) {
                MOCK_LOCKS[lockId].seatIds = MOCK_LOCKS[lockId].seatIds.filter(id => !seatIds.includes(id))
            }
            return { success: true, mode: "mock" }
        }
    } catch (error) {
        return { success: false }
    }
}

/**
 * Gets currently locked and booked seats for a show.
 * Distinguishes between locks by the current user and others.
 */
export async function getShowStatus(showId: string, userId?: string) {
    try {
        try {
            // Remove expired locks first
            await prisma.seatLock.deleteMany({
                where: { expiresAt: { lt: new Date() } }
            })

            const locked = await prisma.seatLock.findMany({
                where: { showId },
                select: { seatId: true, userId: true }
            })

            const booked = await prisma.bookingSeat.findMany({
                where: { booking: { showId, status: "CONFIRMED" } },
                select: { seatId: true }
            })

            return {
                lockedByMe: locked.filter((l: { seatId: string, userId: string }) => l.userId === userId).map((l: { seatId: string }) => l.seatId),
                lockedByOthers: locked.filter((l: { seatId: string, userId: string }) => l.userId !== userId).map((l: { seatId: string }) => l.seatId),
                booked: booked.map((b: { seatId: string }) => b.seatId)
            }
        } catch (dbError) {
            // Combine all mock locks for this show
            const allMockLocks = Object.entries(MOCK_LOCKS)
                .filter(([_, lock]) => lock.expiresAt > Date.now())

            const currentLockId = `${userId}-${showId}`

            const lockedByMe = MOCK_LOCKS[currentLockId]?.seatIds || []
            const lockedByOthers = allMockLocks
                .filter(([id, _]) => id !== currentLockId)
                .flatMap(([_, lock]) => lock.seatIds)

            return {
                lockedByMe,
                lockedByOthers,
                booked: []
            }
        }
    } catch (error) {
        return { lockedByMe: [], lockedByOthers: [], booked: [] }
    }
}

/**
 * Finalizes a booking after successful payment.
 * In a real app, this would be triggered by a Stripe Webhook.
 * For this demo, we verify the session on the success page.
 */
export async function finalizeBooking(sessionId: string) {
    try {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (session.payment_status !== "paid") {
            throw new Error("Payment not confirmed")
        }

        const { movieId, showId, userId, selectedSeats: seatsJson, fnbSelection: fnbJson } = session.metadata
        const selectedSeats = JSON.parse(seatsJson) as string[]
        const fnbSelection = JSON.parse(fnbJson) as Record<string, number>

        // Ensure user exists (Mock user for demo)
        const user = await prisma.user.upsert({
            where: { email: "demo@example.com" },
            update: {},
            create: { name: "Demo User", email: "demo@example.com", id: userId }
        })

        const totalAmount = (session.amount_total || 0) / 100

        // Execute booking in transaction
        const booking = await prisma.$transaction(async (tx: any) => {
            // 1. Create the booking record
            const newBooking = await tx.booking.create({
                data: {
                    userId: user.id,
                    showId,
                    totalAmount,
                    status: "CONFIRMED",
                    paymentId: session.payment_intent as string,
                    qrCode: `BOOK-${new Date().getTime()}`, // Mock QR data
                }
            })

            // 2. Create booking seats
            await tx.bookingSeat.createMany({
                data: selectedSeats.map(seatId => ({
                    bookingId: newBooking.id,
                    seatId
                }))
            })

            // 3. Create F&B orders
            await tx.fnbOrder.createMany({
                data: Object.entries(fnbSelection).map(([name, quantity]) => ({
                    bookingId: newBooking.id,
                    itemId: name, // This assumes FnBItem IDs match names for the demo simplify
                    quantity,
                    subtotal: (quantity as number) * 350 // Mock subtotal
                }))
            })

            // 4. Clean up seat locks
            await tx.seatLock.deleteMany({
                where: {
                    showId,
                    seatId: { in: selectedSeats }
                }
            })

            return newBooking
        })

        return { success: true, booking }
    } catch (error) {
        console.error("Finalize booking error:", error)
        return { success: false, error: "Failed to finalize booking" }
    }
}
