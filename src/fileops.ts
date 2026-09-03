import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const workspaceDir = path.resolve(process.cwd(), "./src", "workspace");

type SearchResult = {
  filePath: string;
  line: number;
  content: string;
};

function resolveWorkspacePath(filePath: string): string {
  const resolved = path.resolve(workspaceDir, filePath);
  const relative = path.relative(workspaceDir, resolved);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
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

export function getAllFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });

  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

export function searchFiles(query: string): SearchResult[] {
  const files = getAllFiles(workspaceDir);
     const searchResult:SearchResult[] = []

  for (const file of files) {
    try {
      const fileContent = readFile(file);
      const lines = fileContent.split("\n")
      for(let i =0;i<lines.length;i++){
        const line = lines[i]
        if(line?.includes(query)){
        searchResult.push({
          filePath:path.basename(file),
          line:i+1,
          content:line
        })
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
  }
  return searchResult
}
