import { useState, useRef, useEffect } from "react";
import { Screen, Message, Conversation } from "./components/accesslens/types";
import { Sidebar } from "./components/accesslens/Sidebar";
import { EmptyState } from "./components/accesslens/EmptyState";
import { ChatView } from "./components/accesslens/ChatView";
import { ChatInput } from "./components/accesslens/ChatInput";
import { HistoryView } from "./components/accesslens/HistoryView";
import { ToastContainer, showToast } from "./components/accesslens/Toast";
import { useTheme } from "./components/accesslens/useTheme";

// --- LocalStorage helpers ---
const STORAGE_KEY = "accesslens_conversations";

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveConversations(convos: Conversation[]) {
  try {
    // Don't persist image blob URLs (they won't work after refresh)
    const cleaned = convos.map((c) => ({
      ...c,
      messages: c.messages.map((m) => ({
        ...m,
        imageUrl: m.imageUrl?.startsWith("blob:") ? undefined : m.imageUrl,
      })),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("empty");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>(loadConversations);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { theme, toggle: toggleTheme } = useTheme();

  // Persist conversations on change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const activeConvo = conversations.find((c) => c.id === activeConvoId);
  const messages = activeConvo?.messages || [];

  function setMessages(msgs: Message[]) {
    if (!activeConvoId) return;
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeConvoId) return c;
        let title = c.title;
        if (title === "New Chat" && msgs.length > 0) {
          const firstUser = msgs.find((m) => m.role === "user");
          if (firstUser) {
            if (firstUser.type === "image") {
              title = `Review: ${firstUser.content || "Screenshot"}`;
            } else {
              title = (firstUser.content || "New Chat").slice(0, 40);
            }
          }
        }
        return { ...c, messages: msgs, title };
      })
    );
  }

  function startNewConversation() {
    const id = Date.now().toString();
    const convo: Conversation = {
      id,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
    };
    setConversations((prev) => [convo, ...prev]);
    setActiveConvoId(id);
    return id;
  }

  function handleNewChat() {
    setScreen("empty");
    setActiveConvoId(null);
    setPendingPrompt(null);
    setPendingFile(null);
  }

  function handlePrompt(text: string) {
    startNewConversation();
    setPendingPrompt(text);
    setPendingFile(null);
    setScreen("chat");
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    startNewConversation();
    setPendingFile(file);
    setPendingPrompt(null);
    setScreen("chat");
    showToast("Image uploaded — analyzing…", "info");
  }

  function handleSelectConversation(id: string) {
    setActiveConvoId(id);
    setScreen("chat");
    setPendingPrompt(null);
    setPendingFile(null);
  }

  function handleDeleteConversation(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvoId === id) {
      setActiveConvoId(null);
      setScreen("empty");
    }
    showToast("Conversation deleted", "success");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: "var(--al-bg)", color: "var(--al-fg)" }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
        aria-hidden="true"
      />

      <Sidebar
        screen={screen}
        onScreen={setScreen}
        onNewChat={handleNewChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeConvoId={activeConvoId}
        onSelectConversation={handleSelectConversation}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {screen === "empty" && (
          <div className="flex-1 flex flex-col overflow-y-auto relative">
            <div className="px-4 sm:px-6 py-3.5 border-b border-[#e5e7eb] flex items-center shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:bg-[#f7f7f8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                  aria-label="Open menu"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                <h2 className="text-sm font-semibold text-[#111111]">New Review</h2>
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <EmptyState onUpload={handleUploadClick} onPrompt={handlePrompt} />
            </div>
            <ChatInput
              onSend={handlePrompt}
              onUpload={handleUploadClick}
              placeholder="Upload a screenshot or ask about accessibility…"
            />
          </div>
        )}

        {screen === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden absolute top-3 left-3 z-30 w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:bg-[#f7f7f8] bg-white/80 backdrop-blur-sm border border-[#e5e7eb] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
              aria-label="Open menu"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <ChatView
              messages={messages}
              onMessagesChange={setMessages}
              initialPrompt={pendingPrompt}
              initialFile={pendingFile}
              onConsumeInitial={() => { setPendingPrompt(null); setPendingFile(null); }}
            />
          </div>
        )}

        {screen === "history" && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="md:hidden px-4 py-2 border-b border-[#e5e7eb]">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6b7280] hover:bg-[#f7f7f8] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]"
                aria-label="Open menu"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <HistoryView
              conversations={conversations}
              onSelect={handleSelectConversation}
              onDelete={handleDeleteConversation}
            />
          </div>
        )}
      </main>

      <ToastContainer />
    </div>
  );
}
