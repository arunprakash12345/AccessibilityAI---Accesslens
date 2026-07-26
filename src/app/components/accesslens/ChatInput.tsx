import { useState, useRef } from "react";

interface ChatInputProps {
  onSend: (msg: string) => void;
  onUpload?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSend, onUpload, placeholder = "Ask a follow-up…", disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
    }
  }

  return (
    <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 bg-white border-t border-[#e5e7eb]">
      <div className="max-w-2xl mx-auto">
        <div
          className={`flex items-end gap-2 bg-white border rounded-2xl px-3 sm:px-4 py-2.5 shadow-sm transition-all ${
            disabled
              ? "border-[#e5e7eb] opacity-60"
              : "border-[#e5e7eb] focus-within:border-[#4F46E5]/50 focus-within:ring-2 focus-within:ring-[#4F46E5]/10 hover:border-[#4F46E5]/30"
          }`}
        >
          {/* Attach */}
          {onUpload && (
            <button
              onClick={onUpload}
              disabled={disabled}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9ca3af] hover:text-[#4F46E5] hover:bg-[#4F46E5]/5 transition-all shrink-0 mb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none"
              aria-label="Upload screenshot"
              title="Upload screenshot"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 10V3M8 3L5.5 5.5M8 3l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.5 11.5v1A1.5 1.5 0 004 14h8a1.5 1.5 0 001.5-1.5v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            aria-label="Message input"
            className="flex-1 resize-none bg-transparent text-sm text-[#111111] placeholder:text-[#9ca3af] outline-none leading-relaxed py-0.5 min-h-[24px] max-h-40 overflow-y-auto disabled:cursor-not-allowed"
          />

          {/* Send */}
          <button
            onClick={submit}
            disabled={!value.trim() || disabled}
            aria-label="Send message"
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shrink-0 mb-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 ${
              value.trim() && !disabled
                ? "bg-[#4F46E5] text-white hover:bg-[#4338ca] shadow-sm active:scale-95"
                : "bg-[#f3f4f6] text-[#d1d5db] cursor-not-allowed"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 11V3M7 3L3.5 6.5M7 3l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-[#d1d5db] mt-2 select-none" aria-hidden="true">
          AccessLens may produce inaccurate results. Always verify with manual testing.
        </p>
      </div>
    </div>
  );
}
