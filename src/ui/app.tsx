import React, { useMemo, useState } from "react";
import { Box, Text } from "ink";
import Header from "./header.js";
import Input from "./Input.js";
import Spinner from "ink-spinner";
import { chat } from "../memory/chat.js";
import { readFile, writeFile } from "../filesystem/fileops.js";
import Diff from "./diff.js";
import { Approval } from "./approval.js";

type Message = {
  role: "user" | "assistant";
  content: string;
};
type PendingFile = {
  filePath: string;
  content: string;
};
export default function App() {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const currentFile = pendingFiles[currentFileIndex];

  const handleApproval = (approved: boolean) => {
    if (!currentFile) return;

    if (approved) {
      writeFile(currentFile.filePath, currentFile.content);
    }
    if (currentFile === pendingFiles.at(-1)) {
      setPendingFiles([]);
      setCurrentFileIndex(0);
    } else {
      setCurrentFileIndex((prev) => prev + 1);
    }
  };
  const handleSubmit = async (value: string): Promise<void> => {
    if (!value.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: value }]);

    setLoading(true);
    try {
      const result = await chat(value);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.response },
      ]);
      if (result.intent === "edit") {
        setPendingFiles(result.files);
        setCurrentFileIndex(0);
      }
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : String(error),
        },
      ]);
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
      {currentFile && (
        <>
          <Diff
            filePath={currentFile.filePath}
            proposedContent={currentFile.content}
          />

          <Approval
            filePath={currentFile.filePath}
            onApprove={() => handleApproval(true)}
            onReject={() => handleApproval(false)}
          />
        </>
      )}

      {!loading && !currentFile &&(
        <Input
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
        ></Input>
      )}
    </Box>
  );
}
