interface EmptyStateProps {
  onUpload: () => void;
  onPrompt: (p: string) => void;
}

const prompts = [
  { icon: "🔍", label: "Review this screen for accessibility" },
  { icon: "✅", label: "Check WCAG compliance" },
  { icon: "🎯", label: "Identify usability issues" },
  { icon: "💡", label: "Suggest accessibility improvements" },
];

export function EmptyState({ onUpload, onPrompt }: EmptyStateProps) {

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 sm:px-6 pb-32 pt-8 max-w-2xl mx-auto w-full">
      {/* Heading */}
      <div className="text-center mb-10">
        <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center mx-auto mb-5">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="8" stroke="#4F46E5" strokeWidth="1.8"/>
            <path d="M7.5 11h7M11 7.5v7" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="text-xl sm:text-[1.75rem] font-semibold text-[#111111] tracking-tight leading-tight mb-2.5">
          Review accessibility instantly.
        </h1>
        <p className="text-[#6b7280] text-sm sm:text-[15px] leading-relaxed max-w-sm mx-auto">
          Upload a screenshot or ask a question to get accessibility recommendations powered by AI.
        </p>
      </div>

      {/* Suggested prompts */}
      <div className="w-full">
        <p className="text-xs font-medium text-[#9ca3af] uppercase tracking-widest mb-3">Suggested</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {prompts.map((p) => (
            <button
              key={p.label}
              onClick={() => onPrompt(p.label)}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[#e5e7eb] bg-white text-left text-sm text-[#374151] hover:border-[#4F46E5]/40 hover:bg-[#4F46E5]/[0.02] hover:text-[#4F46E5] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 active:scale-[0.98]"
            >
              <span className="text-base leading-none" aria-hidden="true">{p.icon}</span>
              <span className="leading-tight">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
