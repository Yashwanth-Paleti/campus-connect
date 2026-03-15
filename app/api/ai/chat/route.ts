import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { resourceDb } from "@/lib/resource-db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function fetchPdfText(url: string): Promise<string> {
    try {
        const response = await fetch(url);
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
            // Fetch resources for selected subject
            const allResources = await resourceDb.getAllResources();
            const subjectResources = allResources.filter((r) => r.subject === subject);

            if (subjectResources.length > 0) {
                resourceContext = `\n\nThe following study materials have been uploaded for ${subject}:\n`;

                // Extract text from up to 3 PDFs to stay within token limits
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
 
${resourceContext ? `Context from uploaded study materials:${resourceContext}` : "No specific subject filter is active. Answer general academic questions."}
 
Always be helpful, accurate, and student-friendly. If you reference the uploaded materials, mention which resource you're drawing from.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemPrompt,
        });

        // Build chat history for multi-turn conversation
        const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: chatHistory,
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();

        return NextResponse.json({ reply: response });
    } catch (error) {
        console.error("AI chat error:", error);
        return NextResponse.json({ error: "AI assistant failed to respond" }, { status: 500 });
    }
}