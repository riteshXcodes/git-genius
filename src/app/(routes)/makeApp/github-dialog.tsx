'use client';

import { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createGitHubRepo } from './action';
import { api } from '@/trpc/react';
import { useRouter } from 'next/navigation';

interface FileData {
    path: string;
    content: string;
}

interface GitHubDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    files: FileData[];
}

export function GitHubDialog({ open, onOpenChange, files }: GitHubDialogProps) {
    const [projectName, setProjectName] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [isPushing, setIsPushing] = useState(false);
    const router = useRouter();
    const createProject = api.project.createProject.useMutation();
    const handlePushToGitHub = async () => {
        if (!projectName.trim()) {
            toast.error('Please enter a project name');
            return;
        }

        if (!accessToken.trim()) {
            toast.error('Please enter your GitHub access token');
            return;
        }

        setIsPushing(true);
        try {
            // Call the server action directly
            const repoUrl = await createGitHubRepo(projectName, files, accessToken);
            toast.success('Successfully pushed to GitHub!');

            createProject.mutate(
                {
                    name: projectName,
                    githubUrl: repoUrl,
                    githubToken: accessToken,
                },
                {
                    onSuccess: () => {
                        toast.success("Project created successfully!");
                    },
                    onError: (err) => {
                        toast.error(`Error creating project: ${err.message}`);
                    },
                }
            );
            onOpenChange(false);
            setProjectName('');
            setAccessToken('');
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.message || 'Failed to push to GitHub');
            console.error(error);
        } finally {
            setIsPushing(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Github className="h-5 w-5" />
                        Push to GitHub
                    </DialogTitle>
                    <DialogDescription>
                        Enter your project details to create a new GitHub repository
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input
                            id="project-name"
                            placeholder="my-awesome-project"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            disabled={isPushing}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="access-token">GitHub Access Token</Label>
                        <Input
                            id="access-token"
                            type="password"
                            placeholder="ghp_xxxxxxxxxxxx"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            disabled={isPushing}
                        />
                        <p className="text-xs text-muted-foreground">
                            Generate a token at{' '}
                            <a
                                href="https://github.com/settings/tokens"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                github.com/settings/tokens
                            </a>
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPushing}
                    >
                        Cancel
                    </Button>
                    <Button onClick={handlePushToGitHub} disabled={isPushing}>
                        {isPushing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Pushing...
                            </>
                        ) : (
                            <>
                                <Github className="mr-2 h-4 w-4" />
                                Push to GitHub
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}