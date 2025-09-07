export interface ThinkingStep {
  type: "thinking";
  thinking: string;
}

export interface Message {
  id: string;
  content: string | (string | ThinkingStep)[];
  role: "user" | "assistant";
}