import { Document } from "@langchain/core/documents";
import { GoogleGenAI } from "@google/genai";
import { OpenRouter } from "@openrouter/sdk";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const openRouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY,
});
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});


const basePrompt = "You are an expert software engineer and technical documentation writer.\n\n" +
    "I will provide a git diff output. Your task is to read it carefully and produce a **concise, high-level summary** of what was changed, added, or removed. Focus on the intent and key effects, not line-by-line details.\n\n" +
    "### How to interpret the diff:\n" +
    "- Lines starting with '+' are **added**.\n" +
    "- Lines starting with '-' are **removed**.\n" +
    "- Lines without these symbols provide **context** (filenames, modes, unchanged lines).\n" +
    "- Each file change begins with: diff --git a/<old_file> b/<new_file>.\n" +
    "- Metadata lines like `new file mode`, `index`, `---` / `+++` indicate file creation, modification, or deletion.\n\n" +
    "### Your response should include:\n" +
    "1. **Summary (1–3 sentences)** — concise overview of the overall changes, new functionality, fixes, or docs.\n" +
    "2. **Optional file notes** — if relevant, 1 line per file describing its type or key change. Do not include full file details.\n" +
    "3. **Format example:**\n\n" +
    "**Summary:**\n" +
    "Adds a Linux installer for Ollama and WSL setup instructions.\n\n" +
    "**File notes:**\n" +
    "- install_ollama.sh: New shell script for Linux installation and systemd setup.\n" +
    "- running_on_wsl.md: New documentation for running the stack on Windows via WSL.\n\n" +
    "### Rules:\n" +
    "- Keep it short and informative.\n" +
    "- Focus on conceptual changes, new features, or docs.\n" +
    "- Use markdown (`**bold**, lists`).\n" +
    "- Do not echo the raw diff.\n\n";

export const aiSummariseCommit = async (diff: string) => {
    const fullPrompt = `${basePrompt}\n\nNow, here is the diff:\n\n${diff}`;

    const res = await openRouter.chat.send({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'system',
                content: "You are an expert developer assistant. Write a well-structured summary of this git diff using markdown.",
            },
            {
                role: 'user',
                content: fullPrompt,
            },
        ],
        stream: false,
    });

    if (!res) return;
    return res.choices[0]?.message.content;
};

export async function summariseCode(doc: Document) {
    console.log("getting summary for", doc.metadata.source);
    const code = doc.pageContent.slice(0, 10000);
    const fileName = doc.metadata.fileName;

    const systemInstruction =
        "You are an intelligent senior software engineer who specializes in onboarding junior developers. " +
        "Your goal is to explain the provided code's purpose and functionality in a friendly, " +
        "encouraging, and highly professional manner. You must write a well-structured summary using Markdown.";

    const userQuery = `
Please provide an explanation for the file: **${fileName}**.

Focus on the core purpose, main functions, and any important implementation details relevant to a new team member.

--- CODE START ---
${code}
--- CODE END ---
    `;

    try {
        const res = await openRouter.chat.send({
            model: 'openai/gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: systemInstruction,
                },
                {
                    role: 'user',
                    content: userQuery,
                },
            ],
            stream: false,
        });

        const summary = res.choices[0]?.message.content?.toString();
        if (!summary) throw new Error("Cannot generate Code summary");
        return summary;
    } catch (error) {
        console.error("Error summarizing code:", error);
        return ' ';
    }
}

export async function generateEmbedding(summary: string) {
    const response = await ai.models.embedContent({
        model: 'text-embedding-004',
        contents: summary
    });

    return response.embeddings![0]?.values || [];
}