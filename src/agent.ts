import "dotenv/config";
import { createAgent, modelRetryMiddleware } from "langchain";
import { readFileTool, writeFileTool } from "./tools.js";

export function createCodeBuddyAgent() {
  return createAgent({
    model: "groq:openai/gpt-oss-120b",
    tools: [readFileTool, writeFileTool],
    middleware:[modelRetryMiddleware({maxRetries:2})],
    systemPrompt: `You are a coding assistant. You have exactly two tools available: read_file and write_file. Do not use, mention, or attempt to call any other tool (such as exec, shell, ls, or file search) — they do not exist in this environment.
Read the target file using read_file, then propose an improved version of the code based on the user's instruction. Output ONLY the new code as your reply — do not call write_file, do not add explanation or markdown formatting.`,
  });
}
