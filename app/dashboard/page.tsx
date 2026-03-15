"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, Download, Trash2, Search, LogOut, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Resource } from "@/lib/types";
import { createClient } from "@supabase/supabase-js";
import { AIChatWidget } from "@/components/chat-widget/AIChatWidget";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const SUBJECTS = ["CN", "DBMS", "OS", "DSA", "AI", "ML", "OOP", "SE", "TOC", "Maths", "Physics"];

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<"resources" | "upload">("resources");
    const [resources, setResources] = useState<Resource[]>([]);
    const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
    const [isLoadingResources, setIsLoadingResources] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState("title");
    const [subjectFilter, setSubjectFilter] = useState("All");

    // Upload form state
    const [uploadTitle, setUploadTitle] = useState("");
    const [uploadDesc, setUploadDesc] = useState("");
    const [uploadSubject, setUploadSubject] = useState("CN");
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    const fetchResources = async () => {
        setIsLoadingResources(true);
        try {
            const res = await fetch("/api/resources");
            const data = await res.json();
            setResources(data);
            setFilteredResources(data);
        } catch (err) {
            console.error("Failed to fetch resources");
        } finally {
            setIsLoadingResources(false);
        }
    };

    useEffect(() => {
        if (status === "authenticated") {
            fetchResources();
        }
    }, [status]);

    useEffect(() => {
        let filtered = resources;

        if (subjectFilter !== "All") {
            filtered = filtered.filter((r) => r.subject === subjectFilter);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((r) => {
                if (searchBy === "title") return r.title.toLowerCase().includes(q);
                if (searchBy === "subject") return r.subject.toLowerCase().includes(q);
                if (searchBy === "uploader") return r.uploaderName.toLowerCase().includes(q);
                return true;
            });
        }

        setFilteredResources(filtered);
    }, [searchQuery, searchBy, subjectFilter, resources]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) {
            setUploadError("Please select a PDF file");
            return;
        }

        setIsUploading(true);
        setUploadError("");
        setUploadSuccess(false);

        try {
            // Step 1 — Upload file directly to Supabase Storage from browser
            const fileName = `${Date.now()}-${uploadFile.name.replace(/\s+/g, "-")}`;

            const { error: storageError } = await supabase.storage
                .from("resources")
                .upload(fileName, uploadFile, {
                    contentType: "application/pdf",
                    upsert: false,
                });

            if (storageError) {
                setUploadError("File upload failed: " + storageError.message);
                return;
            }

            // Step 2 — Get public URL
            const { data: urlData } = supabase.storage
                .from("resources")
                .getPublicUrl(fileName);

            // Step 3 — Save metadata as JSON to API
            const res = await fetch("/api/resources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: uploadTitle,
                    description: uploadDesc,
                    subject: uploadSubject,
                    fileUrl: urlData.publicUrl,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setUploadError(data.error || "Failed to save resource");
                return;
            }

            setUploadSuccess(true);
            setUploadTitle("");
            setUploadDesc("");
            setUploadSubject("CN");
            setUploadFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchResources();
            setTimeout(() => {
                setActiveTab("resources");
                setUploadSuccess(false);
            }, 1500);

        } catch (err) {
            setUploadError("Something went wrong. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this resource?")) return;

        try {
            const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
            if (res.ok) {
                setResources((prev) => prev.filter((r) => r.id !== id));
            }
        } catch (err) {
            console.error("Delete failed");
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="border-b bg-card sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        <span className="font-bold text-lg">Campus Connect</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground hidden sm:block">
                            {session?.user?.name}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => signOut({ callbackUrl: "/login" })}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Welcome back, {session?.user?.name} 👋
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b">
                    <button
                        onClick={() => setActiveTab("resources")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "resources"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Resources
                    </button>
                    <button
                        onClick={() => setActiveTab("upload")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "upload"
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        Upload
                    </button>
                </div>

                {/* Resources Tab */}
                {activeTab === "resources" && (
                    <div>
                        <div className="flex flex-col sm:flex-row gap-3 mb-6">
                            <div className="flex gap-2 flex-1">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search resources..."
                                        className="pl-9"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Select value={searchBy} onValueChange={setSearchBy}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="subject">Subject</SelectItem>
                                        <SelectItem value="uploader">Uploader</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Subjects</SelectItem>
                                    {SUBJECTS.map((s) => (
                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {isLoadingResources ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : filteredResources.length === 0 ? (
                            <div className="text-center py-20 text-muted-foreground">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">No resources found.</p>
                                <p className="text-sm">Be the first to upload study materials.</p>
                                <Button className="mt-4" onClick={() => setActiveTab("upload")}>
                                    Upload Resource
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredResources.map((resource) => (
                                    <div
                                        key={resource.id}
                                        className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                {resource.subject}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {resource.uploadDate}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                                            {resource.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                                            {resource.description}
                                        </p>
                                        <div className="text-xs text-muted-foreground mb-4">
                                            By <span className="font-medium text-foreground">{resource.uploaderName}</span>
                                            {" · "}Year {resource.uploaderYear}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => window.open(resource.fileUrl, "_blank")}
                                            >
                                                <Download className="w-3 h-3 mr-1" />
                                                Download
                                            </Button>
                                            {session?.user?.email === resource.uploaderEmail && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(resource.id)}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Upload Tab */}
                {activeTab === "upload" && (
                    <div className="max-w-lg">
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-semibold mb-6">Upload Resource</h2>
                            <form onSubmit={handleUpload} className="space-y-4">
                                {uploadError && (
                                    <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md p-3">
                                        {uploadError}
                                    </div>
                                )}
                                {uploadSuccess && (
                                    <div className="bg-green-500/10 border border-green-500/30 text-green-600 text-sm rounded-md p-3">
                                        ✅ Resource uploaded successfully!
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        placeholder="e.g. DBMS Normalization Notes"
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        placeholder="Brief description of the resource..."
                                        value={uploadDesc}
                                        onChange={(e) => setUploadDesc(e.target.value)}
                                        required
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <Select value={uploadSubject} onValueChange={setUploadSubject}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {SUBJECTS.map((s) => (
                                                <SelectItem key={s} value={s}>{s}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>PDF File</Label>
                                    <Input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".pdf"
                                        onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                                        required
                                    />
                                    {uploadFile && (
                                        <p className="text-xs text-muted-foreground">
                                            Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={isUploading}>
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4 mr-2" />
                                            Upload Resource
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <AIChatWidget />
        </div>
    );
}
