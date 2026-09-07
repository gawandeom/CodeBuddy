import * as z from "zod";



export const AgentResponse = z.object({
  intent: z.enum(["question", "edit"]),
  response: z.string(),
  files: z.array(
    z.object({
      filePath: z.string(),
      content: z.string(),
    }),
  ),
});