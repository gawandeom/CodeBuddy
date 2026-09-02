import "dotenv/config";
import { createAgent, tool } from "langchain";
import * as z from "zod";
import * as readline from "readline";
const getWeather = tool((input) => `It's sunny in ${input.city}!`, {
    name: "get_weather",
    description: "Get the weather for a given city",
    schema: z.object({
        city: z.string().describe("The city to get the weather for"),
    }),
});
const agent = createAgent({
    model: "google-genai:gemini-3.5-flash-lite",
    tools: [getWeather],
});
// Keep track of the whole conversation so the agent has memory of past turns
const messages = [];
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function ask() {
    rl.question("You: ", async (input) => {
        if (input.trim().toLowerCase() === "exit") {
            rl.close();
            return;
        }
        messages.push({ role: "user", content: input });
        const result = await agent.invoke({ messages });
        // The last message in the result is the agent's reply
        const reply = result.messages[result.messages.length - 1];
        console.log("Agent:", reply.content);
        messages.push({ role: "assistant", content: reply.content });
        ask(); // loop
    });
}
console.log("Chat started. Type 'exit' to quit.\n");
ask();
//# sourceMappingURL=index.js.map