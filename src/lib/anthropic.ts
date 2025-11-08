import { OpenRouter } from '@openrouter/sdk';

// ======================
// Types
// ======================
export interface FileData {
    path: string;
    content: string;
}

// ======================
// Configuration
// ======================
const openRouterApiKey = process.env.OPENROUTER_API_KEY!;
if (!openRouterApiKey) throw new Error('Missing OPENROUTER_API_KEY in environment variables');

// ======================
// App Generator=
// ======================
export async function generateApp(userPrompt: string): Promise<FileData[]> {
    const openRouter = new OpenRouter({
        apiKey: openRouterApiKey,
    });

    const systemPrompt = `
You are an expert full-stack application generator. Your job is to produce complete, production-ready codebases based on the user’s request.

Always return your output as a **single JSON array** of file objects, with this exact structure:

[
  {
    "path": "relative/file/path/from/project/root",
    "content": "file content as plain text"
  }
]

### Rules and Requirements

1. **Output Format**
   - Return ONLY the raw JSON array.
   - Do NOT include code fences, explanations, comments, or extra text.
   - Each item in the array represents one file in the project.

2. **Project Structure**
   - Support both frontend and backend code generation when requested.
   - If the app includes a frontend (React, Next.js, or HTML/CSS/JS), include files such as:
     - \`src/\` for React/TypeScript frontend apps.
     - \`public/\` for static assets (HTML, images, etc.).
   - If a backend is requested, include backend files:
     - \`server/\` or \`api/\` for Node.js / Express backend code.
     - \`package.json\` with proper dependencies and scripts.
     - \`.env.example\` for environment variables (if applicable).

3. **Technology Detection**
   - If the prompt mentions React, TypeScript, Next.js, or frontend frameworks → generate a React or Next.js app.
   - If it mentions APIs, databases, authentication, or backend logic → generate a Node.js / Express or Fastify backend.
   - Include both if the prompt implies a full-stack app.

4. **Coding Standards**
   - Use clean, idiomatic, modular code.
   - Include setup files (\`package.json\`, \`.gitignore\`, \`tsconfig.json\` if TypeScript is used).
   - Include minimal but functional examples for components, routes, or DB connections.

5. **Examples**
   - React app: \`src/App.tsx\`, \`src/index.tsx\`, \`public/index.html\`, \`package.json\`
   - Backend app: \`server/index.ts\` or \`server.js\`, \`package.json\`, \`.env.example\`

6. **Final Output**
   - Return ONLY the JSON array. No markdown, no commentary, no extra wrapping.
`;

    // ======================
    // Request OpenRouter
    // ======================
    const response = await openRouter.chat.send({
        model: 'openai/gpt-4o',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        stream: false,
    });

    const rawContent = response.choices?.[0]?.message?.content;

    let textContent = '';
    if (typeof rawContent === 'string') {
        textContent = rawContent;
    } else if (Array.isArray(rawContent)) {
        // Extract any text portions from content array
        textContent = rawContent
            .map((item: any) => ('text' in item ? item.text : ''))
            .join('');
    } else {
        throw new Error('No valid response content received from model.');
    }

    // ======================
    // Clean & Parse JSON
    // ======================
    try {
        let jsonString = textContent.trim();

        // Remove any accidental markdown code blocks
        jsonString = jsonString
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .replace(/^\s*[\r\n]/gm, '');

        const files: FileData[] = JSON.parse(jsonString);

        if (!Array.isArray(files)) {
            throw new Error('AI response is not an array.');
        }

        for (const f of files) {
            if (typeof f.path !== 'string' || typeof f.content !== 'string') {
                throw new Error(`Invalid file structure detected: ${JSON.stringify(f)}`);
            }
        }

        console.log(`Generated ${files.length} files from AI.`);
        return files;
    } catch (err) {
        console.error('Failed to parse AI response:', err);
        console.error('Raw response:', textContent.slice(0, 1000));
        throw new Error('AI did not return valid JSON file structure.');
    }
}


// ======================
// Example Usage (for testing)
// ======================
// if (require.main === module) {
//     (async () => {
//         try {
//             const files = await generateApp('Create a React e-commerce application with a Node.js backend.');
//             console.log('Files generated:', files.map(f => (`${f.path} : ${f.content}`)));

//             // Example of skipping GitHub creation in test:
//             // const repoUrl = await createGitHubRepo('react-ecommerce-app', files, process.env.GITHUB_TOKEN!);
//             // console.log('Repo URL:', repoUrl);
//         } catch (err) {
//             console.error('Pipeline failed:', err);
//         }
//     })();
// }