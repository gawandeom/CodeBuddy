import { tool } from "langchain";
import {
  listFiles,
  readFile,
  runCommand,
  searchFiles,
  writeFile,
} from "./fileops.js";
import * as z from "zod";

export const readFileTool = tool(
  ({ filePath }) => {
    console.log("📖 read_file called with:", filePath);
    try {
      return readFile(filePath);
    } catch (error: any) {
      return `Error: ${error.message}`;
    }
  },
  {
    name: "read_file",
    description: "Read the content of the file",
    schema: z.object({
      filePath: z.string(),
    }),
  },
);

export const writeFileTool = tool(
  ({ filePath, content }) => {
    return writeFile(filePath, content);
  },
  {
    name: "write_file",
    description: "Writes the content into the file",
    schema: z.object({
      filePath: z.string(),
      content: z.string(),
    }),
  },
);

export const listFilesTool = tool(
  ({ dirPath }) => {
    console.log(`📂 list_files called with: ${dirPath ?? "."}`);
    try {
      const files = listFiles(dirPath ?? ".");
      return files.join(", ");
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  },
  {
    name: "list_files",
    description:
      "Lists files in a directory inside the workspace. Defaults to the workspace root if no path is given.",
    schema: z.object({
      dirPath: z.string().optional(),
    }),
  },
);

export const searchFilesTool = tool(
  ({ query }) => {
    console.log("🔎 search_files called with:", query);
    try {
      return searchFiles(query);
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  },
  {
    name: "search_files",
    description: "Searches the content of every file in the workspace for a given query.",
    schema: z.object({
      query: z.string(),
    }),
  },
);


const ALLOWED_COMMANDS = ["npm test", "npm run build", "npx tsc --noEmit"];

export const runCommandTool = tool(
  ({ command }) => {
    console.log(`⚙️ run_command called with: ${command}`);

    if (!ALLOWED_COMMANDS.includes(command)) {
      return `Error: "${command}" is not an allowed command. Allowed commands are: ${ALLOWED_COMMANDS.join(", ")}`;
    }

    try {
      return runCommand(command);
    } catch (err: any) {
      return `Error: ${err.message}`;
    }
  },
  {
    name: "run_command",
    description: `Runs a whitelisted command in the workspace and returns its output. Only these exact commands are allowed: ${ALLOWED_COMMANDS.join(", ")}. Any other command will be refused.`,
    schema: z.object({
      command: z.string(),
    }),
  },
);