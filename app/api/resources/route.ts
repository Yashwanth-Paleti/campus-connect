import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { resourceDb } from "@/lib/resource-db";

export async function GET() {
    try {
        const resources = await resourceDb.getAllResources();
        return NextResponse.json(resources);
    } catch (error) {
        console.error("Failed to fetch resources:", error);
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Accept JSON — file is already uploaded to Supabase from client
        const { title, description, subject, fileUrl } = await req.json();

        if (!title || !description || !subject || !fileUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newResource = await resourceDb.createResource(
            { title, description, subject, fileUrl },
            session.user.email
        );

        if (!newResource) {
            return NextResponse.json({ error: "Failed to save resource" }, { status: 500 });
        }

        return NextResponse.json(newResource, { status: 201 });
    } catch (error) {
        console.error("Resource creation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}