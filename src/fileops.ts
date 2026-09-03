import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const workspaceDir = path.resolve(process.cwd(), "workspace");

function resolveWorkspacePath(filePath: string): string {
  const resolved = path.resolve(workspaceDir, filePath);

  if (!resolved.startsWith(workspaceDir)) {
    throw new Error(`Access denied: "${filePath}" is outside the workspace`);
  }

  return resolved;
}

export function fileExists(filePath: string): boolean {
  const safePath = resolveWorkspacePath(filePath);
  return existsSync(safePath);
}

export function readFile(filePath: string): string {
  const safePath = resolveWorkspacePath(filePath);
  if (!existsSync(safePath)) {
    throw new Error(`File Not Found: ${filePath}`);
  }
  return readFileSync(safePath, "utf-8");
}

export function writeFile(filePath: string, content: string): string {
  const safePath = resolveWorkspacePath(filePath);
  writeFileSync(safePath, content, "utf-8");
  return `Saved ${filePath}`;
}

export function listFiles(filePath: string = "."): string[] {
  const safePath = resolveWorkspacePath(filePath);
  return readdirSync(safePath);
}