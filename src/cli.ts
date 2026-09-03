#!/usr/bin/env -S npx tsx
import { Command } from "commander";
import { createCodeBuddyAgent } from "./agent.js";
import { fileExists, readFile, writeFile } from "./fileops.js";
import { showDifference } from "./diff.js";
import { askApproval } from "./prompt.js";

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


const proposedCode = result.messages.at(-1)?.content as string
console.log("Proposed Changes")
showDifference(originalContent,proposedCode)


const approved = await askApproval("Apply This Change (y/n)")

if(approved){
  writeFile(filePath,proposedCode)
  console.log("file Saved")
}else{
  console.log("change discarded")
}