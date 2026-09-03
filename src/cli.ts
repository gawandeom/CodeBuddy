#!/usr/bin/env -S npx tsx
import { Command } from "commander";
import { createCodeBuddyAgent, createStructuringAgent, } from "./agent.js";
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

const Workeragent = createCodeBuddyAgent();

const RawResult = await Workeragent.invoke({
  messages: [
    {
      role: "user",
      content: `Read the file ${filePath} and apply this instruction: ${description}. Output only the new code.`,
    },
  ],
});
4
const rawOutput = RawResult.messages.at(-1)?.content;

const structuringAgent = createStructuringAgent();
const structured = await structuringAgent.invoke({
  messages: [
    {
      role: "user",
      content: `Here is a description of code changes across one or more files:\n\n${rawOutput}\n\nOutput ONLY the file changes as data. Do not include any schema, type definitions, or metadata about the format — only the actual filePath and content values.`,
    },
  ],
});

if (!structured.structuredResponse) {
  console.error("❌ The agent didn't return a structured response. Raw output:");
  console.error(structured.messages.at(-1)?.content);
  process.exit(1);
}

for (const file of structured.structuredResponse.files) {
  let originalContent: string;
  try {
    originalContent = readFile(file.filePath);
  } catch {
    originalContent = ""; // treat as a new file
  }

  const proposedCode = file.content;

  console.log(`\n ${file.filePath}`);
  console.log("Proposed Changes");
  showDifference(originalContent, proposedCode);

  const approved = await askApproval(`Apply changes to ${file.filePath}? (y/n) `);

  if (approved) {
    writeFile(file.filePath, proposedCode);
    console.log(` ${file.filePath} saved`);
  } else {
    console.log(` ${file.filePath} discarded`);
  }
}