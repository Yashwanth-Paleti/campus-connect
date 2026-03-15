"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, User, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const SUBJECTS = ["All", "CN", "DBMS", "OS", "DSA", "AI", "ML", "OOP", "SE", "TOC", "Maths", "Physics"];

const SUGGESTIONS = [
    "Explain DBMS normalization",
    "What is TCP vs UDP?",
    "Summarize OS scheduling algorithms",
    "What is Big O notation?",
    "Explain binary search tree",
];

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: string;
}

export function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "ai",
            content: "Hi! I'm your AI academic assistant 👋\n\nI can answer questions, explain concepts, and summarize study materials. Select a subject filter to get answers based on your uploaded resources!",
            timestamp: new Date().toLocaleTimeString(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [subject, setSubject] = useState("All");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            inputRef.current?.focus();
        }
    }, [messages, isOpen]);

    const sendMessage = async (text?: string) => {
        const messageText = text || input.trim();
        if (!messageText || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: messageText,
            timestamp: new Date().toLocaleTimeString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        // Build history for multi-turn (exclude welcome message)
        const history = messages
            .filter((m) => m.id !== "welcome")
            .map((m) => ({ role: m.role, content: m.content }));

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: messageText,
                    subject,
                    history,
                }),
            });

            const data = await res.json();

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: data.reply || "Sorry, I couldn't generate a response. Please try again.",
                timestamp: new Date().toLocaleTimeString(),
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "ai",
                    content: "Something went wrong. Please try again.",
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: "welcome",
                role: "ai",
                content: "Chat cleared! How can I help you?",
                timestamp: new Date().toLocaleTimeString(),
            },
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            {/* Chat Panel */}
            {isOpen && (
                <div className="w-[380px] h-[560px] bg-card border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <div>
                                <p className="text-primary-foreground font-semibold text-sm">AI Assistant</p>
                                <p className="text-primary-foreground/70 text-xs">Powered by Gemini</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                                onClick={clearChat}
                                title="Clear chat"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Subject Filter */}
                    <div className="px-3 py-2 border-b bg-muted/30">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">Subject context:</span>
                            <Select value={subject} onValueChange={setSubject}>
                                <SelectTrigger className="h-7 text-xs flex-1">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {SUBJECTS.map((s) => (
                                        <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {subject !== "All" && (
                            <p className="text-xs text-primary mt-1">
                                📚 Reading uploaded {subject} materials for context
                            </p>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                            >
                                {/* Avatar */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "ai"
                                        ? "bg-primary/10 text-primary"
                                        : "bg-secondary text-secondary-foreground"
                                    }`}>
                                    {msg.role === "ai"
                                        ? <Bot className="w-4 h-4" />
                                        : <User className="w-4 h-4" />
                                    }
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                                        : "bg-muted text-foreground rounded-tl-sm"
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    <p className={`text-xs mt-1 ${msg.role === "user"
                                            ? "text-primary-foreground/60"
                                            : "text-muted-foreground"
                                        }`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-4 h-4" />
                                </div>
                                <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2">
                                    <div className="flex gap-1 items-center h-5">
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions (show only when no user messages yet) */}
                    {messages.length === 1 && (
                        <div className="px-3 pb-2">
                            <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
                            <div className="flex flex-wrap gap-1">
                                {SUGGESTIONS.slice(0, 3).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => sendMessage(s)}
                                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full hover:bg-primary/20 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t">
                        <div className="flex gap-2">
                            <Input
                                ref={inputRef}
                                placeholder="Ask anything academic..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                                className="text-sm"
                            />
                            <Button
                                size="icon"
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || isLoading}
                            >
                                {isLoading
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Send className="w-4 h-4" />
                                }
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
                {isOpen
                    ? <X className="w-6 h-6 text-primary-foreground" />
                    : <MessageCircle className="w-6 h-6 text-primary-foreground" />
                }
            </button>
        </div>
    );
}