import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { createClient } from "@supabase/supabase-js";
import { resourceDb } from "@/lib/resource-db";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

        // Parse multipart form data
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const subject = formData.get("subject") as string;
        const file = formData.get("file") as File;

        if (!title || !description || !subject || !file) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Upload file to Supabase Storage
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const fileBuffer = await file.arrayBuffer();

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("resources")
            .upload(fileName, fileBuffer, {
                contentType: "application/pdf",
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json({ error: "File upload failed" }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from("resources")
            .getPublicUrl(fileName);

        const fileUrl = urlData.publicUrl;

        // Save resource to database
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