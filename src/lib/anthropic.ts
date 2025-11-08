// import axios from 'axios';
// import { Octokit } from '@octokit/rest';
// import { OpenRouter } from '@openrouter/sdk';

// interface GeneratedApp {
//     name: string;
//     description: string;
//     files: Array<{
//         path: string;
//         content: string;
//     }>;
// }

// export class AppGenerator {
//     private openRouterUrl: string;
//     private openRouterApiKey: string;
//     private octokit: Octokit;

//     constructor(openRouterApiKey: string, githubToken: string) {
//         this.openRouterApiKey = openRouterApiKey;
//         this.openRouterUrl = 'https://api.openrouter.com/v1/completions';  // Update this if OpenRouter's API URL is different
//         this.octokit = new Octokit({ auth: githubToken });
//     }

//     /**
//      * Generate app from user prompt using OpenRouter model
//      */
//     // async generateApp(userPrompt: string) {
//     //     console.log('🤖 Generating app from prompt...');

//     //     const data = {
//     //         // model: "openrouter/gpt-j", 
//     //         model: "anthropic/claude-sonnet-4.5",
//     //         prompt: `Generate a complete, production-ready application based on the following prompt: ${userPrompt}`,
//     //         max_tokens: 8000,
//     //     };

//     //     try {
//     //         const response = await axios.post(this.openRouterUrl, data, {
//     //             headers: {
//     //                 'Authorization': `Bearer ${this.openRouterApiKey}`,
//     //                 'Content-Type': 'application/json',
//     //             }
//     //         });

//     //         const generatedText = response.data.choices[0].text;
//     //         console.log('Generated app data:', generatedText);

//     //         // You may want to parse and format the response (depending on the model's output)
//     //         return generatedText;  // Returning the generated app data as a string for now
//     //     } catch (error) {
//     //         console.error('Error generating app:', error);
//     //         throw error;
//     //     }
//     // }
//     async generateApp(userPrompt: string) {
//         const openRouter = new OpenRouter({
//             apiKey: process.env.OPENROUTER_API_KEY!
//         });

//         const response = await openRouter.chat.send({
//             model: 'openai/gpt-4o',
//             messages: [
//                 {
//                     role: 'user',
//                     content: userPrompt,
//                 },
//             ],
//             stream: true,
//         });

//     }

//     /**
//      * Create GitHub repo and push all files
//      */
//     async createGitHubRepo(projectData: GeneratedApp): Promise<string> {
//         console.log('📦 Creating GitHub repository...');

//         try {
//             const { data: repo } = await this.octokit.repos.createForAuthenticatedUser({
//                 name: projectData.name,
//                 description: projectData.description,
//                 private: false,
//                 auto_init: false
//             });

//             console.log(`✅ Repository created: ${repo.html_url}`);

//             // Upload files to GitHub
//             for (const file of projectData.files) {
//                 console.log(`📝 Uploading: ${file.path}`);

//                 await this.octokit.repos.createOrUpdateFileContents({
//                     owner: repo.owner.login,
//                     repo: repo.name,
//                     path: file.path,
//                     message: `Add ${file.path}`,
//                     content: Buffer.from(file.content).toString('base64')
//                 });
//             }

//             console.log('🎉 All files uploaded successfully!');

//             return repo.html_url;

//         } catch (error: any) {
//             console.error('❌ GitHub Error:', error.message);
//             throw new Error(`Failed to create GitHub repo: ${error.message}`);
//         }
//     }

//     /**
//      * Complete pipeline: Generate app and push to GitHub
//      */
//     async run(userPrompt: string): Promise<{ repoUrl: string; projectName: string }> {
//         try {
//             console.log('🚀 Starting app generation pipeline...\n');

//             // Step 1: Generate the app
//             const projectData = await this.generateApp(userPrompt);

//             // Step 2: Push to GitHub and get URL
//             const repoUrl = await this.createGitHubRepo(projectData);

//             console.log('\n✨ Pipeline complete!');
//             console.log(`📦 Repository: ${repoUrl}`);
//             console.log(`🔗 You can now use this URL with GitGenius\n`);

//             return {
//                 repoUrl,
//                 projectName: "New Project"
//             };

//         } catch (error: any) {
//             console.error('\n❌ Pipeline failed:', error.message);
//             throw error;
//         }
//     }
// }

// // Usage Example
// async function main() {
//     const generator = new AppGenerator(
//         process.env.OPENROUTER_API_KEY!,
//         process.env.GITHUB_TOKEN!
//     );

//     const userPrompt = "Build a React app with TypeScript and Redux for state management. Add authentication with JWT and simple user roles.";

//     const result = await generator.generateApp(userPrompt);

//     console.log('Result:', result);
// }

// main();


// pages/api/generate-app.ts

import { OpenRouter } from '@openrouter/sdk';
import { Octokit } from '@octokit/rest';

const openRouterApiKey = process.env.OPENROUTER_API_KEY!;
const githubToken = process.env.GITHUB_TOKEN!;

export async function generateApp(userPrompt: string) {
    const openRouter = new OpenRouter({
        apiKey: openRouterApiKey,
    });

    const response = await openRouter.chat.send({
        model: 'openai/gpt-4o',
        messages: [
            {
                role: 'user',
                content: userPrompt,
            },
        ],
        stream: true,
        streamOptions: { includeUsage: true }
    });

    let appFiles: Array<string> = [];

    for await (const part of response) {
        // Collect streamed data and process
        const content = part.choices[0]?.delta.content;
        if (content) {
            appFiles.push(content);
        }
    }
    return appFiles;
}

export async function createGitHubRepo(projectData: { name: string; files: any[] }, userGitHubToken: string) {
    const octokit = new Octokit({ auth: userGitHubToken });

    try {
        const { data: repo } = await octokit.repos.createForAuthenticatedUser({
            name: projectData.name,
            description: 'Generated by OpenRouter and deployed via GitGenius',
            private: false,
            auto_init: true,
        });

        for (const file of projectData.files) {
            await octokit.repos.createOrUpdateFileContents({
                owner: repo.owner.login,
                repo: repo.name,
                path: file.path,
                message: `Add ${file.path}`,
                content: Buffer.from(file.content).toString('base64'),
            });
        }

        return repo.html_url;
    } catch (error: any) {
        console.error('GitHub Error:', error);
        throw new Error('Failed to create repo and upload files.');
    }
}
