import { NextResponse } from "next/server";
import { resourceDb } from "@/lib/resource-db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const resourceId = resolvedParams.id;

        if (!resourceId) {
            return NextResponse.json({ error: "Missing resource ID" }, { status: 400 });
        }

        const success = await resourceDb.deleteResource(resourceId, session.user.id);

        if (!success) {
            return NextResponse.json({ error: "Failed to delete resource or unauthorized" }, { status: 403 });
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
