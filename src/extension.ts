import * as vscode from "vscode";
import {
    IContextProvider,
    ContextProviderDescription,
    ContextProviderExtras,
    ContextSubmenuItem,
    LoadSubmenuItemsArgs,
    ContextItem,
} from "@continuedev/core";

class MyCustomProvider implements IContextProvider {
    get description(): ContextProviderDescription {
        return {
            title: "Custom",
            displayTitle: "Custom",
            description: "my custom context provider",
            type: "normal",
        };
    }

    async getContextItems(
        query: string,
        extras: ContextProviderExtras,
    ): Promise<ContextItem[]> {
        return [
            {
                name: "Custom",
                description: "Custom description",
                content: "Custom content",
            },
        ];
    }

    async loadSubmenuItems(
        args: LoadSubmenuItemsArgs,
    ): Promise<ContextSubmenuItem[]> {
        return [];
    }
}

// create an instance of your custom provider
const customProvider = new MyCustomProvider();

// get Continue extension using vscode API
const continueExt = vscode.extensions.getExtension("Continue.continue");

// get the API from the extension
const continueApi = continueExt?.exports;

// register your custom provider
continueApi?.registerCustomContextProvider(customProvider);

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// import * as vscode from "vscode";
// import {
//     IContextProvider,
//     ContextProviderDescription,
//     ContextProviderExtras,
//     ContextSubmenuItem,
//     LoadSubmenuItemsArgs,
//     ContextItem,
// } from "@continuedev/core";
// import { OpenAI } from "openai";

// interface FileConstants {
//     OPEN_AI_API_KEY: string;
//     OPEN_AI_ORG: string;
//     OPEN_AI_ASSISTANT_ID: string;
//     OPEN_AI_MODEL: string;
// }

// const FILE_CONST: FileConstants = {
//     OPEN_AI_API_KEY: "",
//     OPEN_AI_ORG: "",
//     OPEN_AI_ASSISTANT_ID: "",
//     OPEN_AI_MODEL: "gpt-4o",
// };

// class AICodeReviewProvider implements IContextProvider {
//     static ID = "ai-code-reviewer";
//     private openai: OpenAI;

//     get description(): ContextProviderDescription {
//         return {
//             title: "AI Code Reviewer",
//             displayTitle: "AI Code Review",
//             description: "Get AI-powered code reviews",
//             type: "normal",
//         };
//     }

//     constructor() {

//         this.openai = new OpenAI({
//             apiKey: FILE_CONST.OPEN_AI_API_KEY,
//             organization: FILE_CONST.OPEN_AI_ORG,
//         });
//     }

//     async getContextItems(query: string): Promise<ContextItem[]> {
//         const editor = vscode.window.activeTextEditor;
//         if (!editor) return [];

//         // Get selected code or entire file content
//         const selection = editor.selection;
//         const codeContent = selection.isEmpty
//             ? editor.document.getText()
//             : editor.document.getText(selection);

//         // Return a special "streamable" context item
//         return [
//             {
//                 name: "AI Code Review",
//                 description: "Real-time code analysis",
//                 content: await this.streamCodeReview(codeContent)
//             },
//         ];
//     }

//     async loadSubmenuItems(
//         args: LoadSubmenuItemsArgs,
//     ): Promise<ContextSubmenuItem[]> {
//         return [];
//     }

//     private async streamCodeReview(codeContent: string): Promise<string> {
//         const { readable, writable } = new TransformStream<string>();
//         const writer = writable.getWriter();
//         let str = '';
//         this.sendToOpenAI(codeContent, async (partialResponse: string) => {
//             // await writer.write(partialResponse);
//             str += partialResponse;
//         });

//         return str;
//     }

//     private async sendToOpenAI(content: string, onStreamResponse: (chunk: any) => void): Promise<void> {
//         try {
//             const thread = await this.openai.beta.threads.create();
//             const run = await this.openai.beta.threads.runs.create(thread.id, {
//                 assistant_id: FILE_CONST.OPEN_AI_ASSISTANT_ID,
//                 stream: true,
//             });

//             for await (const event of run) {
//                 if (event.event === "thread.message.delta") {
//                     const chunk = event.data.delta.content?.[0] || "";
//                     onStreamResponse(chunk);
//                 }

//                 if (event.event === "thread.run.completed") break;
//                 if (event.event === "thread.run.failed") {
//                     throw new Error(event.data.last_error?.message || "Run failed");
//                 }
//             }

//             await this.openai.beta.threads.del(thread.id);
//         } catch (error) {
//             vscode.window.showErrorMessage(`Code review failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
//         }
//     }
// }


// export function activate(context: vscode.ExtensionContext) {
//     const continueExt = vscode.extensions.getExtension("Continue.continue");
//     if (!continueExt) {
//         vscode.window.showErrorMessage("Continue extension not found!");
//         return;
//     }

//     const continueApi = continueExt?.exports;


//     const provider = new AICodeReviewProvider();
//     // continueApi.registerCustomContextProvider(provider);
//     continueApi?.registerCustomContextProvider(provider);
//     // Register commands
//     context.subscriptions.push(
//         vscode.commands.registerCommand("ai-code-reviewer.quickReview", async () => {
//             const editor = vscode.window.activeTextEditor;
//             if (editor) {
//                 const code = editor.document.getText();
//                 const response = await provider.getContextItems(code);
//                 vscode.window.showInformationMessage(response[0].content);
//             }
//         })
//     );
// }

// // This method is called when your extension is deactivated
// export function deactivate() { }
