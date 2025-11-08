"use client";
import { ModeToggle } from "@/components/toggleTheme"
import { useClerk, useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
    const { isSignedIn } = useUser();
    const { signOut, openSignIn } = useClerk();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Desktop & Tablet Navbar */}
            <div className="hidden md:block fixed top-10 left-0 right-0 z-50 px-4 mx-auto w-full lg:max-w-4xl">
                <div className="relative group">
                    {/* Animated gradient border */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 animate-glow"></div>

                    {/* Rotating border effect */}
                    <div className="absolute -inset-0.5 rounded-full opacity-75 animate-spin-slow">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 via-transparent to-transparent"></div>
                    </div>

                    {/* Main navbar content */}
                    <div className="relative rounded-full border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-2xl flex items-center justify-evenly px-8 py-4">
                        <a
                            href="#"
                            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group/link"
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover/link:w-full transition-all duration-300"></span>
                        </a>

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

                        <a
                            href="#features"
                            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group/link"
                        >
                            Features
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover/link:w-full transition-all duration-300"></span>
                        </a>

                        <a
                            href="#howitworks"
                            className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors relative group/link"
                        >
                            How it works?
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover/link:w-full transition-all duration-300"></span>
                        </a>

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>

                        <button
                            className="border border-gray-500 px-4 py-2 rounded-full cursor-pointer hover:border-blue-600 transition relative"
                            onClick={() => {
                                isSignedIn ? signOut() : openSignIn();
                            }}
                        >
                            {isSignedIn ? "Logout" : "Login"}
                        </button>

                        <ModeToggle />
                    </div>
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="md:hidden fixed top-4 left-0 right-0 z-50 px-4">
                <div className="relative rounded-2xl border  border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-xl ">
                    <div className="flex items-center justify-between px-4 py-3">
                        <a href="#" className="text-lg font-bold text-gray-900 dark:text-white">
                            <Image src='/logo.png' alt="logo" width={40} height={40} />
                        </a>

                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                            >
                                {isMenuOpen ? (
                                    <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                                ) : (
                                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 flex flex-col gap-4">
                            <a
                                href="#"
                                className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </a>

                            <a
                                href="#features"
                                className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Features
                            </a>

                            <a
                                href="#howitworks"
                                className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                How it works?
                            </a>

                            <button
                                className="border border-gray-500 px-4 py-2 rounded-full hover:border-blue-600 transition text-center w-full"
                                onClick={() => {
                                    isSignedIn ? signOut() : openSignIn();
                                    setIsMenuOpen(false);
                                }}
                            >
                                {isSignedIn ? "Logout" : "Login"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
        @keyframes glow {
          0%,
          100% {
            opacity: 0.75;
          }
          50% {
            opacity: 1;
          }
        }

        // @keyframes spin-slow {
        //   from {
        //     transform: rotate(0deg);
        //   }
        //   to {
        //     transform: rotate(180deg);
        //   }
        // }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
        </>
    );
}
