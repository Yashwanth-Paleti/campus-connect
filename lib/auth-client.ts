import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Prevent multiple Prisma instances in development (Next.js hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const createAdapter = () => {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL as string });
    return new PrismaPg(pool);
};

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter: createAdapter() });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type UserWithPassword = {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    year: string;
    department: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
};

export const authClient = {
    async findUserByEmail(email: string): Promise<UserWithPassword | null> {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            passwordHash: user.password, // 'password' column stores the hash
            year: user.year,
            department: user.department,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    },

    async createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
        year: string;
        department: string;
    }) {
        // Determine role from year
        let role = "Junior";
        if (data.year === "3" || data.year === "4") role = "Senior";
        if (data.year === "Alumni") role = "Alumni";

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.passwordHash, // stored as bcrypt hash
                year: data.year,
                department: data.department,
                role,
            },
        });

        return user;
    },
};