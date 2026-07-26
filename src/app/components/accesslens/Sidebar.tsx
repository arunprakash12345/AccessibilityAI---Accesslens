import { Screen, Conversation } from "./types";

interface SidebarProps {
  screen: Screen;
  onScreen: (s: Screen) => void;
  onNewChat: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  conversations?: Conversation[];
  activeConvoId?: string | null;
  onSelectConversation?: (id: string) => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

function formatDate(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const oneDay = 86400000;
  if (diff < oneDay) return "Today";
  if (diff < oneDay * 2) return "Yesterday";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function Sidebar({
  screen,
  onScreen,
  onNewChat,
  isOpen = true,
  onClose,
  conversations = [],
  activeConvoId,
  onSelectConversation,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const isHistory = screen === "history";

  function handleNavClick(action: () => void) {
    action();
    onClose?.();
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r
          transform transition-transform duration-200 ease-out
          md:relative md:translate-x-0 md:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ background: "var(--al-sidebar-bg)", borderColor: "var(--al-border)" }}
        role="navigation"
        aria-label="Application sidebar"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#4F46E5] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="white" strokeWidth="1.5"/>
                <path d="M4.5 7h5M7 4.5v5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-sm text-[#111111]">AccessLens</span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center text-[#6b7280] hover:bg-white hover:text-[#111111] transition-colors"
            aria-label="Close sidebar"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 mb-3">
          <button
            onClick={() => handleNavClick(onNewChat)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-[#111111] hover:bg-white hover:shadow-sm border border-transparent hover:border-[#e5e7eb] transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#6b7280] group-hover:text-[#4F46E5] transition-colors" aria-hidden="true">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            New Review
          </button>
        </div>

        {/* Nav items */}
        <div className="px-3 mb-4 flex flex-col gap-0.5" role="tablist" aria-label="Navigation">
          {([
            {
              label: "Chat",
              icon: (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M2 2h11v9H8.5L5.5 13v-2H2V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
              ),
              active: screen !== "history",
              action: () => { if (activeConvoId) onScreen("chat"); else onScreen("empty"); },
            },
            {
              label: "History",
              icon: (
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 4.5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              ),
              active: screen === "history",
              action: () => onScreen("history"),
            },
          ]).map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.action)}
              role="tab"
              aria-selected={item.active}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 ${
                item.active
                  ? "bg-white shadow-sm border border-[#e5e7eb] text-[#111111]"
                  : "text-[#6b7280] hover:text-[#111111] hover:bg-white/60"
              }`}
            >
              <span className={item.active ? "text-[#4F46E5]" : ""}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-3 border-t border-[#e5e7eb] mb-3" aria-hidden="true" />

        {/* Conversation history */}
        <div className="px-3 flex-1 overflow-y-auto">
          {conversations.length > 0 && (
            <>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9ca3af] px-2 mb-2">Recent</p>
              <div className="flex flex-col gap-0.5" role="list" aria-label="Recent conversations">
                {conversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => handleNavClick(() => onSelectConversation?.(convo.id))}
                    role="listitem"
                    className={`w-full flex items-start gap-2 px-2 py-2 rounded-xl text-left transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 ${
                      activeConvoId === convo.id && screen === "chat"
                        ? "bg-white shadow-sm border border-[#e5e7eb]"
                        : "hover:bg-white/70"
                    }`}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="mt-0.5 shrink-0 text-[#d1d5db]" aria-hidden="true">
                      <path d="M2 1.5h9v8H7.5L5 11.5v-2H2V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                    </svg>
                    <div className="min-w-0">
                      <p className="text-xs text-[#374151] truncate leading-tight">{convo.title}</p>
                      <p className="text-[10px] text-[#9ca3af] mt-0.5">{formatDate(convo.createdAt)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
          {conversations.length === 0 && (
            <p className="text-xs text-[#9ca3af] text-center px-4 py-8">No conversations yet</p>
          )}
        </div>

        {/* Theme toggle */}
        <div className="px-3 pb-4 pt-2 border-t mt-2" style={{ borderColor: "var(--al-border)" }}>
          <button
            onClick={onToggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:ring-offset-1 hover:bg-white/70 dark:hover:bg-white/5"
            style={{ color: "var(--al-fg-muted)" }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <circle cx="7.5" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M3 3l1 1M11 11l1 1M11 4l1-1M3 12l1-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                <path d="M13 8.5a5.5 5.5 0 01-7.5-7.5 6.5 6.5 0 107.5 7.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </aside>
    </>
  );
}
