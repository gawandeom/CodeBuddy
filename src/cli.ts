#!/usr/bin/env -S npx tsx
import { Command } from "commander";
import { createCodeBuddyAgent, createStructuringAgent } from "./agent.js";
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
4;
const rawOutput = RawResult.messages.at(-1)?.content;
console.log("\n--- WORKER OUTPUT ---");
console.log(rawOutput);
console.log("--- END WORKER OUTPUT ---\n");

const structuringAgent = createStructuringAgent();
const structured = await structuringAgent.invoke({
  messages: [
    {
      role: "user",
      content: `The user asked to work on this file:
                ${filePath}
                Here is the worker agent's response:
                ${rawOutput}
                Convert the worker's response into the required structured format.
                Rules:
                - If the worker answered a question or performed an investigation/check, set intent to "question".
                - Put the worker's answer in response.
                - For a question, files must be an empty array.
                - If the worker proposed code changes, set intent to "edit".
                - Put a concise explanation in response.
                - For an edit, put every changed file in files with its filePath and complete new content.
                - Do not invent file changes.
`,
    },
  ],
});

if (!structured.structuredResponse) {
  console.error("❌ The agent didn't return a structured response.");
  console.error(structured.messages.at(-1)?.content);
  process.exit(1);
}

const result = structured.structuredResponse;

if (result.intent === "question") {
  console.log("\n" + result.response);
  process.exit(0);
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

  const approved = await askApproval(
    `Apply changes to ${file.filePath}? (y/n) `,
  );

  if (approved) {
    writeFile(file.filePath, proposedCode);
    console.log(` ${file.filePath} saved`);
  } else {
    console.log(` ${file.filePath} discarded`);
  }
}
