'use client'
import useProject from "@/hooks/use-projects";
import { api } from "@/trpc/react";

const TeamMembers = () => {
    const { projectId } = useProject();
    const { data: members } = api.project.getTeamMembers.useQuery({ projectId });

    return (
        <div className="flex items-center -space-x-2">
            {members?.map((member, index) => (
                <img
                    src={member.user.imageUrl || ''}
                    alt={member.user.firstName || ''}
                    key={member.id}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    style={{ zIndex: members.length - index }}
                />
            ))}
        </div>
    );
}

export default TeamMembers;