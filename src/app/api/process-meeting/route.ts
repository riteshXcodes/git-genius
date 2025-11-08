import { processMeeting } from "@/lib/assembly";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";
import { any, z } from "zod";
import ignore from "ignore";
import ts from "typescript";
const bodyParser = z.object({
    meetingUrl: z.string(),
    projectId: z.string(),
    meetingId: z.string()
})
export const maxDuration = 300; // 5 minutes in seconds
export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const body = await req.json();
        const { meetingUrl, projectId, meetingId } = bodyParser.parse(body);
        const { summaries } = await processMeeting(meetingUrl);
        await db.issue.createMany({
            // @ts-ignore
            data: summaries.map(summary => ({
                start: summary.start,
                end: summary.end,
                gist: summary.gist,
                headline: summary.headline,
                summary: summary.summary,
                meetingId
            }))
        })
        await db.meeting.update({
            where: { id: meetingId }, data: {
                status: 'COMPLETED',
                name: summaries[0]!.headline
            }
        })
        return NextResponse.json({ message: "Meeting processed successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}