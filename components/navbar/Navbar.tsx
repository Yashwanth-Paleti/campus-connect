"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Terminal, Moon, Sun, BookOpen, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session } = useSession();

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDashboard = pathname.startsWith("/dashboard");

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Terminal className="h-6 w-6 text-primary" />
                    <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-1">
                        Campus<span className="text-primary">Connect</span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {!isDashboard ? (
                        <>
                            <Link href="/landing#explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                <BookOpen className="w-4 h-4" />
                                Explore Resources
                            </Link>
                            <Link href="/landing#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Contact
                            </Link>
                            <div className="h-4 w-px bg-border mx-2" />
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">Register</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <span className="text-sm font-medium px-3 py-1 bg-muted rounded-full text-muted-foreground border border-border">
                                {session?.user?.name || "Dashboard"}
                            </span>
                            <div className="h-4 w-px bg-border mx-2" />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => signOut({ callbackUrl: '/' })}
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Button>
                        </>
                    )}

                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full"
                        >
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="flex md:hidden items-center gap-4">
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="rounded-full"
                        >
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border/40 p-4 flex flex-col gap-4 bg-background">
                    {!isDashboard ? (
                        <>
                            <Link href="/landing#explore" className="text-sm font-medium p-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                                Explore Resources
                            </Link>
                            <Link href="/landing#contact" className="text-sm font-medium p-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                                Contact
                            </Link>
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="outline" className="w-full justify-start">Login</Button>
                            </Link>
                            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full justify-start">Register</Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="text-sm font-medium p-2">{session?.user?.name || "Dashboard Active"}</div>
                            <Button
                                variant="ghost"
                                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    signOut({ callbackUrl: '/' });
                                }}
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
