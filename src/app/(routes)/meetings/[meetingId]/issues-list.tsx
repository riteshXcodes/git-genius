'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type RouterOutputs } from "@/trpc/react";
import { Loader, VideoIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type Props = {
    meetingId: string
}

const IssueList = ({ meetingId }: Props) => {
    const { data: meeting, isLoading } = api.project.getMeetingById.useQuery({ meetingId }, {
        refetchInterval: 4000
    });

    if (isLoading || !meeting) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500 flex-col">
                <Loader className="animate-spin h-6 w-6 mb-2" />
                <p className="text-secondary-foreground font-medium">Loading meeting details...</p>
            </div>
        )
    }

    return (
        <>
            <div className="p-8">
                <div className="mx-auto flex max-w-2xl items-center justify-between gap-x-8 border-b pb-6 lg:mx-0 lg:max-w-none">
                    <div className="flex items-center gap-x-6">
                        <div className="rounded-full border bg-white p-3">
                            <VideoIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h1>
                                <div className="text-sm leading-6 text-gray-600">
                                    Meeting on {meeting.createdAt.toLocaleDateString()}
                                </div>
                                <div className="mt-1 text-base font-semibold leading-6 text-gray-900">
                                    {meeting.name}
                                </div>
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="h-4"></div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {meeting.issues.map(issue => <IssueCard key={issue.id} issue={issue} />)}
                </div>
            </div>
        </>
    )
}

function IssueCard({ issue }: { issue: NonNullable<RouterOutputs["project"]["getMeetingById"]>["issues"][number] }) {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {issue.gist}
                        </DialogTitle>
                        <DialogDescription>{issue.createdAt.toLocaleDateString()}</DialogDescription>
                    </DialogHeader>
                    <p className="text-gray-600 mt-2">
                        {issue.headline}
                    </p>
                    <blockquote className="mt-2 border-l-4 border-gray-300 bg-gray-50 p-4">
                        <span className="text-sm text-gray-600">{issue.start} - {issue.end}</span>
                        <p className="font-medium italic leading-relaxed text-gray-900 mt-1">{issue.summary}</p>
                    </blockquote>
                </DialogContent>
            </Dialog>
            <Card className="relative cursor-pointer" onClick={() => setOpen(true)}>
                <CardHeader>
                    <CardTitle className="text-xl">
                        {issue.gist}
                    </CardTitle>
                    <div className="border-b"></div>
                    <CardDescription className="pt-2">{issue.headline}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
                        View Details
                    </Button>
                </CardContent>
            </Card>
        </>
    )
}

export default IssueList;