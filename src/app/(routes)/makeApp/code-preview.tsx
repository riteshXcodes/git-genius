// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Badge } from '@/components/ui/badge';
// import { FileCode, Eye } from 'lucide-react';

// interface FileData {
//     path: string;
//     content: string;
// }

// interface CodePreviewProps {
//     files: FileData[];
// }

// export function CodePreview({ files }: CodePreviewProps) {
//     const [selectedFile, setSelectedFile] = useState(files[0]?.path || '');

//     const selectedFileContent = files.find((f) => f.path === selectedFile)?.content || '';

//     const getFileExtension = (path: string) => {
//         const parts = path.split('.');
//         return parts.length > 1 ? parts[parts.length - 1] : '';
//     };

//     const renderPreview = () => {
//         const ext = getFileExtension(selectedFile);

//         if (ext === 'html' || selectedFile.includes('index.html')) {
//             return (
//                 <iframe
//                     srcDoc={selectedFileContent}
//                     className="w-full h-full border-0 bg-white"
//                     title="preview"
//                     sandbox="allow-scripts"
//                 />
//             );
//         }

//         return (
//             <div className="flex items-center justify-center h-full text-muted-foreground">
//                 <div className="text-center">
//                     <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                     <p>Preview not available for this file type</p>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
//             <Card className="col-span-3 flex flex-col">
//                 <CardHeader className="pb-3">
//                     <CardTitle className="text-lg flex items-center gap-2">
//                         <FileCode className="h-5 w-5" />
//                         Files
//                         <Badge variant="secondary" className="ml-auto">
//                             {files.length}
//                         </Badge>
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex-1 p-0">
//                     <ScrollArea className="h-full px-4 pb-4">
//                         <div className="space-y-1">
//                             {files.map((file) => (
//                                 <button
//                                     key={file.path}
//                                     onClick={() => setSelectedFile(file.path)}
//                                     className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedFile === file.path
//                                             ? 'bg-primary text-primary-foreground'
//                                             : 'hover:bg-accent'
//                                         }`}
//                                 >
//                                     <div className="truncate font-mono">{file.path}</div>
//                                 </button>
//                             ))}
//                         </div>
//                     </ScrollArea>
//                 </CardContent>
//             </Card>

//             <Card className="col-span-9 flex flex-col">
//                 <CardHeader className="pb-3">
//                     <CardTitle className="text-lg truncate font-mono">{selectedFile}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex-1 p-0">
//                     <Tabs defaultValue="code" className="h-full flex flex-col">
//                         <TabsList className="mx-4">
//                             <TabsTrigger value="code">Code</TabsTrigger>
//                             <TabsTrigger value="preview">Preview</TabsTrigger>
//                         </TabsList>
//                         <TabsContent value="code" className="flex-1 mt-2 mx-4 mb-4">
//                             <ScrollArea className="h-full rounded-md border bg-slate-950 p-4">
//                                 <pre className="text-sm">
//                                     <code className="text-slate-50 font-mono whitespace-pre">
//                                         {selectedFileContent}
//                                     </code>
//                                 </pre>
//                             </ScrollArea>
//                         </TabsContent>
//                         <TabsContent value="preview" className="flex-1 mt-2 mx-4 mb-4">
//                             <div className="h-full rounded-md border overflow-hidden">
//                                 {renderPreview()}
//                             </div>
//                         </TabsContent>
//                     </Tabs>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// }


'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileCode, Eye, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileData {
    path: string;
    content: string;
}

interface CodePreviewProps {
    files: FileData[];
}

export function CodePreview({ files }: CodePreviewProps) {
    const [selectedFile, setSelectedFile] = useState(files[0]?.path || '');
    const [copied, setCopied] = useState(false);

    const selectedFileContent = files.find((f) => f.path === selectedFile)?.content || '';

    const getFileExtension = (path: string) => {
        const parts = path.split('.');
        return parts.length > 1 ? parts[parts.length - 1] : '';
    };

    const getFileIcon = (path: string) => {
        const ext = getFileExtension(path);
        const iconMap: Record<string, string> = {
            'tsx': '⚛️',
            'ts': '📘',
            'jsx': '⚛️',
            'js': '📜',
            'html': '🌐',
            'css': '🎨',
            'json': '📋',
            'md': '📝',
        };
        return iconMap[ext!] || '📄';
    };

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(selectedFileContent);
            setCopied(true);
            toast.success('Code copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast.error('Failed to copy code');
        }
    };

    const renderPreview = () => {
        const ext = getFileExtension(selectedFile);

        if (ext === 'html' || selectedFile.includes('index.html')) {
            return (
                <iframe
                    srcDoc={selectedFileContent}
                    className="w-full h-full border-0 bg-white"
                    title="preview"
                    sandbox="allow-scripts allow-same-origin"
                />
            );
        }

        return (
            <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Preview not available for this file type</p>
                    <p className="text-xs mt-1">Only HTML files can be previewed</p>
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)]">
            {/* File List Sidebar */}
            <Card className="col-span-3 flex flex-col">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileCode className="h-5 w-5" />
                        Files
                        <Badge variant="secondary" className="ml-auto">
                            {files.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full px-4 pb-4">
                        <div className="space-y-1">
                            {files.map((file) => (
                                <button
                                    key={file.path}
                                    onClick={() => setSelectedFile(file.path)}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${selectedFile === file.path
                                        ? 'bg-primary text-primary-foreground'
                                        : 'hover:bg-accent'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{getFileIcon(file.path)}</span>
                                        <div className="truncate font-mono text-xs">
                                            {file.path}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* Code/Preview Panel */}
            <Card className="col-span-9 flex flex-col">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg truncate font-mono">
                            {selectedFile}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCopyCode}
                            className="gap-2"
                        >
                            {copied ? (
                                <>
                                    <Check className="h-4 w-4" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <Tabs defaultValue="code" className="h-full flex flex-col">
                        <TabsList className="mx-4">
                            <TabsTrigger value="code">Code</TabsTrigger>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                        </TabsList>
                        <TabsContent value="code" className="flex-1 mt-2 mx-4 mb-4">
                            <ScrollArea className="h-full rounded-md border bg-slate-950 p-4">
                                <pre className="text-sm">
                                    <code className="text-slate-50 font-mono whitespace-pre leading-relaxed">
                                        {selectedFileContent}
                                    </code>
                                </pre>
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="preview" className="flex-1 mt-2 mx-4 mb-4">
                            <div className="h-full rounded-md border overflow-hidden bg-white">
                                {renderPreview()}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}