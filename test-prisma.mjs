import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
    console.log('Connecting...');
    await prisma.$connect();
    console.log('Connected!');
    const movies = await prisma.movie.findMany();
    console.log('Movies count:', movies.length);
} catch (e) {
    console.error('Error:', e);
} finally {
    await prisma.$disconnect();
}
