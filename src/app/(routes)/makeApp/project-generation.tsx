'use client';

import { useState } from 'react';
import { Loader2, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodePreview } from './code-preview';
import { GitHubDialog } from './github-dialog';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { api } from '@/trpc/react';

interface FileData {
    path: string;
    content: string;
}

export function ProjectGenerator() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedFiles, setGeneratedFiles] = useState<FileData[]>([]);
    const [showGitHubDialog, setShowGitHubDialog] = useState(false);

    const generateProjectMutation = api.project.makeProject.useMutation({
        onSuccess: (data) => {
            if (data && Array.isArray(data)) {
                setGeneratedFiles(data);
                toast.success('Project generated successfully!');
            } else {
                toast.error('Invalid response from server');
            }
            setIsGenerating(false);
        },
        onError: (error) => {
            toast.error('Failed to generate project');
            console.error(error);
            setIsGenerating(false);
        }
    });

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error('Please enter a project description');
            return;
        }

        setIsGenerating(true);
        generateProjectMutation.mutate({ userPrompt: prompt });
    };

    const handleReset = () => {
        setPrompt('');
        setGeneratedFiles([]);
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {generatedFiles.length > 0 && (
                    <div className="mb-4 flex justify-between items-center">
                        <Button
                            onClick={() => setShowGitHubDialog(true)}
                            className="gap-2"
                            size="lg"
                        >
                            <Github className="h-5 w-5" />
                            Push to GitHub
                        </Button>
                        <Button onClick={handleReset} variant="outline">
                            New Project
                        </Button>
                    </div>
                )}

                {generatedFiles.length === 0 ? (
                    <div className="flex items-center justify-center min-h-[80vh]">
                        <Card className="w-full max-w-2xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-3xl font-bold text-center">
                                    AI Project Generator
                                </CardTitle>
                                <CardDescription className="text-center text-base">
                                    Describe your application and let AI generate the complete codebase
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="Example: Create a todo app with React, TypeScript, and local storage..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="min-h-[200px] text-base resize-none"
                                    disabled={isGenerating}
                                />
                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full h-12 text-base"
                                    size="lg"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Generating Project...
                                        </>
                                    ) : (
                                        'Generate Project'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <CodePreview files={generatedFiles} />
                )}

                <GitHubDialog
                    open={showGitHubDialog}
                    onOpenChange={setShowGitHubDialog}
                    files={generatedFiles}
                />
            </div>
        </>
    );
}