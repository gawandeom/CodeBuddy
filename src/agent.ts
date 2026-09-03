import "dotenv/config";
import { createAgent, modelRetryMiddleware } from "langchain";
import { listFilesTool, readFileTool, writeFileTool } from "./tools.js";
import { MultiFileEdit } from "./schema.js";

export function createCodeBuddyAgent() {
  return createAgent({
    model: "groq:openai/gpt-oss-120b",
    tools: [readFileTool, listFilesTool],
    middleware: [modelRetryMiddleware({ maxRetries: 2 })],
    systemPrompt: `You are a coding assistant with read_file and list_files tools.
Use them to understand the code. Once ready, describe the full new content for every file that needs to change, clearly labeled by filename.`,
  });
}

export function createStructuringAgent() {
  return createAgent({
    model: "groq:openai/gpt-oss-120b",
    tools: [], 
    responseFormat: MultiFileEdit,
  });
}
