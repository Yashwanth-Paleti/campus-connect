import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/navbar/Navbar";
import { BookOpen, FolderOpen, Bot, FileText, ArrowRight, CheckCircle2, Terminal } from "lucide-react";

export default function LandingPage() {
    return (
        <>
            <Navbar />
            <main className="flex-1 flex flex-col pt-10">
                {/* Hero Section */}
                <section className="px-4 py-20 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto">
                    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold mb-6 border-transparent bg-primary/10 text-primary">
                        Welcome to the future of learning
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        Share resources, <br className="hidden sm:block" />
                        <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                            access faster.
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
                        A peer-to-peer academic platform where students share study materials, collaborate, and get help from an AI assistant.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Link href="#explore">
                            <Button size="lg" className="h-14 px-8 text-base rounded-full shadow-lg group">
                                <BookOpen className="mr-2 h-5 w-5" />
                                Explore Resources
                                <ArrowRight className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Features Section */}
                <section id="explore" className="bg-muted/30 py-24 px-4 border-y border-border/40">
                    <div className="max-w-6xl mx-auto space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Platform Features</h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Everything you need to excel in your academic journey.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <FolderOpen className="w-10 h-10 text-primary mb-4" />
                                    <CardTitle>Share Academic Resources</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground">
                                    Upload and share notes, PDFs, assignments, and previous question papers with your peers effortlessly.
                                </CardContent>
                            </Card>
                            <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <FileText className="w-10 h-10 text-primary mb-4" />
                                    <CardTitle>Subject Organized Learning</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground">
                                    Browse curated materials by subjects like OS, DBMS, AI, DSA. Find exactly what you need quickly.
                                </CardContent>
                            </Card>
                            <Card className="bg-background shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <Bot className="w-10 h-10 text-primary mb-4" />
                                    <CardTitle>AI Academic Assistant</CardTitle>
                                </CardHeader>
                                <CardContent className="text-muted-foreground">
                                    Stuck on a concept? Ask our integrated AI assistant to receive instant, clear explanations and summaries.
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="py-24 px-4 max-w-6xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How It Works</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Get started in three simple steps.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-2">
                                1
                            </div>
                            <h3 className="text-xl font-semibold">Create an Account</h3>
                            <p className="text-muted-foreground">
                                Register using any email address. Secure access to all resources instantly.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-2">
                                2
                            </div>
                            <h3 className="text-xl font-semibold">Explore or Upload</h3>
                            <p className="text-muted-foreground">
                                Search through an extensive library of study materials or contribute your own.
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-2">
                                3
                            </div>
                            <h3 className="text-xl font-semibold">Learn Faster</h3>
                            <p className="text-muted-foreground">
                                Download documents and use the AI widget to clarify any confusing concepts.
                            </p>
                        </div>
                    </div>
                </section>

                {/* AI Preview Section */}
                <section className="bg-primary text-primary-foreground py-24 px-4 overflow-hidden relative">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
                                Your AI Academic Assistant
                            </h2>
                            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-md">
                                Students can ask academic questions and receive instant explanations,
                                detailed summaries, and concept breakdowns right from any page.
                            </p>
                            <ul className="space-y-4 mt-8">
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary-foreground opacity-80" />
                                    <span>24/7 instant tutoring assistance</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary-foreground opacity-80" />
                                    <span>Summarize uploaded PDF notes by subject</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-primary-foreground opacity-80" />
                                    <span>Context-aware academic answers</span>
                                </li>
                            </ul>
                            <Link href="/register">
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="mt-4 rounded-full h-12 px-8"
                                >
                                    Try it free — Register now
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Mock Chat UI */}
                        <div className="relative">
                            <div className="bg-background text-foreground rounded-2xl shadow-2xl overflow-hidden border border-border max-w-sm ml-auto">
                                <div className="bg-muted p-4 flex items-center gap-3 border-b border-border">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">AI Assistant</p>
                                        <p className="text-xs text-muted-foreground">Powered by Gemini</p>
                                    </div>
                                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                                </div>
                                <div className="p-4 space-y-4 h-[280px] overflow-hidden">
                                    <div className="flex justify-end">
                                        <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm">
                                            Can you explain BCNF in DBMS?
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-muted text-foreground p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm">
                                            BCNF is a stricter version of 3NF. A relation is in BCNF if for every non-trivial dependency X → Y, X must be a superkey. 📚
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm">
                                            Summarize my uploaded OS notes
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-muted text-foreground p-3 rounded-2xl rounded-tl-sm max-w-[85%] text-sm">
                                            Based on your uploaded OS materials, here are the key topics covered: process scheduling, memory management...
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 border-t bg-muted/30">
                                    <div className="flex gap-2 items-center bg-background rounded-lg px-3 py-2 border">
                                        <span className="text-sm text-muted-foreground flex-1">Ask anything academic...</span>
                                        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                                            <ArrowRight className="w-3 h-3 text-primary-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer id="contact" className="border-t border-border/40 py-8 text-center text-muted-foreground bg-background">
                    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2 mb-4 md:mb-0">
                            <Terminal className="h-5 w-5 text-primary opacity-50" />
                            <span className="font-semibold text-foreground opacity-80">CampusConnect</span>
                        </div>
                        <Link
                            href="mailto:support@campusconnect.edu"
                            className="text-sm hover:text-foreground hover:underline underline-offset-4 transition-colors"
                        >
                            Contact Us
                        </Link>
                    </div>
                </footer>
            </main>
        </>
    );
}