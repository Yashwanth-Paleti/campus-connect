"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, File, X, Loader2, CheckCircle2 } from "lucide-react";
import { Resource } from "@/lib/types";

const SUBJECTS = ["CN", "FSD", "DBMS", "OS", "DSA", "AI", "ML", "OOP", "SE", "TOC", "Maths", "Physics", "General"];

export function UploadForm({ onUploadSuccess }: { onUploadSuccess?: (resource: Resource) => void }) {
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const subject = formData.get("subject") as string;

        try {
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    subject,
                    fileUrl: "mock-s3-url.pdf",
                })
            });
            if (res.ok) {
                const newResource = await res.json();
                onUploadSuccess?.(newResource);
            }
        } catch (e) { console.error(e) }

        setIsUploading(false);
        setIsSuccess(true);

        setTimeout(() => {
            setIsSuccess(false);
            setFile(null);
            (e.target as HTMLFormElement).reset();
            // Optional: you can invoke it here or above, since we already did above, just keep reset.
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-card border border-border rounded-xl shadow-sm">
            <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">Upload Resource</h2>
                <p className="text-muted-foreground text-sm">Share your notes, assignments, or previous papers with your peers.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required placeholder="e.g., OS Chapter 1 Notes" />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Briefly describe what this resource covers..."
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select name="subject" required defaultValue="General">
                        <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                            {SUBJECTS.map((sub) => (
                                <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>File (PDF only)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted/30 transition-colors hover:bg-muted/50">
                        {!file ? (
                            <div className="flex flex-col items-center gap-2">
                                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PDF (MAX. 10MB)</p>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    id="file-upload"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                                <Button variant="secondary" size="sm" className="mt-2" type="button" onClick={() => document.getElementById('file-upload')?.click()}>
                                    Select File
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between bg-background border border-border p-3 rounded-md">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <File className="w-5 h-5 text-primary shrink-0" />
                                    <span className="text-sm font-medium truncate">{file.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setFile(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={!file || isUploading || isSuccess}>
                {isUploading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                    </>
                ) : isSuccess ? (
                    <>
                        <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Uploaded Successfully
                    </>
                ) : (
                    "Upload Resource"
                )}
            </Button>
        </form>
    );
}
