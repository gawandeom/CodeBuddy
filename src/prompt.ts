import * as readline from "readline/promises"
import {stdin,stdout} from "node:process"


export async function askApproval(question:string):Promise<boolean>{
const rl = readline.createInterface({input:stdin,output:stdout})
const answer = await rl.question(question)
rl.close()
return answer.trim().toLowerCase() === "y"
}


export async function  askTask():Promise<string>{
  const rl = readline.createInterface({input:stdin,output:stdout})
  let ans =await rl.question(">")
  rl.close()
  return ans
}