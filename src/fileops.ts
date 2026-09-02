import { existsSync, readFileSync, writeFileSync } from "node:fs";




export function fileExits (filePath:string){
    return existsSync(filePath)
}


export function readFile(filePath:string){
    if(!fileExits(filePath)){
        throw new Error(`File not found ${filePath}`)
    }

    return readFileSync(filePath,"utf-8")
}

export function writeFile(filePath:string, content:string) {
  writeFileSync(filePath, content, "utf-8");
  return `Saved to ${filePath}`;
}