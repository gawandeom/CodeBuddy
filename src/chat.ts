import "dotenv/config";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { createAgent } from "langchain";

const chatHistory = new InMemoryChatMessageHistory();


const model = createAgent({
  model: "groq:openai/gpt-oss-120b",
});


export const chat = async (userMessage: string) => {
  await chatHistory.addUserMessage(userMessage);

  const messages = await chatHistory.getMessages();

  const result = await model.invoke({
    messages,
  });

  const aiResponse = String(
    result.messages.at(-1)?.content ?? ""
  );

  await chatHistory.addAIMessage(aiResponse);

  return aiResponse;
};