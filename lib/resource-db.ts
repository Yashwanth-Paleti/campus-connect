import { Resource } from "./types";
import { UserWithPassword, authClient } from "./auth-client";

const mockResourcesDb: Resource[] = [
    {
        id: "1",
        title: "Introduction to Computer Networks",
        description: "Comprehensive notes for mid-sem exam",
        subject: "CN",
        uploaderName: "Alice Smith",
        uploaderYear: "3",
        uploadDate: new Date().toISOString().split('T')[0],
        fileUrl: "#",
        uploaderId: "mock-alice-id",
    },
    {
        id: "2",
        title: "DBMS Normalization Cheat Sheet",
        description: "Quick reference guide for 1NF to 5NF",
        subject: "DBMS",
        uploaderName: "Bob Jones",
        uploaderYear: "4",
        uploadDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        fileUrl: "#",
        uploaderId: "mock-bob-id",
    },
];

export const resourceDb = {
    async getAllResources(): Promise<Resource[]> {
        return mockResourcesDb;
    },

    async createResource(data: Omit<Resource, "id" | "uploadDate" | "uploaderName" | "uploaderYear">, userEmail: string): Promise<Resource | null> {
        const uploader = await authClient.findUserByEmail(userEmail);

        if (!uploader) return null;

        const newResource: Resource = {
            id: Math.random().toString(36).substring(7),
            title: data.title,
            description: data.description,
            subject: data.subject,
            fileUrl: data.fileUrl,
            uploaderId: uploader.id!,
            uploaderName: uploader.name,
            uploaderYear: String(uploader.year),
            uploadDate: new Date().toISOString().split('T')[0],
        };

        mockResourcesDb.push(newResource);
        return newResource;
    },

    async deleteResource(id: string, userId: string): Promise<boolean> {
        const index = mockResourcesDb.findIndex(r => r.id === id);
        if (index === -1) return false;

        if (mockResourcesDb[index].uploaderId !== userId) return false;

        mockResourcesDb.splice(index, 1);
        return true;
    }
};
