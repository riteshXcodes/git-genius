'use client'
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-projects"
import { api } from "@/trpc/react";
import MeetingCard from "../dashboard/meeting-card";
import { Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

const MeetingPage = () => {
    const { projectId } = useProject();
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId }, {
        refetchInterval: 4000
    });
    const deleteMeeting = api.project.deleteMeeting.useMutation();
    const refetch = useRefetch();

    return (
        <>
            <MeetingCard />
            <div className="h-6"></div>
            <h1 className="text-xl font-semibold">Meetings</h1>
            {meetings && meetings.length === 0 && (
                <div className="flex items-center justify-center py-12 flex-col">
                    No meetings found
                </div>
            )}
            {isLoading && (
                <div className="flex items-center justify-center py-12 text-gray-500 flex-col">
                    <Loader className="animate-spin h-6 w-6 mb-2" />
                    <p className="text-secondary-foreground font-medium">Loading Meetings</p>
                </div>
            )}
            <ul className="divide-y divide-gray-200">
                {meetings?.map((meeting) => (
                    <li key={meeting.id} className="flex items-center justify-between py-5 gap-x-6 shadow rounded-md p-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out">
                        <div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <Link href={`/meetings/${meeting.id}`} className="text-sm font-semibold">
                                        {meeting.name}
                                    </Link>
                                    {meeting.status === 'PROCESSING' && (
                                        <Badge className="bg-yellow-500 text-white">Processing...</Badge>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 gap-x-2">
                                <p className="whitespace-nowrap">{meeting.createdAt.toLocaleDateString()}</p>
                                <p className="truncate">{meeting.issues.length} issues</p>
                            </div>
                        </div>
                        <div className="flex items-center flex-none gap-x-2">
                            <Link href={`/meetings/${meeting.id}`}>
                                <Button variant="outline">View Meeting</Button>
                            </Link>
                            <Button
                                disabled={deleteMeeting.isPending}
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteMeeting.mutate({ meetingId: meeting.id }, {
                                    onSuccess: () => {
                                        toast.success("Meeting deleted successfully");
                                        refetch();
                                    }
                                })}
                            >
                                Delete
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default MeetingPage;