import { Field } from "@/components/ui/field";
import { AssemblyAI } from "assemblyai";
const client = new AssemblyAI({ apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY! });

function msToTime(ms: number) {
    const seconds = ms / 1000;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}m ${remainingSeconds.toString().padStart(2, '0')}s`;
}

export const processMeeting = async (meetingUrl: string) => {
    const trnanscript = await client.transcripts.transcribe({
        audio: meetingUrl,
        auto_chapters: true,
    })
    const summaries = trnanscript.chapters?.map(chapter => ({
        start: msToTime(chapter.start),
        end: msToTime(chapter.end),
        gist: chapter.gist,
        headline: chapter.headline,
        summary: chapter.summary,
    })) || [];

    if (!trnanscript.text) throw new Error("No trnanscript text found");
    return {
        trnanscript,
        summaries
    }
}