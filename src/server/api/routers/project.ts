import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { pollsCommits } from "@/lib/github";
import { checkCredits, indexGithubRepo } from "@/lib/github-loader";
import { createGitHubRepo, generateApp } from "@/lib/anthropic";
export const projectRouter = createTRPCRouter({
    createProject: protectedProcedure.input(
        z.object({
            name: z.string(),
            githubUrl: z.string(),
            githubToken: z.string().optional()
        })
    ).mutation(async ({ ctx, input }) => {
        const user = await ctx.db.user.findUnique({
            where: { id: ctx.user.userId! },
            select: { credits: true }
        })
        if (!user) throw new Error('User not found');
        const currentCredits = user.credits || 0;
        const fileCount = await checkCredits(input.githubUrl, input.githubToken)
        if (currentCredits < fileCount) {
            throw new Error('Insufficient credits');
        }
        const project = await ctx.db.project.create({
            data: {
                name: input.name,
                githubUrl: input.githubUrl,
                UserToProject: {
                    create: {
                        userId: ctx.user.userId!
                    }
                }
            }
        });
        await indexGithubRepo(project.id, input.githubUrl, input.githubToken);
        await pollsCommits(project.id);
        await ctx.db.user.update({ where: { id: ctx.user.userId! }, data: { credits: { decrement: fileCount } } })
        return project;
    }),
    getProjects: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.project.findMany({
            where: {
                UserToProject: {
                    some: {
                        userId: ctx.user.userId!
                    }
                },
                deletedAt: null
            }
        })
    }),
    getCommits: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        pollsCommits(input.projectId).then().catch(console.error);
        return await ctx.db.commit.findMany({ where: { projectId: input.projectId } })
    }),
    saveAnswer: protectedProcedure.input(z.object({
        projectId: z.string(),
        question: z.string(),
        answer: z.string(),
        fileReferences: z.any()
    })).mutation(async ({ ctx, input }) => {
        return await ctx.db.question.create({
            data: {
                answer: input.answer,
                filesReferences: input.fileReferences,
                question: input.question,
                projectId: input.projectId,
                userId: ctx.user.userId!
            }
        })
    }),
    getQuestions: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        return await ctx.db.question.findMany({
            where: {
                projectId: input.projectId
            },
            include: {
                user: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }),
    uploadMeeting: protectedProcedure.input(z.object({
        projectId: z.string(),
        meetingUrl: z.string(),
        name: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const meeting = await ctx.db.meeting.create({
            data: {
                meetingUrl: input.meetingUrl,
                name: input.name,
                projectId: input.projectId,
                status: 'PROCESSING',
            }
        })
        return meeting
    }),
    getMeetings: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        return await ctx.db.meeting.findMany({
            where: {
                projectId: input.projectId
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                issues: true
            }
        })
    }),
    deleteMeeting: protectedProcedure.input(z.object({
        meetingId: z.string()
    })).mutation(async ({ ctx, input }) => {
        return await ctx.db.meeting.delete({
            where: { id: input.meetingId }
        })
    }),
    getMeetingById: protectedProcedure.input(z.object({
        meetingId: z.string()
    })).query(async ({ ctx, input }) => {
        return await ctx.db.meeting.findUnique({
            where: { id: input.meetingId }, include: { issues: true }
        })
    }),
    archiveProject: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
        return await ctx.db.project.update({ where: { id: input.projectId }, data: { deletedAt: new Date() } })
    }),
    getTeamMembers: protectedProcedure.input(z.object({
        projectId: z.string()
    })).query(async ({ ctx, input }) => {
        return await ctx.db.userToProject.findMany({ where: { projectId: input.projectId }, include: { user: true } })
    }), getMyCredits: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.user.findUnique({
            where: {
                id: ctx.user.userId!,
            },
            select: {
                credits: true
            }
        });
    }),
    checkCredits: protectedProcedure.input(z.object({
        githubUrl: z.string(),
        githubToken: z.string().optional(),
    }))
        .mutation(async ({ ctx, input }) => {
            const token = input.githubToken || process.env.GITHUB_TOKEN;
            if (!token) throw new Error("No github token provided or configured.")
            let fileCount = 0;
            try {
                fileCount = await checkCredits(input.githubUrl, token);
            } catch (err: any) {
                console.error("Error fetching repo files:", err?.response?.data || err);

                // Handle GitHub API errors gracefully
                if (err?.response?.status === 401) {
                    throw new Error("Invalid GitHub token (401 Bad credentials).");
                }
                if (err?.response?.status === 403) {
                    throw new Error("GitHub API rate limit exceeded. Please try again later.");
                }
                throw new Error("Unable to fetch repository files.");
            }
            const userCredit = await ctx.db.user.findUnique({
                where: { id: ctx.user.userId! },
                select: { credits: true }
            })
            return {
                fileCount,
                credits: userCredit?.credits || 0
            }
        }),
    getPurchaseHistory: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.stripeTransaction.findMany({
            where: { userId: ctx.user.userId! },
            orderBy: { createdAt: 'desc' },
        });
    }),
    makeProject: protectedProcedure.input(z.object({
        userPrompt: z.string(),
    })).mutation(async ({ ctx, input }) => {
        try {
            const appFiles = await generateApp(input.userPrompt);
        } catch (error: any) {
            console.error(error);
        }
    }),
})