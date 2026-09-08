import "dotenv/config";
import {
  createCodeBuddyAgent,
  createStructuringAgent,
} from "../agent/agent.js";
import { createMemory, getRecentMessages } from "./memory.js";

const memory = createMemory();
const workerAgent = createCodeBuddyAgent();
const structuringAgent = createStructuringAgent();

export const chat = async (userMessage: string) => {
  await memory.addUserMessage(userMessage);

  const messages = await memory.getMessages();
  const recentMessages = getRecentMessages(messages);
  const workerResult = await workerAgent.invoke({
    messages: recentMessages,
  });
  const workerResponse = workerResult.messages
    .map((message) => String(message.content ?? ""))
    .join("\n");

  const structuredResult = await structuringAgent.invoke({
    messages: [
      {
        role: "user",
        content: `
                Here is the worker agent's response:
                ${String(workerResponse)}
                Convert the worker's response into the required structured format.
               
                Rules:
                - If the worker answered a question or performed an investigation/check, set intent to "question".
                - Put the worker's answer in response.
                - For a question, files must be an empty array.
                - If the worker proposed code changes, set intent to "edit".
                - Put a concise explanation in response.
                - Treat successful edit_file tool results as proposed file changes.
                - An edit_file result contains the filePath and the complete proposed file content.
                - For an edit, put every changed file in files with its filePath and complete new content.
                - Do not treat a tool error as a successful edit.
                - Do not invent file changes.
`,
      },
    ],
  });
  if (!structuredResult.structuredResponse) {
    throw new Error("The agent didn't return a structured response.");
  }

  const result = structuredResult.structuredResponse;
  await memory.addAIMessage(result.response);

  return {
    response: result.response,
    intent: result.intent,
    files: result.files,
  };
};
