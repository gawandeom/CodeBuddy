import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Header from "./header.js";
import Input from "./Input.js";
import { createCodeBuddyAgent } from "../agent.js";
import Spinner from "ink-spinner";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function App() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const agent = useMemo(() => createCodeBuddyAgent(), []);
  const handleSubmit = async (value: string): Promise<void> => {
    if (!value.trim()) return;
    const conversation: Message[] = [
      ...messages,
      { role: "user", content: value },
    ];

    setMessages(conversation);

    setLoading(true);
    try {
      const result = await agent.invoke({
        messages: conversation,
      });

      const newMessage: Message = {
        role: "assistant",
        content: String(result.messages.at(-1)?.content ?? ""),
      };
      setMessages((prev) => [...prev, newMessage]);
    } catch {
      console.log("Something went wrong.");
    } finally {
      setLoading(false);
      setValue("");
    }
  };
  return (
    <Box
      borderStyle={"round"}
      borderColor={"cyan"}
      padding={1}
      flexDirection="column"
    >
      <Header />

      <Box flexDirection="column" marginTop={1} marginBottom={1}>
        {messages.map((message, index) => {
          return (
            <Box key={index}>
              {message.role === "user" ? (
                <Text>
                  <Text color="cyan">you: </Text>
                  {message.content}
                </Text>
              ) : (
                <Text>
                  <Text color="green">AI: </Text>
                  {message.content}
                </Text>
              )}
            </Box>
          );
        })}

        {loading && (
          <Text>
            <Spinner type="dots" /> Thinking...
          </Text>
        )}
      </Box>

      {!loading && (
        <Input
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        ></Input>
      )}
    </Box>
  );
}
