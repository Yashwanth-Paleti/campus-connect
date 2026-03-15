import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Groq from "groq-sdk";
import { resourceDb } from "@/lib/resource-db";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function fetchPdfText(url: string): Promise<string> {
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!response.ok) return "";
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const pdfParse = require("pdf-parse");
        const parsed = await pdfParse(buffer);
        return parsed.text?.slice(0, 8000) || "";
    } catch (err) {
        console.error("PDF parse error:", err);
        return "";
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { message, subject, history } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Build context from uploaded resources
        let resourceContext = "";

        if (subject && subject !== "All") {
            const allResources = await resourceDb.getAllResources();
            const subjectResources = allResources.filter((r) => r.subject === subject);

            if (subjectResources.length > 0) {
                resourceContext = `\n\nThe following study materials have been uploaded for ${subject}:\n`;

                const resourcesToRead = subjectResources.slice(0, 3);
                for (const resource of resourcesToRead) {
                    resourceContext += `\n--- ${resource.title} (by ${resource.uploaderName}) ---\n`;
                    if (resource.fileUrl && resource.fileUrl !== "#") {
                        const pdfText = await fetchPdfText(resource.fileUrl);
                        if (pdfText) {
                            resourceContext += pdfText + "\n";
                        } else {
                            resourceContext += `[PDF content unavailable]\n`;
                        }
                    }
                }
            }
        }

        const systemPrompt = `You are an AI academic assistant for Campus Connect, a peer-to-peer academic resource sharing platform for college students.

Your role:
- Answer academic questions clearly and concisely
- Help students understand difficult concepts
- Summarize study materials when asked
- Provide examples and explanations relevant to college curriculum
- Be encouraging and supportive
- Act like a smart study buddy — friendly, knowledgeable, and always helpful

${resourceContext
                ? `Context from uploaded study materials for ${subject}:${resourceContext}\n\nUse this content to answer questions. Reference the resource title when drawing from it.`
                : "No specific subject filter is active. Answer general academic questions helpfully and thoroughly."
            }

Always be helpful, accurate, and student-friendly. Format your responses clearly using bullet points or numbered lists when explaining multi-step concepts.`;

        // Build chat history for multi-turn conversation
        const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" as const : "assistant" as const,
            content: msg.content,
        }));

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemPrompt },
                ...chatHistory,
                { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 1024,
        });

        const response = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

        return NextResponse.json({ reply: response });
    } catch (error) {
        console.error("AI chat error:", error);
        return NextResponse.json({ error: "AI assistant failed to respond" }, { status: 500 });
    }
}