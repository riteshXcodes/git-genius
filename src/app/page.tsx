"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  GitBranch,
  Search,
  Save,
  Video,
  Clock,
  Sparkles,
  Github,
  ChevronRight,
  FileCode,
  MessageSquare,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 relative">
      <Navbar />
      <div className="h-4"></div>

      <section className="relative overflow-hidden px-6 py-20 lg:px-8 lg:py-32 bg-white dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:20px_20px]",
            "[background-image:radial-gradient(#999_1px,transparent_1px)]",
            "dark:bg-[radial-gradient(#404040_1px,transparent_1px)]"
          )}
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Badge className="mx-auto w-fit px-4 py-1.5 text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-0">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              AI-Powered GitHub Intelligence
            </Badge>

            <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-7xl lg:text-8xl">
              Git<span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Genius</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400 sm:text-xl">
              Transform your GitHub workflow with AI-powered insights. Query repositories, save answers, summarize meetings, and track commits with intelligent summaries.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <Button size="lg" className="text-base px-8 py-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200" onClick={() => {
                if (isSignedIn) {
                  redirect('dashboard');
                }
                else {
                  openSignIn();
                }
              }}>
                {isSignedIn ? "Dashboard" : "Get Started"}<ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-8 py-6" >
                <Link href="https://github.com/rajaXcodes/git-genius" className="flex items-center gap-2">
                  <Github className="size-4" />
                  <span>View on Github</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8" id="features">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to supercharge your GitHub workflow with AI
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Search className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Intelligent Query Search
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Ask any question about your GitHub repositories and get instant, AI-powered answers with relevant file results and context.
                </p>
                <div className="flex items-center gap-2 mt-6">
                  <Badge variant="secondary" className="text-xs">
                    <FileCode className="w-3 h-3 mr-1" />
                    File Results
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    Instant Answers
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Save className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Save & Organize Answers
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Never lose important insights. Save AI-generated answers and build your personal knowledge base for future reference.
                </p>
                <div className="flex items-center gap-2 mt-6">
                  <Badge variant="secondary" className="text-xs">
                    <Save className="w-3 h-3 mr-1" />
                    Quick Save
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Knowledge Base
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Video className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  AI Meeting Summaries
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Automatically summarize team meetings with AI. Extract action items, decisions, and key discussions effortlessly.
                </p>
                <div className="flex items-center gap-2 mt-6">
                  <Badge variant="secondary" className="text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Auto Summarize
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Action Items
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardContent className="p-8 relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-100 dark:bg-violet-900/20 mb-6 group-hover:scale-110 transition-transform duration-500">
                  <GitBranch className="w-7 h-7 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-slate-100">
                  Smart Commit Tracking
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  View latest commits with AI-generated summaries. Understand code changes at a glance with intelligent time-based tracking.
                </p>
                <div className="flex items-center gap-2 mt-6">
                  <Badge variant="secondary" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    Time Tracking
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    AI Summary
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 bg-slate-100 dark:bg-slate-900/50" id="howitworks">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
              <Badge className="w-fit px-4 py-1.5 text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-0">
                How It Works
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
                Your AI-Powered GitHub Assistant
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                GitGenius seamlessly integrates with your GitHub workflow, providing intelligent insights and automation that saves you hours of manual work.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Connect Your Repository</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Link your GitHub account and select repositories to analyze</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Ask Questions</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Query your codebase in natural language and get instant answers</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Get AI Insights</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Receive intelligent summaries, track commits, and save important findings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-slate-100">GitGenius AI</div>
                      <div className="text-xs text-slate-500">Active</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        "Show me all authentication related files"
                      </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2">
                          <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">Found 8 files related to authentication:</p>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <FileCode className="w-3 h-3" />
                              <span className="font-mono">auth/login.tsx</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <FileCode className="w-3 h-3" />
                              <span className="font-mono">auth/middleware.ts</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                              <FileCode className="w-3 h-3" />
                              <span className="font-mono">utils/jwt.ts</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Join developers who are already using GitGenius to work smarter, not harder.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <Button size="lg" className="text-base px-8 py-6 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200">
              Start Free Trial <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 py-6">
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">10k+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Queries Processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">5k+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Developers</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">99.9%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Github className="w-6 h-6" />
              <span className="font-bold text-xl text-slate-900 dark:text-slate-100">GitGenius</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © 2025 GitGenius. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
