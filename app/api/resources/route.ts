import { NextResponse } from "next/server";
import { resourceDb } from "@/lib/resource-db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function GET() {
    try {
        const resources = await resourceDb.getAllResources();
        return NextResponse.json(resources);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        if (!data.title || !data.description || !data.subject || !data.fileUrl) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newResource = await resourceDb.createResource(data, session.user.email);

        if (!newResource) {
            return NextResponse.json({ error: "Failed to create resource" }, { status: 500 });
        }

        return NextResponse.json(newResource, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
