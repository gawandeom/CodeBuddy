import { tool } from "langchain";
import { listFiles, readFile, writeFile } from "./fileops.js";
import * as z from "zod";

export const readFileTool = tool(
  ({ filePath }) => {
    try {
      return readFile(filePath);
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
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
    description: "writes the content in the file",
    schema: z.object({
      filePath: z.string(),
      content: z.string(),
    }),
  },
);

export const listFilesTool = tool(
  ({ dirPath }) => {
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
      dirPath: z.string(),
    }),
  },
);
