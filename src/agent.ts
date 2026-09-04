import "dotenv/config";
import { createAgent, modelRetryMiddleware } from "langchain";
import {
  listFilesTool,
  readFileTool,
  runCommandTool,
  searchFilesTool,
  writeFileTool,
} from "./tools.js";
import { AgentResponse, MultiFileEdit } from "./schema.js";
import { workerSystemPrompt } from "./systemPrompt.js";

export function createCodeBuddyAgent() {
  return createAgent({
    model: "groq:openai/gpt-oss-120b",
    //  model: "google-genai:gemini-3.6-flash",
    tools: [readFileTool, listFilesTool, searchFilesTool,runCommandTool],
    middleware: [modelRetryMiddleware({ maxRetries: 2 })],
    systemPrompt: workerSystemPrompt  });
}

export function createStructuringAgent() {
  return createAgent({
    model: "groq:openai/gpt-oss-120b",
    tools: [],
    responseFormat: AgentResponse,
  });
}
