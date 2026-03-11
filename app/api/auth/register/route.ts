import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authClient } from "@/lib/auth-client";

export async function POST(req: Request) {
    try {
        const { name, email, password, year, department } = await req.json();

        if (!name || !email || !password || !year || !department) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existingUser = await authClient.findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await authClient.createUser({
            name,
            email,
            passwordHash: hashedPassword,
            year,
            department,
        });

        return NextResponse.json(
            { user: newUser, message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
