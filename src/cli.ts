#!/usr/bin/env node
import { Command } from "commander";
import { createCodeBuddyAgent } from "./agent.js";
import { fileExists, readFile } from "./fileops.js";

const program = new Command();
program
  .name("codebuddy")
  .description("AI coding assistant CLI")
  .requiredOption("-f, --file <filename>", "target file to edit")
  .requiredOption("-t, --task <description>", "what change to make")
  .parse();

const { file: filePath, task: description } = program.opts() as {
  file: string;
  task: string;
};

if (!fileExists(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

const originalContent = readFile(filePath);
const agent = createCodeBuddyAgent();

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: `Read the file ${filePath} and apply this instruction: ${description}. Output only the new code.`,
    },
  ],
});

console.log(result.messages.at(-1)?.content);