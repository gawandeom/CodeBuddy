import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import type { BaseMessage } from "@langchain/core/messages";
export const createMemory = () =>{
 const memory = new InMemoryChatMessageHistory();
 return memory
}
export const getRecentMessages = (messages: BaseMessage[]): BaseMessage[] => {
  return messages.slice(-10);
};