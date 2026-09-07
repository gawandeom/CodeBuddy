import {diffLines}from "diff"



export function showDifference (original:string,proposed:string):void {
const changes = diffLines(original, proposed)
changes.forEach((part)=>{
    if(part.added){
        process.stdout.write(`\x1b[32m+ ${part.value}\x1b[0m`)
    }else if(part.removed){
        process.stdout.write(`\x1b[31m- ${part.value}\x1b[0m`)
    }else{
        process.stdout.write(`${part.value}`)
    }
})

}