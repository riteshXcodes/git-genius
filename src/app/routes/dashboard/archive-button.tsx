'use client'
import { Button } from "@/components/ui/button";
import useProject from "@/hooks/use-projects";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react"
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import React from "react";

const ArchiveButton = () => {
    const archiveProject = api.project.archiveProject.useMutation();
    const { projectId } = useProject();
    const refetch = useRefetch();
    const [open, setOpen] = React.useState(false);

    const handleArchive = () => {
        archiveProject.mutate({ projectId }, {
            onSuccess: () => {
                toast.success("Project archived");
                setOpen(false);
                refetch();
            },
            onError: () => {
                toast.error("Failed to archive project.");
            }
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button disabled={archiveProject.isPending} size="sm" variant="destructive">
                    Archive
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently archive your project.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleArchive} disabled={archiveProject.isPending}>
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ArchiveButton;