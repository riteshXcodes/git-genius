// app/join/[projectId]/page.tsx
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
type Props = {
    params: Promise<{ projectId: string }>
}

const JoinProjectPage = async (props: Props) => {
    const { projectId } = await props.params;
    const { userId } = await auth();

    if (!userId) {
        redirect('/');
    }

    // Check if user exists in database
    const dbUser = await db.user.findUnique({
        where: {
            id: userId
        }
    });

    // Create user if doesn't exist
    if (!dbUser) {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);

        await db.user.create({
            data: {
                id: userId,
                emailAddress: user.emailAddresses[0]!.emailAddress,
                imageUrl: user.imageUrl,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    }

    // Verify project exists
    const project = await db.project.findUnique({
        where: {
            id: projectId
        }
    });

    if (!project) {
        redirect('/dashboard');
    }

    // Check if user is already in project
    const existingMembership = await db.userToProject.findUnique({
        where: {
            userId_projectId: {
                userId,
                projectId
            }
        }
    });

    // Add user to project if not already a member
    if (!existingMembership) {
        await db.userToProject.create({
            data: {
                userId,
                projectId
            }
        });
    }

    // Redirect to the project
    redirect(`/dashboard`);
}

export default JoinProjectPage;