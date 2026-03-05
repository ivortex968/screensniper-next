import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MOVIES = [
    {
        title: "Dune: Part Two",
        description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
        duration: 166,
        language: "English",
        genre: "Sci-Fi / Action",
        posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop",
        trailerUrl: "https://youtube.com/watch?v=Way9Dexny3w",
        releaseDate: new Date("2024-03-01")
    },
    {
        title: "Oppenheimer",
        description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
        duration: 180,
        language: "English",
        genre: "Biography / Drama",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=600&auto=format&fit=crop",
        trailerUrl: "https://youtube.com/watch?v=uYPbbksJxIg",
        releaseDate: new Date("2023-07-21")
    },
    {
        title: "Spider-Man: Across the Spider-Verse",
        description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
        duration: 140,
        language: "English",
        genre: "Animation / Action",
        posterUrl: "https://images.unsplash.com/photo-1534809027769-6217b9a455a2?q=80&w=600&auto=format&fit=crop",
        trailerUrl: "https://youtube.com/watch?v=shW9i6k8cB0",
        releaseDate: new Date("2023-06-02")
    },
    {
        title: "The Dark Knight",
        description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
        duration: 152,
        language: "English",
        genre: "Action / Crime",
        posterUrl: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop",
        trailerUrl: "https://youtube.com/watch?v=EXeTwQWrcwY",
        releaseDate: new Date("2008-07-18")
    },
    // Upcoming movies
    {
        title: "Deadpool & Wolverine",
        description: "A listless Wade Wilson toils away in civilian life. His days as the morally flexible mercenary, Deadpool, behind him.",
        duration: 127,
        language: "English",
        genre: "Action / Comedy",
        posterUrl: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?q=80&w=600&auto=format&fit=crop",
        trailerUrl: "https://youtube.com/watch?v=73_1biulkYk",
        releaseDate: new Date(new Date().setMonth(new Date().getMonth() + 2)) // 2 months from now
    },
    {
        title: "Gladiator II",
        description: "Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.",
        duration: 148,
        language: "English",
        genre: "Action / Drama",
        posterUrl: "https://images.unsplash.com/photo-1506501139174-099022df5260?q=80&w=600&auto=format&fit=crop",
        trailerUrl: "https://youtube.com/watch?v=4rgYUipGJNo",
        releaseDate: new Date(new Date().setMonth(new Date().getMonth() + 4)) // 4 months from now
    }
];

const CITIES = [
    { name: "Mumbai", state: "Maharashtra" },
    { name: "Delhi-NCR", state: "Delhi" },
    { name: "Bengaluru", state: "Karnataka" },
];

async function main() {
    console.log('Start seeding...');

    // Clean up existing data to prevent duplicates on re-seed
    await prisma.seatLock.deleteMany();
    await prisma.seat.deleteMany();
    await prisma.show.deleteMany();
    await prisma.screen.deleteMany();
    await prisma.theater.deleteMany();
    await prisma.city.deleteMany();
    await prisma.movie.deleteMany();

    // Seed Movies
    console.log('Seeding movies...');
    for (const m of MOVIES) {
        await prisma.movie.create({
            data: m
        });
    }

    // Seed Cities
    console.log('Seeding cities...');
    const createdCities = await Promise.all(
        CITIES.map(c => prisma.city.create({ data: c }))
    );

    // Seed Theaters in Mumbai
    console.log('Seeding theaters...');
    const mumbai = createdCities.find(c => c.name === "Mumbai");
    if (mumbai) {
        await prisma.theater.create({
            data: {
                name: "PVR ICON: Infinity Andheri",
                address: "Infinity Mall, Link Road, Andheri West",
                cityId: mumbai.id,
                screens: {
                    create: [
                        { name: "Screen 1 IMAX", capacity: 150 },
                        { name: "Screen 2", capacity: 100 }
                    ]
                }
            }
        });
        await prisma.theater.create({
            data: {
                name: "INOX: R-City Mall",
                address: "LBS Marg, Ghatkopar West",
                cityId: mumbai.id,
                screens: {
                    create: [
                        { name: "Audi 1", capacity: 120 },
                        { name: "Audi 2", capacity: 120 }
                    ]
                }
            }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
