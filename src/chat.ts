import "dotenv/config";
import { createCodeBuddyAgent } from "./agent.js";
import { getAIResponse } from "./response.js";
import { createMemory } from "./memory.js";




const chatHistory = createMemory();
const agent = createCodeBuddyAgent();

export const chat = async (userMessage: string) => {
  await chatHistory.addUserMessage(userMessage);

  const messages = await chatHistory.getMessages();

  const result = await agent.invoke({
    messages,
  });

  const aiResponse = getAIResponse(result.messages.at(-1)?.content);

  await chatHistory.addAIMessage(aiResponse);

  return {
    response: aiResponse,
    messages: result.messages,
  };
};
