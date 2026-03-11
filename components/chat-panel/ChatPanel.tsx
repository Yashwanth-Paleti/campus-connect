"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ChatPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        const aiResponse = await new Promise<string>((resolve) => {
            setTimeout(() => {
                resolve("I'm a simulated AI assistant for Campus Connect. In a real app, I'd connect to an LLM provider like OpenAI or Anthropic.");
            }, 1000);
        });

        const botMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: aiResponse,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            <h3 className="font-semibold">AI Academic Assistant</h3>
                        </div>
                        <button
                            onClick={toggleOpen}
                            className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-muted/30">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground px-4">
                                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-sm font-medium">How can I help you today?</p>
                                <div className="flex flex-col gap-2 mt-6 w-full">
                                    <p className="text-xs text-left text-muted-foreground mb-1">Suggestions:</p>
                                    {[
                                        "Explain DBMS normalization",
                                        "What is TCP vs UDP",
                                        "Summarize Operating Systems basics",
                                    ].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setInput(suggestion)}
                                            className="text-xs text-left bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg transition-colors border border-border/50"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                                        msg.role === "user"
                                            ? "bg-primary text-primary-foreground self-end"
                                            : "bg-muted text-foreground self-start"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            ))
                        )}
                        {isLoading && (
                            <div className="self-start bg-muted text-foreground max-w-[85%] rounded-2xl px-4 py-3">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-card border-t border-border">
                        <form
                            onSubmit={handleSend}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 px-4 py-2 text-sm bg-muted/50 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="rounded-full w-9 h-9 shrink-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <Button
                onClick={toggleOpen}
                size="icon"
                className={cn(
                    "w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105",
                    isOpen ? "bg-muted text-foreground rotate-90" : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </Button>
        </div>
    );
}
