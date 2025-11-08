'use client'
import { Dialog, DialogHeader, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import useProject from "@/hooks/use-projects";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const InviteButton = () => {
    const { projectId } = useProject();
    const [open, setOpen] = React.useState<boolean>(false);
    const [inviteLink, setInviteLink] = React.useState<string>('');

    React.useEffect(() => {
        setInviteLink(`${window.location.origin}/join/${projectId}`);
    }, [projectId]);

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        toast.success("Share link copied");
    };

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Invite Members
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-gray-500 text-sm">Ask them to copy this link and paste on chrome</p>
                    <span className="text-muted text-xs mt-0">Press on link to copy</span>
                    <Input
                        className="mt-4"
                        readOnly
                        onClick={handleCopy}
                        value={inviteLink}
                    />
                </DialogContent>
            </Dialog>
            <Button size='sm' onClick={() => { setOpen(true) }}>Invite Members</Button>
        </>
    );
}

export default InviteButton