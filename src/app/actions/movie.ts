"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getNowShowingMovies() {
    try {
        const movies = await prisma.movie.findMany({
            take: 8,
            orderBy: {
                releaseDate: 'desc'
            },
            where: {
                releaseDate: {
                    lte: new Date()
                }
            }
        });
        return movies;
    } catch (error) {
        console.error("Error fetching now showing movies:", error);
        return [];
    }
}

export async function getUpcomingMovies() {
    try {
        const movies = await prisma.movie.findMany({
            take: 8,
            orderBy: {
                releaseDate: 'asc'
            },
            where: {
                releaseDate: {
                    gt: new Date()
                }
            }
        });
        return movies;
    } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        return [];
    }
}
