'use client'
import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import useProject from "@/hooks/use-projects";
import { api } from "@/trpc/react";
import AskQuestion from "../dashboard/ask-question";
import MDEditor from "@uiw/react-md-editor";
import CodeReferences from "../dashboard/code-references";
import { Loader } from "lucide-react";
const QAPage = () => {
    const { projectId } = useProject();
    const { data: questions, isLoading } = api.project.getQuestions.useQuery({ projectId });
    const [questionIdx, setQuestionIdx] = React.useState(0);
    const question = questions?.[questionIdx];

    return (
        <Sheet>
            <AskQuestion />
            <div className="h-4"></div>
            <h1 className="text-xl font-semibold">Saved Questions</h1>
            <div className="h-2"></div>
            {isLoading && (
                <div className="flex items-center justify-center py-12 text-gray-500 flex-col">
                    <Loader className="animate-spin h-6 w-6 mr-2" />
                    <p className="text-secondary-foreground font-medium mr-2">Fetching Questions</p>
                </div>

            )

            }
            {
                !questions || questions.length == 0 && (
                    < div className="text-center text-gray-500 py-8">
                        No questions to display. Ask your first Question above.
                    </div>
                )
            }
            {questions && questions.length > 0 && (
                <div className="flex flex-col gap-2">
                    {questions?.map((question, idx) => {
                        return <React.Fragment key={question.id}>
                            <SheetTrigger onClick={() => { setQuestionIdx(idx) }} >
                                <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow border">
                                    <img className="rounded-full" src={question.user.imageUrl ?? ""} alt="img" width={40} height={40} />
                                    <div className="text-left flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <p className="text-gray-700 line-clamp-1 text-lg font-medium">
                                                {question.question}
                                            </p>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {question.createdAt.toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-gray-500 line-clamp-1 text-sm">
                                            {question.answer}
                                        </p>
                                    </div>
                                </div>
                            </SheetTrigger>
                        </React.Fragment>
                    })}
                    {
                        question && (
                            <SheetContent className='sm:max-w-[80vw] overflow-y-scroll'>
                                <SheetHeader>
                                    <SheetTitle>
                                        {question.question}
                                    </SheetTitle>
                                    <MDEditor.Markdown source={question.answer} />
                                    <CodeReferences fileReferences={(question.filesReferences ?? []) as any} />
                                </SheetHeader>
                            </SheetContent>
                        )
                    }
                </div>
            )}
        </Sheet >
    )
}

export default QAPage;