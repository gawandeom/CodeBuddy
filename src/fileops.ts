import { existsSync, readFileSync, writeFileSync } from "node:fs";

export function fileExists(filePath: string) {
  return existsSync(filePath);
}
export function readFile(filePath: string) {
  if (!fileExists(filePath)) {
    throw new Error(`File Not Found : ${filePath}`);
  }
  return readFileSync(filePath, "utf-8");
}

export function writeFile(filePath: string, content: string) {
  writeFileSync(filePath, content, "utf-8");
  return `Saved ${filePath}`;
}
