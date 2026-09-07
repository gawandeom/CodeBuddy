import "dotenv/config";
import { createCodeBuddyAgent } from "../agent/agent.js";
import { getAIResponse } from "../agent/response.js";
import { createMemory, getRecentMessages } from "./memory.js";




const memory = createMemory();
const agent = createCodeBuddyAgent();

export const chat = async (userMessage: string) => {
  await memory.addUserMessage(userMessage);

  const messages = await memory.getMessages();
const recentMessages = getRecentMessages(messages)
  const result = await agent.invoke({
    messages:recentMessages
  });

  const aiResponse = getAIResponse(result.messages.at(-1)?.content);

  await memory.addAIMessage(aiResponse);

  return {
    response: aiResponse,
    messages: result.messages,
  };
};
