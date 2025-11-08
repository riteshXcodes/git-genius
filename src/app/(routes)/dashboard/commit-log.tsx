'use client'

import useProject from "@/hooks/use-projects"
import { api } from "@/trpc/react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { ExternalLink, Loader } from "lucide-react"
const CommitLog = () => {
    const { projectId, project } = useProject()
    const { data: commits, isLoading } = api.project.getCommits.useQuery({ projectId })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12 text-gray-500 flex-col">
                <Loader className="animate-spin h-6 w-6 mr-2" />
                <p className="text-secondary-foreground font-medium mr-2">Loading Commits</p>
            </div>
        )
    }
    if (!commits?.length)
        return (
            <div className="text-center text-gray-500 py-8">
                No commits found for this project yet.
            </div>
        )

    return (
        <ul className="relative border-l border-gray-200 dark:border-gray-700 pl-6 space-y-10">
            {commits.map((commit, i) => (
                <li key={commit.id} className="relative">
                    {/* Timeline Dot */}
                    <span
                        className={cn(
                            "absolute -left-[7px] top-2 h-3 w-3 rounded-full border-2 border-white",
                            "bg-blue-500 shadow-sm"
                        )}
                    />

                    <div className="rounded-lg bg-white dark:bg-gray-900 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img
                                    src={commit.commitAuthorAvatar}
                                    alt={commit.commitAuthorName}
                                    className="h-9 w-9 rounded-full border border-gray-300 dark:border-gray-700"
                                />
                                <div>
                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {commit.commitAuthorName}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {`${commit.commitDate.toLocaleTimeString()}  ${commit.commitDate.toLocaleDateString()}`}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                                target="_blank"
                                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                View on GitHub <ExternalLink className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="mt-3">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {commit.commitMessage}
                            </p>

                            {commit.summary && (
                                <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-md p-3 border border-gray-100 dark:border-gray-700">
                                    {commit.summary}
                                </pre>
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

export default CommitLog
