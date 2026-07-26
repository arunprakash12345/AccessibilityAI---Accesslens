import { useState } from "react";
import { motion } from "motion/react";
import { Message } from "./types";
import { showToast } from "./Toast";

// --- Analyzing state ---

function AnalyzingMessage() {
  const steps = [
    { label: "Processing image", done: true },
    { label: "Evaluating WCAG criteria", done: false, active: true },
    { label: "Generating recommendations", done: false },
  ];

  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Analyzing accessibility">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-5 h-5 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-spin" aria-hidden="true" />
        <p className="text-sm font-medium text-[#111111]">Analyzing accessibility…</p>
      </div>
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3 }}
            className="flex items-center gap-2.5"
          >
            {step.done ? (
              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
                  <path d="M1.5 4l2 2 3-3" stroke="#10b981" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ) : step.active ? (
              <div className="w-4 h-4 rounded-full border-2 border-[#4F46E5] border-t-transparent animate-spin shrink-0" aria-hidden="true" />
            ) : (
              <div className="w-4 h-4 rounded-full border border-[#e5e7eb] shrink-0" aria-hidden="true" />
            )}
            <span className={`text-sm ${
              step.done ? "text-[#6b7280] line-through decoration-[#d1d5db]"
                : step.active ? "text-[#4F46E5] font-medium"
                : "text-[#9ca3af]"
            }`}>
              {step.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- Error state ---

function ErrorMessage({ content }: { content: string }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3" role="alert">
      <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path d="M5 3v3M5 7.5h.01" stroke="#ef4444" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
      <div>
        <p className="text-xs font-semibold text-red-700 mb-0.5">Error</p>
        <p className="text-xs text-red-600 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

// --- Text rendering with markdown support ---

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#111111]">$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="bg-[#f7f7f8] px-1 py-0.5 rounded text-[11px] font-mono">$1</code>');
}

function TextMessage({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) { i++; continue; }

    // Code blocks
    if (line.startsWith("```")) {
      const lang = line.replace("```", "").trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={elements.length} className="rounded-xl border border-[#e5e7eb] overflow-hidden my-1">
          {lang && <div className="px-3 py-1.5 bg-[#f7f7f8] border-b border-[#e5e7eb] text-[11px] font-medium text-[#6b7280]">{lang}</div>}
          <pre className="px-3 py-2.5 text-xs font-mono text-[#374151] overflow-x-auto bg-white leading-relaxed whitespace-pre-wrap">{codeLines.join("\n")}</pre>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith("###") || line.startsWith("##")) {
      elements.push(<p key={elements.length} className="text-sm font-semibold text-[#111111] mt-2">{line.replace(/^#{1,4}\s*/, "")}</p>);
      i++; continue;
    }

    // Bullet list
    if (line.match(/^\s*[-*]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s/)) {
        items.push(lines[i].replace(/^\s*[-*]\s*/, ""));
        i++;
      }
      elements.push(
        <ul key={elements.length} className="flex flex-col gap-1 my-1">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-[#374151] leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]/40 mt-[7px] shrink-0" aria-hidden="true" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (line.match(/^\d+[.)]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+[.)]\s/)) {
        items.push(lines[i].replace(/^\d+[.)]\s*/, ""));
        i++;
      }
      elements.push(
        <ol key={elements.length} className="flex flex-col gap-1 my-1 list-none">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2 text-sm text-[#374151] leading-relaxed">
              <span className="text-xs font-semibold text-[#4F46E5] mt-0.5 shrink-0 w-4">{j + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Regular text
    elements.push(
      <p key={elements.length} className="text-sm text-[#374151] leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
    );
    i++;
  }

  return <div className="flex flex-col gap-2 max-w-full">{elements}</div>;
}

// --- Copy button ---

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast("Copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Failed to copy", "error");
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover/msg:opacity-100 transition-opacity w-6 h-6 rounded-md flex items-center justify-center text-[#9ca3af] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
      aria-label="Copy response"
      title="Copy"
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M8 4V2.5A1.5 1.5 0 006.5 1h-4A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4" stroke="currentColor" strokeWidth="1.3"/></svg>
      )}
    </button>
  );
}

// --- Main Component ---

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] sm:max-w-[80%]">
          {message.type === "image" ? (
            <div className="rounded-2xl overflow-hidden border border-[#e5e7eb] shadow-sm">
              <div className="bg-[#f7f7f8] px-3 py-2 flex items-center gap-2 border-b border-[#e5e7eb]">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                  <rect x="1.5" y="1.5" width="10" height="10" rx="1.5" stroke="#6b7280" strokeWidth="1.2"/>
                  <circle cx="4.5" cy="4.5" r="1" fill="#6b7280"/>
                  <path d="M2 9l3-3 2 2 2-2 2 3" stroke="#6b7280" strokeWidth="1.1" strokeLinejoin="round"/>
                </svg>
                <span className="text-xs text-[#6b7280] truncate">{message.content || "screenshot.png"}</span>
              </div>
              {message.imageUrl && (
                <img src={message.imageUrl} alt="Uploaded UI screenshot" className="w-full sm:max-w-xs object-cover" loading="lazy" />
              )}
            </div>
          ) : (
            <div className="bg-[#4F46E5] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed">
              {message.content}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Assistant messages
  return (
    <div className="flex gap-3 max-w-full group/msg">
      <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="white" strokeWidth="1.3"/>
          <path d="M4.5 6.5h4M6.5 4.5v4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-xs font-semibold text-[#111111]">AccessLens</p>
          {message.type === "text" && message.content && (
            <CopyButton text={message.content} />
          )}
        </div>
        <div className="max-w-2xl">
          {message.type === "analyzing" && <AnalyzingMessage />}
          {message.type === "error" && <ErrorMessage content={message.content || "An error occurred."} />}
          {message.type === "text" && <TextMessage content={message.content || ""} />}
        </div>
      </div>
    </div>
  );
}
