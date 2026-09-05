#!/usr/bin/env -S npx tsx
import { Command } from "commander";
import { createCodeBuddyAgent, createStructuringAgent } from "./agent.js";
import { fileExists, readFile, writeFile } from "./fileops.js";
import { showDifference } from "./diff.js";
import { askApproval, askTask } from "./prompt.js";

const program = new Command();
program
  .name("codebuddy")
  .description("AI coding assistant CLI")
  .option("-f, --file <filename>", "target file to edit")
  .option("-t, --task <description>", "what change to make")
  .parse();

let { file: filePath, task: description } = program.opts() as {
  file: string | undefined;
  task: string | undefined;
};

while (true) {
  const Task = await askTask();

  if (Task.trim().toLowerCase() === "exit") {
    console.log("GoodBye👋");
    break;
  }
  try {
    const userMessage = filePath
  ? `The user provided this file: ${filePath}\n\nTask: ${Task}`
  : `Task: ${Task}`;

    const Workeragent = createCodeBuddyAgent();

    const RawResult = await Workeragent.invoke({
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    const rawOutput = RawResult.messages.at(-1)?.content;

    const structuringAgent = createStructuringAgent();
    const structured = await structuringAgent.invoke({
      messages: [
        {
          role: "user",
          content: `
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
      continue
    }

    const result = structured.structuredResponse;

    if (result.intent === "question") {
      console.log("\n" + result.response);
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
  } catch (error: any) {
    console.log(error.name)
    console.log(error.message)
    console.log(`❌ CodeBuddy couldn't complete that task.
Please try again.`);
  }
}
