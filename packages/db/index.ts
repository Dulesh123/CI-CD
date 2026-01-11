// lib/prisma.ts (adjust path to generated client as necessary)
import "dotenv/config"; // To load environment variables
import dotenv from "dotenv";
dotenv.config(); // 👈 THIS IS CRITICAL

import { PrismaClient } from './generated/prisma/client'; // Import from the path defined in your schema
import { PrismaPg } from '@prisma/adapter-pg'; // Import the specific driver adapter

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

// Optional: Use a global instance for Next.js hot reloading to prevent multiple instances
// const globalForPrisma = global as unknown as { prisma: PrismaClient };
// const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });
// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export { prisma };
