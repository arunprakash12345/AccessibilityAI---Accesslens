import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Message } from "./types";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { showToast } from "./Toast";
import {
  analyzeScreenshot,
  askAccessibilityQuestion,
  fileToBase64,
  ChatMessage,
} from "@/services/ai";

interface ChatViewProps {
  messages: Message[];
  onMessagesChange: (msgs: Message[]) => void;
  initialPrompt?: string | null;
  initialFile?: File | null;
  onConsumeInitial?: () => void;
}

export function ChatView({ messages, onMessagesChange, initialPrompt, initialFile, onConsumeInitial }: ChatViewProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialProcessed = useRef(false);

  // Process initial prompt or file when component mounts
  useEffect(() => {
    if (initialProcessed.current) return;

    if (initialPrompt) {
      initialProcessed.current = true;
      onConsumeInitial?.();
      processTextMessage(initialPrompt, []);
    } else if (initialFile) {
      initialProcessed.current = true;
      onConsumeInitial?.();
      processImageUpload(initialFile, []);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function buildHistory(): ChatMessage[] {
    return messages
      .filter((m) => m.type === "text" || m.type === "results")
      .map((m) => {
        if (m.role === "user") {
          return { role: "user" as const, content: m.content || "" };
        }
        return { role: "assistant" as const, content: m.content || m.analysisResult?.summary || "" };
      });
  }

  async function processTextMessage(text: string, currentMessages: Message[]) {
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now() + "u",
      role: "user",
      type: "text",
      content: text,
    };

    const updated = [...currentMessages, userMsg];
    onMessagesChange(updated);

    try {
      const history = currentMessages
        .filter((m) => m.type === "text" || m.type === "results")
        .map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content || m.analysisResult?.summary || "",
        }));

      const response = await askAccessibilityQuestion(text, history);

      const aiMsg: Message = {
        id: Date.now() + "a",
        role: "assistant",
        type: "text",
        content: response,
      };
      onMessagesChange([...updated, aiMsg]);
    } catch (err) {
      const errorContent = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      const errorMsg: Message = {
        id: Date.now() + "e",
        role: "assistant",
        type: "error",
        content: errorContent,
      };
      onMessagesChange([...updated, errorMsg]);
      showToast(errorContent, "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function processImageUpload(file: File, currentMessages: Message[]) {
    setIsLoading(true);
    const imageUrl = URL.createObjectURL(file);

    const userMsg: Message = {
      id: Date.now() + "u",
      role: "user",
      type: "image",
      imageUrl,
      content: file.name,
    };

    const analyzingMsg: Message = {
      id: Date.now() + "analyzing",
      role: "assistant",
      type: "analyzing",
    };

    const updated = [...currentMessages, userMsg, analyzingMsg];
    onMessagesChange(updated);

    try {
      const base64 = await fileToBase64(file);
      const response = await analyzeScreenshot(base64, file.type || "image/png");

      const resultMsg: Message = {
        id: Date.now() + "a",
        role: "assistant",
        type: "text",
        content: response,
      };

      onMessagesChange([
        ...updated.filter((m) => m.type !== "analyzing"),
        resultMsg,
      ]);
    } catch (err) {
      const errorContent = err instanceof Error ? err.message : "Failed to analyze. Please try again.";
      const errorMsg: Message = {
        id: Date.now() + "e",
        role: "assistant",
        type: "error",
        content: errorContent,
      };
      onMessagesChange([
        ...updated.filter((m) => m.type !== "analyzing"),
        errorMsg,
      ]);
      showToast(errorContent, "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend(text: string) {
    if (isLoading) return;
    await processTextMessage(text, messages);
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || isLoading) return;
    e.target.value = "";
    await processImageUpload(file, messages);
  }

  const title = messages.length <= 1 ? "New Review" : "Accessibility Review";
  const showTyping = isLoading && messages[messages.length - 1]?.type !== "analyzing";

  return (
    <div className="flex flex-col h-full">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
        aria-hidden="true"
      />

      {/* Top bar */}
      <div className="px-4 sm:px-6 py-3.5 border-b border-[#e5e7eb] flex items-center bg-white shrink-0">
        <h2 className="text-sm font-semibold text-[#111111] pl-10 md:pl-0">{title}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-6" role="log" aria-label="Chat messages" aria-live="polite">
        <div className="max-w-2xl mx-auto w-full flex flex-col gap-6">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
            >
              <MessageBubble message={msg} />
            </motion.div>
          ))}

          {showTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3" role="status" aria-label="AccessLens is thinking">
              <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shrink-0" aria-hidden="true">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <circle cx="6.5" cy="6.5" r="4.5" stroke="white" strokeWidth="1.3"/>
                  <path d="M4.5 6.5h4M6.5 4.5v4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex items-center gap-1 py-2">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: dot * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        onUpload={handleUploadClick}
        placeholder="Ask about accessibility or upload a screenshot…"
        disabled={isLoading}
      />
    </div>
  );
}
