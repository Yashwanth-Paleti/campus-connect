export type Role = "Junior" | "Senior" | "Alumni";

export interface User {
    id?: string;
    name: string;
    email: string;
    year: string;
    department: string;
    role: string;
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    subject: string;
    uploaderName: string;
    uploaderYear: string;
    uploaderEmail: string;  // ← ADD THIS
    uploadDate: string;
    fileUrl: string;
    uploaderId: string;
}

export interface ChatMessage {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: string;
}