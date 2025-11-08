'use client';
import useProject from "@/hooks/use-projects";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import CommitLog from "./commit-log";
import AskQuestion from "./ask-question";
import MeetingCard from "./meeting-card";
import InviteButton from "./invite";
import ArchiveButton from "./archive-button";
import TeamMembers from "./team-members";
const DashBoardPage = () => {
    const { user } = useUser();
    const { project } = useProject();
    return (
        <div>
            <div className="flex items-center justify-between flex-wrap gap-y-4">
                {/* Github link */}
                <div className="w-fit rounded-md bg-primary px-4 py-3 dark:bg-gray-300 ">
                    <div className="flex items-center">
                        <Github className="size-5 text-white dark:text-gray-800" />
                        <div className="ml-2">
                            <p className="text-sm font-medium text-white dark:text-gray-800">
                                This project is linked to {' '}
                                <Link href={project?.githubUrl ?? ""} className="inline-flex items-center text-white/80 hover:underline dark:text-gray-800">{project?.githubUrl}
                                    <ExternalLink className="ml-1 size-4" />
                                </Link>
                            </p>
                        </div>
                    </div>

                </div>
                <div className="mt-4"></div>
                {/* Side button */}
                <div className="flex items-center gap-4">
                    <TeamMembers />
                    <InviteButton />
                    <ArchiveButton />
                </div>

            </div>

            <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
                    <AskQuestion />
                    <MeetingCard />
                </div>
            </div>
            <div className="mt-8"></div>
            <CommitLog />
        </div>
    )
}

export default DashBoardPage;