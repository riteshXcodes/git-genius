'use client';

import { ProjectGenerator } from "./project-generation";

export default function MakeApp() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            <ProjectGenerator />
        </div>
    );
}