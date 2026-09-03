import "dotenv/config";
import { createAgent, modelRetryMiddleware } from "langchain";
import { listFilesTool, readFileTool, writeFileTool } from "./tools.js";

export function createCodeBuddyAgent() {
  return createAgent({
    model: "groq:openai/gpt-oss-120b",
    tools: [readFileTool, writeFileTool, listFilesTool],
    middleware: [modelRetryMiddleware({ maxRetries: 2 })],
    systemPrompt: `You are a coding assistant. You have exactly three tools: read_file, write_file, and list_files. Do not use, mention, or attempt to call any other tool.

If you need to check what other files exist before making a change, use list_files. Read the target file using read_file, then propose an improved version based on the user's instruction. Output ONLY the new code as your reply — do not call write_file, do not add explanation or markdown formatting.`,
  });
}
