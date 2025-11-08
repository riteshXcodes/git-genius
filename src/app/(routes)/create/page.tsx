'use client'
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";
import { Info } from "lucide-react";
import { redirect } from "next/navigation";

type FormInput = {
    repoUrl: string;
    projectName: string;
    githubtoken?: string;
};

const CreatePage = () => {
    const { register, handleSubmit, reset } = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch = useRefetch();
    const checkCredits = api.project.checkCredits.useMutation();

    function onSubmit(data: FormInput) {
        if (!!checkCredits.data) {
            createProject.mutate(
                {
                    name: data.projectName,
                    githubUrl: data.repoUrl,
                    githubToken: data.githubtoken,
                },
                {
                    onSuccess: () => {
                        toast.success("Project created successfully!");
                        refetch();
                        reset();
                        checkCredits.reset();
                    },
                    onError: (err) => {
                        toast.error(`Error creating project: ${err.message}`);
                    },
                }
            );
        } else {
            checkCredits.mutate(
                {
                    githubUrl: data.repoUrl,
                    githubToken: data.githubtoken,
                },
                {
                    onError: (err) => {
                        toast.error(`Error checking credits: ${err.message}`);
                    },
                }
            );
        }

        return true;
    }

    const hasEnoughCredits = checkCredits.data?.credits
        ? checkCredits.data.fileCount <= checkCredits.data.credits
        : true;

    const isCreatingProject = !!checkCredits.data;

    return (
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 h-auto md:h-full px-4 py-10 md:py-0">
            {/* IMAGE */}
            <img
                src="/create.svg"
                alt="program"
                className="w-40 h-auto md:w-56 lg:w-64 mb-6 md:mb-0"
            />

            {/* FORM CONTAINER */}
            <div className="w-full max-w-md">
                <div>
                    <h1 className="font-semibold text-2xl text-center md:text-left">
                        Link your GitHub Repository
                    </h1>
                    <p className="text-sm text-muted-foreground text-center md:text-left">
                        Enter the URL of your repository to link it to GitGenius
                    </p>
                </div>

                <div className="h-4"></div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                    <Input
                        required
                        {...register("projectName")}
                        placeholder="Project Name"
                        disabled={isCreatingProject}
                    />
                    <Input
                        required
                        {...register("repoUrl")}
                        placeholder="GitHub Repository URL"
                        disabled={isCreatingProject}
                    />
                    <Input
                        {...register("githubtoken")}
                        placeholder="GitHub Token (Optional, for private repos)"
                        disabled={isCreatingProject}
                    />

                    {!!checkCredits.data && (
                        <div
                            className={`mt-4 px-4 py-2 rounded-md border text-sm ${hasEnoughCredits
                                ? "bg-green-50 border-green-200 text-green-700"
                                : "bg-red-50 border-red-200 text-red-700"
                                }`}
                        >
                            <div className="flex items-start md:items-center gap-2">
                                <Info className="size-4 flex-shrink-0 mt-0.5 md:mt-0" />
                                <div>
                                    <p>
                                        You will be charged{" "}
                                        <strong>{checkCredits.data.fileCount}</strong> credits
                                        for this repository
                                    </p>
                                    <p
                                        className={`mt-1 ${hasEnoughCredits
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        You have{" "}
                                        <strong>{checkCredits.data.credits}</strong> credits
                                        remaining
                                    </p>
                                    {!hasEnoughCredits && (
                                        <p className="mt-1 font-semibold">
                                            Insufficient credits! Please purchase more.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto"
                            disabled={
                                createProject.isPending ||
                                checkCredits.isPending ||
                                (isCreatingProject && !hasEnoughCredits)
                            }
                        >
                            {checkCredits.isPending
                                ? "Checking..."
                                : createProject.isPending
                                    ? "Creating..."
                                    : isCreatingProject
                                        ? "Create Project"
                                        : "Check Credits"}
                        </Button>

                        <Button onClick={() => redirect('/makeApp')}>
                            Create Your App
                        </Button>

                        {isCreatingProject && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => checkCredits.reset()}
                                className="w-full sm:w-auto"
                            >
                                Change Repository
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePage;
