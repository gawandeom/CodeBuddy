import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

export const createMemory = () =>{
 const chatHistory = new InMemoryChatMessageHistory();
 return chatHistory
}
