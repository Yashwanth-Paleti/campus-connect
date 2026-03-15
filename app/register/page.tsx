"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthCard } from "@/components/auth-card/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const YEARS = ["1", "2", "3", "4", "Alumni"];
const DEPARTMENTS = ["CSE", "IT", "ECE", "EEE", "ME", "Civil", "Other"];

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedYear, setSelectedYear] = useState("1");
    const [selectedDept, setSelectedDept] = useState("CSE");



    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    year: selectedYear,
                    department: selectedDept,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                setIsLoading(false);
                return;
            }

            // Success — redirect to login
            router.push("/login");
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen grid bg-muted/20 pb-8 pt-12 md:py-0">
            <Link
                href="/"
                className="absolute top-8 left-8 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
                ← Back to Home
            </Link>
            <AuthCard title="Create Account" description="Join your academic community">
                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-4">
                        {/* Error message */}
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-md p-3">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Michael Scott"
                                required
                            />
                        </div>

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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="year">Current Year</Label>
                                <Select
                                    value={selectedYear}
                                    onValueChange={setSelectedYear}
                                    required
                                >
                                    <SelectTrigger id="year">
                                        <SelectValue placeholder="Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {YEARS.map((y) => (
                                            <SelectItem key={y} value={y}>
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="department">Department</Label>
                                <Select
                                    value={selectedDept}
                                    onValueChange={setSelectedDept}
                                    required
                                >
                                    <SelectTrigger id="department">
                                        <SelectValue placeholder="Dept" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEPARTMENTS.map((d) => (
                                            <SelectItem key={d} value={d}>
                                                {d}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Register
                    </Button>

                    <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                            Already have an account?{" "}
                        </span>
                        <Link
                            href="/login"
                            className="text-primary hover:underline font-medium"
                        >
                            Login
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </div>
    );
}
