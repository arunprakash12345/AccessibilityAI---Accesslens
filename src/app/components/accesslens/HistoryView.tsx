import { useState } from "react";
import { Conversation } from "./types";
import { MessageBubble } from "./MessageBubble";

interface HistoryViewProps {
  conversations: Conversation[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function HistoryView({ conversations, onSelect, onDelete }: HistoryViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null);
  const selected = conversations.find((c) => c.id === selectedId);

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="w-12 h-12 rounded-2xl bg-[#f7f7f8] flex items-center justify-center mb-4">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="#9ca3af" strokeWidth="1.5"/>
            <path d="M10 6v4.5l3 1.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-sm font-medium text-[#374151]">No reviews yet</p>
        <p className="text-xs text-[#9ca3af] mt-1">Start a new review to see your history here.</p>
      </div>
    );
  }

  // Get summary from a conversation
  function getConvoSummary(convo: Conversation) {
    const lastAssistant = [...convo.messages].reverse().find((m) => m.role === "assistant" && m.type === "text");
    if (lastAssistant?.content) {
      return lastAssistant.content.slice(0, 80) + (lastAssistant.content.length > 80 ? "…" : "");
    }
    const msgCount = convo.messages.filter((m) => m.role === "user").length;
    return `${msgCount} message${msgCount !== 1 ? "s" : ""}`;
  }

  return (
    <div className="flex flex-col sm:flex-row h-full">
      {/* Left: conversation list */}
      <div className="w-full sm:w-72 border-b sm:border-b-0 sm:border-r border-[#e5e7eb] flex flex-col bg-white shrink-0 max-h-48 sm:max-h-none">
        <div className="px-4 pt-5 pb-3 border-b border-[#e5e7eb]">
          <h2 className="text-sm font-semibold text-[#111111]">Review History</h2>
          <p className="text-xs text-[#9ca3af] mt-0.5">{conversations.length} session{conversations.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2" role="listbox" aria-label="Past reviews">
          {conversations.map((c) => {
            const summary = getConvoSummary(c);
            return (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                role="option"
                aria-selected={selectedId === c.id}
                className={`w-full text-left px-4 py-3 hover:bg-[#f7f7f8] transition-all border-l-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4F46E5] ${
                  selectedId === c.id ? "border-[#4F46E5] bg-[#4F46E5]/[0.03]" : "border-transparent"
                }`}
              >
                <p className="text-sm font-medium text-[#111111] leading-snug truncate">{c.title}</p>
                <p className="text-[11px] text-[#9ca3af] mt-0.5">{formatDate(c.createdAt)}</p>
                <p className="text-xs text-[#6b7280] mt-1 leading-snug line-clamp-2">{summary}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: selected conversation detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selected ? (
          <>
            <div className="px-4 sm:px-6 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
              <div>
                <h2 className="text-sm font-semibold text-[#111111]">{selected.title}</h2>
                <p className="text-xs text-[#9ca3af] mt-0.5">{formatDate(selected.createdAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelect(selected.id)}
                  className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-[#4F46E5] transition-colors px-3 py-1.5 rounded-lg border border-[#e5e7eb] hover:border-[#4F46E5]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1"
                  aria-label="Continue this conversation"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M1 1h10v7H6.5L4 10V8H1V1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                  </svg>
                  Continue
                </button>
                <button
                  onClick={() => onDelete(selected.id)}
                  className="flex items-center gap-1.5 text-xs text-[#6b7280] hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg border border-[#e5e7eb] hover:border-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
                  aria-label="Delete this conversation"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 3h8M4.5 3V2h3v1M3 3v7h6V3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Delete
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 flex flex-col gap-5">
              {selected.messages
                .filter((m) => m.type !== "analyzing")
                .map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[#9ca3af]">Select a conversation to view</p>
          </div>
        )}
      </div>
    </div>
  );
}
