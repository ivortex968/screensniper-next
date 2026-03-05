"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getAdminStats() {
    try {
        const movieCount = await prisma.movie.count()
        const bookingCount = await prisma.booking.count()
        const totalRevenue = await prisma.booking.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                status: "CONFIRMED"
            }
        })

        return {
            movies: movieCount,
            bookings: bookingCount,
            revenue: totalRevenue._sum.totalAmount || 0
        }
    } catch (error) {
        console.error("Admin stats error:", error)
        return { movies: 0, bookings: 0, revenue: 0 }
    }
}

export async function createMovie(data: any) {
    try {
        const movie = await prisma.movie.create({
            data: {
                ...data,
                releaseDate: new Date(data.releaseDate)
            }
        })
        revalidatePath("/")
        revalidatePath("/admin/movies")
        return { success: true, movie }
    } catch (error) {
        console.error("Create movie error:", error)
        return { success: false, error: "Failed to create movie" }
    }
}

export async function deleteMovie(id: string) {
    try {
        await prisma.movie.delete({
            where: { id }
        })
        revalidatePath("/")
        revalidatePath("/admin/movies")
        return { success: true }
    } catch (error) {
        console.error("Delete movie error:", error)
        return { success: false, error: "Failed to delete movie" }
    }
}
