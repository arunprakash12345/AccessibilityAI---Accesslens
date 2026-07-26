export type Screen = "empty" | "chat" | "history";

export interface Message {
  id: string;
  role: "user" | "assistant";
  type: "text" | "image" | "analyzing" | "error";
  content?: string;
  imageUrl?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}
