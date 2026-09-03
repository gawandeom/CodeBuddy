import * as z from "zod";

export const MultiFileEdit = z.object({
    files:z.array(z.object({
        filePath:z.string(),
        content:z.string(),
    }))
})