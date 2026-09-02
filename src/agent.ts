import "dotenv/config";
import { createAgent } from "langchain";
import { readFileTool, writeFileTool } from "./tools.js";

export function createCodeBuddyAgent() {
  return createAgent({
    model: "groq:openai/gpt-oss-120b",
    tools: [readFileTool, writeFileTool],
    systemPrompt: `You are a coding assistant. Read the target file using read_file, then propose an improved version of the code based on the user's instruction. Output ONLY the new code as your reply — do not call write_file, do not add explanation or markdown formatting.`,
  });
}