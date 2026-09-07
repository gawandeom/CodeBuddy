import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

export const createMemory = () =>{
 const memory = new InMemoryChatMessageHistory();
 return memory
}


import { BaseMessage } from "@langchain/core/messages";

