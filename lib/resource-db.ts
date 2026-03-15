import { Resource } from "./types";
import { prisma } from "./auth-client";

export const resourceDb = {
    async getAllResources(): Promise<Resource[]> {
        const resources = await prisma.resource.findMany({
            include: {
                uploader: true,
            },
            orderBy: {
                uploadDate: "desc",
            },
        });

        return resources.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            subject: r.subject,
            fileUrl: r.fileUrl,
            uploaderId: r.uploaderId,
            uploaderName: r.uploader.name,
            uploaderYear: r.uploader.year,
            uploaderEmail: r.uploader.email,
            uploadDate: r.uploadDate.toISOString().split("T")[0],
        }));
    },

    async createResource(
        data: { title: string; description: string; subject: string; fileUrl: string },
        userEmail: string
    ): Promise<Resource | null> {
        const uploader = await prisma.user.findUnique({
            where: { email: userEmail },
        });

        if (!uploader) return null;

        const resource = await prisma.resource.create({
            data: {
                title: data.title,
                description: data.description,
                subject: data.subject,
                fileUrl: data.fileUrl,
                uploaderId: uploader.id,
            },
            include: {
                uploader: true,
            },
        });

        return {
            id: resource.id,
            title: resource.title,
            description: resource.description,
            subject: resource.subject,
            fileUrl: resource.fileUrl,
            uploaderId: resource.uploaderId,
            uploaderName: resource.uploader.name,
            uploaderYear: resource.uploader.year,
            uploaderEmail: resource.uploader.email,
            uploadDate: resource.uploadDate.toISOString().split("T")[0],
        };
    },

    async deleteResource(id: string, userId: string): Promise<boolean> {
        const resource = await prisma.resource.findUnique({
            where: { id },
        });

        if (!resource) return false;
        if (resource.uploaderId !== userId) return false;

        await prisma.resource.delete({
            where: { id },
        });

        return true;
    },
};