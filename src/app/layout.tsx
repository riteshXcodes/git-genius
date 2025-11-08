import "@/styles/globals.css";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider"
// import { useTheme } from "next-themes";
import { dark, neobrutalism } from "@clerk/themes";
export const metadata: Metadata = {
  title: "GitGenius – AI-Powered GitHub Code Search & Insights",
  description:
    "GitGenius lets you search and query any GitHub repository using AI-driven retrieval and cosine similarity. Paste a repo URL to get intelligent answers, related code snippets, and save your queries for later. Includes Stripe-powered plans, a free tier, and AI meeting audio summaries.",
  keywords: [
    "GitGenius",
    "AI code search",
    "GitHub RAG",
    "cosine similarity",
    "repository search",
    "AI code assistant",
    "developer tools",
    "meeting summarizer",
    "Stripe payments",
    "free tier SaaS"
  ],
  openGraph: {
    title: "GitGenius – Search GitHub Repos with AI",
    description:
      "Query your GitHub repositories with natural language. GitGenius uses RAG and cosine similarity to deliver precise code insights, related files, and AI summaries.",
    url: "https://gitgenius.app",
    siteName: "GitGenius",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GitGenius – AI GitHub Search Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitGenius – AI-Powered GitHub Search & Code Insights",
    description:
      "Search, query, and understand any GitHub repo with AI-powered retrieval, cosine similarity, and RAG. Includes free tier, saved Q&A, and meeting summaries.",
    images: ["/og-image.png"],
    creator: "@gitgenius",
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const { theme } = useTheme();

  return (
    <ClerkProvider appearance={{
      theme: dark,
    }}>
      <html lang="en" className="font-sans" suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <TRPCReactProvider>
              {children}
            </TRPCReactProvider>
          </ThemeProvider>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}
