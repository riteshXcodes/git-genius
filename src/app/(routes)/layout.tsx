import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import type React from "react";
import { AppSidebar } from "./dashboard/app-sidebar";
import { ModeToggle } from "@/components/toggleTheme";
type Props = {
    children: React.ReactNode;
}
const SideBarLayout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <AppSidebar />
            {/* App Side bar */}
            <main className="w-full m-2">
                <SidebarTrigger />
                <div className="flex items-center justify-between gap-4 border-sidebar-border p-2 rounded-lg shadow-sm bg-sidebar-background">
                    {/* Search Bar */}
                    <div className="ml-auto"></div>
                    <ModeToggle />
                    <UserButton />
                </div>
                <div className="h-4"></div>
                {/* main - content */}
                <div className="flex-1 border-sidebar-border bg-sidebar border shadow rounded-md overflow-y-auto h-[calc(100vh-6.5rem)] p-2">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}

export default SideBarLayout;