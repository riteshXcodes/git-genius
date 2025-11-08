"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { lucario } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';

type Props = {
    fileReferences: { fileName: string; sourceCode: string; summary: string; }[];
}

const CodeReferences = ({ fileReferences }: Props) => {
    const [tab, setTab] = useState(fileReferences[0]?.fileName);

    useEffect(() => {
        if (fileReferences.length > 0) {
            setTab(fileReferences[0]!.fileName);
        }
    }, [fileReferences]);

    if (fileReferences.length === 0) return null

    return (
        <div className='w-full'>
            <Tabs value={tab} onValueChange={setTab}>
                <div className='overflow-x-auto flex gap-2 bg-gray-200 p-2 rounded-md mb-4'>
                    {fileReferences.map((file) => (
                        <Button
                            variant={'outline'}
                            onClick={() => setTab(file.fileName)}
                            key={file.fileName}
                            size="sm"
                            className={cn(
                                'px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0',
                                tab === file.fileName
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'text-muted-foreground bg-white hover:bg-gray-100'
                            )}
                        >
                            {file.fileName}
                        </Button>
                    ))}
                </div>

                {fileReferences.map((file) => (
                    <TabsContent
                        key={file.fileName}
                        value={file.fileName}
                        className='mt-0'
                    >
                        <div className='max-h-[400px] overflow-auto rounded-md border'>
                            <SyntaxHighlighter
                                language='typescript'
                                style={lucario}
                                customStyle={{
                                    margin: 0,
                                    borderRadius: '0.375rem',
                                    fontSize: '0.875rem',
                                }}
                                wrapLongLines={true}
                            >
                                {file.sourceCode}
                            </SyntaxHighlighter>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default CodeReferences