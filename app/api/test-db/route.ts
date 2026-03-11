import { NextResponse } from "next/server";
import { Client } from "pg";

export async function POST(req: Request) {
    try {
        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Missing name or email" }, { status: 400 });
        }

        // Use DIRECT_URL for direct connection or fallback to DATABASE_URL without pooler
        const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

        if (!connectionString) {
            return NextResponse.json({ error: "No database URL found in .env" }, { status: 500 });
        }

        const client = new Client({
            connectionString: connectionString + "?sslmode=require", // Ensure SSL for Supabase
        });

        await client.connect();

        // Create the table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS "TestEntry" (
                "id" SERIAL PRIMARY KEY,
                "name" TEXT NOT NULL,
                "email" TEXT NOT NULL,
                "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Insert the test data
        const insertQuery = await client.query(
            'INSERT INTO "TestEntry" (name, email) VALUES ($1, $2) RETURNING *;',
            [name, email]
        );

        await client.end();

        return NextResponse.json({
            success: true,
            message: "Database connection successful and data was written!",
            dataReceived: { name, email },
            dbInfo: insertQuery.rows[0]
        });
    } catch (error: any) {
        console.error("Database connection error:", error);
        return NextResponse.json({
            error: "Failed to connect to the database",
            details: error.message
        }, { status: 500 });
    }
}
