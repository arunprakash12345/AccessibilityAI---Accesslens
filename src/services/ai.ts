/**
 * AI Service — Groq Integration for AccessLens
 *
 * Calls the local Express server proxy (/api/chat) which forwards
 * requests to Groq. This keeps the API key secure on the server side.
 *
 * Two modes:
 * 1. Image analysis: Upload screenshot → WCAG accessibility audit (vision model)
 * 2. Text chat: Ask accessibility questions → expert guidance (chat model)
 */

const API_URL = import.meta.env.VITE_API_URL || "";
const VISION_MODEL = "qwen/qwen3.6-27b";
const CHAT_MODEL = "llama-3.3-70b-versatile";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | MessageContent[];
}

export type MessageContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

// --- System prompts ---

const ACCESSIBILITY_SYSTEM_PROMPT = `You are AccessLens, an AI accessibility auditor.

/no_think

Analyze the screenshot and give a short accessibility report.

Format:
**Score: X/100**

**Summary:** One sentence.

**Issues:**
1. **Title** (critical/warning/info, WCAG X.X.X) — One sentence description and fix.
2. Next issue — same format.

Rules:
- MAX 4 issues total
- Each issue must be ONE line only (title + severity + description + fix all on one line)
- Never exceed 4 issues
- Total response must be under 200 words
- Always finish your sentences completely`;

const CHAT_SYSTEM_PROMPT = `You are AccessLens, an accessibility consultant.

/no_think

Rules:
- Keep answers under 150 words
- Use bullet points for lists
- Cite WCAG numbers (e.g., 1.4.3) when relevant
- No lengthy intros — get to the point
- Always finish your sentences — never leave anything incomplete
- Use **bold** for key terms`;

// --- Core API call ---

async function callAPI(
  messages: ChatMessage[],
  model: string,
): Promise<string> {
  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0.3,
    max_completion_tokens: 2048,
    top_p: 1,
    stream: false,
  };

  const res = await fetch(`${API_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Server error" }));
    const errorMessage = typeof err.error === "string"
      ? err.error
      : JSON.stringify(err.error);
    throw new Error(errorMessage || `Server error (${res.status})`);
  }

  const data = await res.json();
  let content = data.choices?.[0]?.message?.content || "";

  // Strip <think>...</think> blocks (closed or unclosed)
  content = content.replace(/<think>[\s\S]*?<\/think>/g, "");
  // Also handle unclosed <think> tag (model didn't close it)
  content = content.replace(/<think>[\s\S]*/g, "");
  content = content.trim();

  return content;
}

// --- Public API ---

/**
 * Analyze a screenshot for accessibility issues using vision model.
 * Returns formatted text (same as text chat responses).
 */
export async function analyzeScreenshot(imageBase64: string, mimeType = "image/png"): Promise<string> {
  const dataUrl = `data:${mimeType};base64,${imageBase64}`;

  const messages: ChatMessage[] = [
    { role: "system", content: ACCESSIBILITY_SYSTEM_PROMPT },
    {
      role: "user",
      content: [
        { type: "text", text: "/no_think\nAnalyze this screenshot for accessibility issues. Be concise." },
        { type: "image_url", image_url: { url: dataUrl } },
      ],
    },
  ];

  return callAPI(messages, VISION_MODEL);
}

/**
 * Send a text-based accessibility question.
 */
export async function askAccessibilityQuestion(
  question: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: CHAT_SYSTEM_PROMPT },
    ...conversationHistory,
    { role: "user", content: question },
  ];

  return callAPI(messages, CHAT_MODEL);
}

/**
 * Convert a File to base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
