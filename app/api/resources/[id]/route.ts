import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { resourceDb } from "@/lib/resource-db";
import { prisma } from "@/lib/auth-client";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const success = await resourceDb.deleteResource(id, user.id);

        if (!success) {
            return NextResponse.json(
                { error: "Resource not found or unauthorized" },
                { status: 403 }
            );
        }

        return NextResponse.json({ message: "Resource deleted" });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}