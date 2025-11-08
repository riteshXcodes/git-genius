// import { createGitHubRepo } from "@/lib/anthropic";
// import type z from "zod";

// pushTogitHub: protectedProcedure.input(z.object({
//     githubToken: z.string(),
//     repoName: z.string(),
// })).mutation(async ({ ctx, input }) => {
//     const repoUrl = await createGitHubRepo({ name: input.repoName, files: appFiles }, input.githubToken);
//     return repoUrl
// })





// export async function pushTogitHub(githubToken: string, repoName: string) {
//     const repoUrl = await createGitHubRepo(repoName)
// }