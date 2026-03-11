"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function TestDbPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setResult(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
        };

        try {
            const response = await fetch("/api/test-db", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const json = await response.json();
            setResult({ status: response.status, data: json });
        } catch (error: any) {
            setResult({ status: "Error", data: { error: error.message } });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-muted/20 flex flex-col items-center py-12 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Test Database Connection</CardTitle>
                    <CardDescription>
                        Submit this form to test if the Next.js API can connect to your Supabase PostgreSQL database using the credentials in <code>.env</code>.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Test Name</label>
                            <Input id="name" name="name" required placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Test Email</label>
                            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Testing...
                                </>
                            ) : (
                                "Test DB Connection"
                            )}
                        </Button>
                    </form>

                    {result && (
                        <div className={`mt-6 p-4 rounded-lg border text-sm overflow-auto ${result.status === 200 ? 'bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400' : 'bg-destructive/10 border-destructive/50 text-destructive'
                            }`}>
                            <h3 className="font-semibold mb-2">Connection Result:</h3>
                            <pre className="whitespace-pre-wrap font-mono text-xs">
                                {JSON.stringify(result.data, null, 2)}
                            </pre>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="mt-8 max-w-md text-sm text-muted-foreground p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <strong>Important Note:</strong>
                <p className="mt-2">
                    Your registrations won't save yet because the <strong>password currently in your <code>.env</code> is incorrect</strong>.
                    The database server is rejecting the connection with <code>password authentication failed</code>.
                </p>
                <p className="mt-2 text-primary hover:underline">
                    <a href="https://supabase.com/dashboard/project/_/settings/database" target="_blank" rel="noreferrer">
                        Reset your database password in Supabase →
                    </a>
                </p>
            </div>
        </div>
    );
}
