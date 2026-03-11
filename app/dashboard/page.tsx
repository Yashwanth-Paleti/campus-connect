"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { ChatPanel } from "@/components/chat-panel/ChatPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/resource-card/ResourceCard";
import { UploadForm } from "@/components/upload-form/UploadForm";
import { SearchBar } from "@/components/search-bar/SearchBar";
import { SubjectFilter } from "@/components/subject-filter/SubjectFilter";
import { Resource } from "@/lib/types";
import { Loader2, Library, Upload, Inbox, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SUBJECTS = ["All", "CN", "DBMS", "OS", "DSA", "AI", "ML", "OOP", "SE", "TOC", "Maths", "Physics", "General"];

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const [resources, setResources] = useState<Resource[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("All");

    useEffect(() => {
        if (status === "authenticated") {
            loadResources();
        }
    }, [status]);

    const loadResources = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/resources");
            if (res.ok) {
                const data = await res.json();
                setResources(data);
            }
        } catch (err) {
            console.error(err);
        }
        setIsLoading(false);
    };

    const handleUploadSuccess = (newResource: Resource) => {
        setResources((prev) => [newResource, ...prev]);
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/resources/${id}`, { method: "DELETE" });
            if (res.ok) {
                setResources((prev) => prev.filter((r) => r.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredResources = resources.filter((r) => {
        const matchesSearch =
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.uploaderName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSubject = selectedSubject === "All" || r.subject === selectedSubject;
        return matchesSearch && matchesSubject;
    });

    if (status === "loading") {
        return (
            <div className="flex h-screen items-center justify-center bg-muted/20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-muted/20 space-y-4">
                <h2 className="text-2xl font-semibold">Authentication Required</h2>
                <p className="text-muted-foreground">Please log in to access your dashboard.</p>
                <Link href="/login">
                    <Button className="gap-2">
                        <LogIn className="w-4 h-4" /> Go to Login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/20">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
                <header className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-lg">Welcome back, {session?.user?.name}</p>
                </header>

                <Tabs defaultValue="resources" className="space-y-6">
                    <TabsList className="bg-background border border-border">
                        <TabsTrigger value="resources" className="gap-2">
                            <Library className="w-4 h-4" />
                            Resources
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="gap-2">
                            <Upload className="w-4 h-4" />
                            Upload
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="resources" className="space-y-6 slide-in-from-bottom-2 fade-in animate-in duration-300">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                            <SubjectFilter value={selectedSubject} onChange={setSelectedSubject} subjects={SUBJECTS} />
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                                <p>Loading study materials...</p>
                            </div>
                        ) : filteredResources.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredResources.map((resource) => (
                                    <ResourceCard
                                        key={resource.id}
                                        resource={resource}
                                        currentUserId={session?.user?.id}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border rounded-xl bg-background/50">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Inbox className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    We couldn't find any resources matching your criteria. Try adjusting your search or be the first to upload materials.
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="upload" className="slide-in-from-bottom-2 fade-in animate-in duration-300">
                        <UploadForm onUploadSuccess={handleUploadSuccess} />
                    </TabsContent>
                </Tabs>
            </main>

            {/* Floating global chat widget block (since Navbar handles its own presence, chat can just be included here or globally inside layout, but layout is a server component unless wrapping a client child. Providing it here is fine since User accesses this via dashboard or landing.) */}
            <ChatPanel />
        </div>
    );
}
