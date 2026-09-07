export function getAIResponse(content: unknown): string {
  return String(content ?? "");
}