"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { AuthCard } from "@/components/auth-card/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        setIsLoading(false);

        if (result?.error) {
            alert("Invalid email or password");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="relative min-h-screen grid bg-muted/20">
            <Link href="/" className="absolute top-8 left-8 text-sm font-medium text-muted-foreground hover:text-foreground">
                ← Back to Home
            </Link>
            <AuthCard title="Campus Connect" description="Login to your account">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m.scott@campus.edu"
                                required
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Login
                    </Button>
                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            Register
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </div>
    );
}
