import "dotenv/config";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { createAgent } from "langchain";
import { createCodeBuddyAgent } from "./agent.js";

const chatHistory = new InMemoryChatMessageHistory();


const agent = createCodeBuddyAgent()


export const chat = async (userMessage: string) => {
  await chatHistory.addUserMessage(userMessage);

  const messages = await chatHistory.getMessages();

  const result = await agent.invoke({
    messages,
  });

  const aiResponse = String(
    result.messages.at(-1)?.content ?? ""
  );

  await chatHistory.addAIMessage(aiResponse);

  return aiResponse;
};