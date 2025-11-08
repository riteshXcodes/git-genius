import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useProject from "@/hooks/use-projects"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader } from "@/components/ui/dialog";
import Image from "next/image";
import { askQuestion } from "./action";
import { readStreamableValue } from "@ai-sdk/rsc";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "./code-references";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import useRefetch from "@/hooks/use-refetch";

const AskQuestion = () => {
    const { project } = useProject();
    const [question, setQuestion] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [filesReference, setFilesReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([]);
    const [answer, setAnswer] = React.useState('');
    const savenAnswer = api.project.saveAnswer.useMutation();
    const refetch = useRefetch();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!project?.id) return;
        setAnswer('');
        setFilesReferences([]);
        e.preventDefault();
        setOpen(true);
        setLoading(true);

        const res = await askQuestion(question, project.id);
        if (!res) throw new Error('Could not answer now!!');
        const { output, fileRefernces } = res;
        setFilesReferences(fileRefernces);

        for await (const delta of readStreamableValue(output)) {
            if (delta) {
                setAnswer(ans => ans + delta);
            }
        }
        setLoading(false);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[80vw] max-h-[90vh] flex flex-col p-0">
                    <DialogHeader className="px-6 pt-6 pb-4 border-b">
                        <div className="flex items-center gap-2">
                            <DialogTitle className="flex items-center gap-2">
                                <Image src='/logo.png' alt="logo" width={40} height={40} />
                                <span className="text-lg font-semibold">GitGenius Answer</span>
                            </DialogTitle>
                        </div>
                        <Button
                            disabled={savenAnswer.isPending}
                            variant={'outline'}
                            size="sm"
                            className="mt-2"
                            onClick={() => savenAnswer.mutate(
                                { projectId: project!.id, question, answer, fileReferences: filesReference },
                                {
                                    onSuccess: () => {
                                        toast.success('Answer saved!')
                                        refetch();
                                    },
                                    onError: () => {
                                        toast.error('Failed to save answer!')
                                    }
                                }
                            )}
                        >
                            Save Answer
                        </Button>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                        <div className="prose prose-sm max-w-none">
                            <MDEditor.Markdown
                                source={answer || "Generating answer..."}
                                className="w-full"
                            />
                        </div>

                        {filesReference.length > 0 && (
                            <div className="border-t pt-4">
                                <h3 className="text-sm font-semibold mb-3">Code References</h3>
                                <CodeReferences fileReferences={filesReference} />
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t bg-gray-50">
                        <Button
                            type='button'
                            onClick={() => setOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Card className="relative col-span-3">
                <CardHeader>
                    <CardTitle>Ask a question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea
                            placeholder="Which file should I edit to change the home page?"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="h-4"></div>
                        <Button type='submit' disabled={loading}>
                            {loading ? "Asking..." : "Ask GitGenius"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

export default AskQuestion