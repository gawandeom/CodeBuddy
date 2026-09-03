import * as readline from "readline/promises"
import {stdin,stdout} from "node:process"


export async function askApproval(question:string):Promise<boolean>{
const r1 = readline.createInterface({input:stdin,output:stdout})
const answer = await r1.question(question)
r1.close()
return answer.trim().toLowerCase() === "y"
}