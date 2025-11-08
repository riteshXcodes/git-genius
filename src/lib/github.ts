import { Octokit } from "octokit";
import { db } from "@/server/db";
import { aiSummariseCommit } from "./operouter";
import axios from 'axios'
export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

// const githubUrl = 'https://github.com/docker/genai-stack'

type Response = {
    commitHash: string;
    commitMessage: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string
}

export const getCommmitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2);
    if (!owner || !repo) {
        throw new Error("Not a valid github url");
    }
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
    })
    const len = data.length
    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()) as any[];

    return sortedCommits.slice(0, Math.min(10, len)).map((commit: any) => ({
        commitHash: commit.sha as string,
        commitMessage: commit.commit?.message ?? "",
        commitAuthorName: commit.commit?.author?.name ?? "",
        commitAuthorAvatar: commit.author?.avatar_url ?? "",
        commitDate: commit.commit.author.date,
    }))
}

export const pollsCommits = async (projectId: string) => {
    //https://github.com/raja/algo-metnor
    try {
        const { project, githubUrl } = await fetchPrjectGithubUrl(projectId);
        console.log('fetched Project :', project, githubUrl);
        const commitHashes = await getCommmitHashes(githubUrl);
        console.log('Processing commitHashes ;', commitHashes.length);
        const unprocessCommits = await filterUnprocessedCommits(projectId, commitHashes);
        console.log('Processing unprocessed Commit :', unprocessCommits.length);
        const summaryResponses = await Promise.allSettled(unprocessCommits.map(commit => {
            return summariseCommit(githubUrl, commit.commitHash);
        }))
        const summaries = summaryResponses.map((response, index) => {
            if (response.status === 'fulfilled') {
                return response.value as string;
            } else {
                console.error(`❌ Failed to summarize commit ${index} (${unprocessCommits[index]?.commitHash}):`, {
                    reason: response.reason,
                    message: response.reason?.message,
                    code: response.reason?.code,
                    status: response.reason?.status
                });
                return "";
            }
        })

        console.log(`✅ Successfully summarized: ${summaries.filter(s => s != "").length}/${summaries.length}`);



        const commit = await db.commit.createMany({
            data: summaries.map((summary, index) => {
                console.log(`Processing commit ${index}`);
                return {
                    projectId: projectId,
                    commitHash: unprocessCommits[index]!.commitHash,
                    commitMessage: unprocessCommits[index]!.commitMessage,
                    commitAuthorName: unprocessCommits[index]!.commitAuthorName,
                    commitAuthorAvatar: unprocessCommits[index]!.commitAuthorAvatar,
                    commitDate: unprocessCommits[index]!.commitDate,
                    summary
                }
            })
        })
        return commit;
    } catch (err) {
        return { message: "Commit cannot be processed", err };
    }
}

export const fetchPrjectGithubUrl = async (projectId: string) => {
    const project = await db.project.findUnique({
        where: {
            id: projectId
        },
        select: {
            githubUrl: true
        }
    })
    if (!project?.githubUrl) {
        throw new Error("Project has no github url");
    }
    return { project, githubUrl: project.githubUrl }
}

async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]) {
    const processedCommits = await db.commit.findMany({
        where: { projectId }
    })
    const unporcessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit: any) => processedCommit.commitHash === commit.commitHash))

    return unporcessedCommits;
}

async function summariseCommit(githubUrl: string, commitHash: string) {
    const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
        headers: {
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    return await aiSummariseCommit(data) || "";
}