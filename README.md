# AccessLens

An AI tool that looks at UI screenshots and tells you what's broken from a WCAG 2.1 accessibility standpoint. You can also just chat with it about accessibility stuff — ARIA, contrast ratios, keyboard nav, whatever.

I built this because I got tired of manually cross-checking screenshots against WCAG criteria every time a design review came up. Figured an AI could do the first pass and I could focus on the judgment calls.

## What it does

- **Screenshot review** — drop in a UI screenshot, get back a list of accessibility issues, how severe they are, and what WCAG criteria they violate
- **Chat** — ask it accessibility questions directly, it keeps context across the conversation
- **History** — past reviews are saved locally so you can go back and search through them
- **Works on mobile too**, not just desktop
- Copy button on responses because I got tired of manually selecting text

## Stack

Frontend's React + TypeScript + Tailwind, built with Vite. Backend is a small Express server that proxies requests to Groq so the API key never ends up in the browser. Radix for the unstyled UI primitives, and everything's saved to LocalStorage instead of a real database — didn't need one for this.

AI-wise it's running on Groq: Qwen 3.6 for the vision/screenshot side, Llama 3.3 70B for the text chat.

## Running it locally

You'll need Node 18+ and a [Groq API key](https://console.groq.com/).

```bash
git clone https://github.com/yourusername/accesslens.git
cd accesslens

npm install
cd server && npm install && cd ..

cp .env.example .env
# then drop your key into .env:
# GROQ_API_KEY=gsk_your_key_here
```

Then start both pieces (two terminals):

```bash
# backend
cd server && npm run dev

# frontend
npm run dev
```

Go to [http://localhost:5173](http://localhost:5173) and you're in.

## How it actually works

**Screenshots:** you upload one, it gets base64-encoded on the client, sent to Groq's vision model along with a system prompt tuned for WCAG review, and you get back a structured list of issues with severity and suggested fixes.

**Chat:** pretty standard — full conversation history gets sent along each time so the model has context, and it responds with practical answers rather than generic definitions.

## Project layout

```
├── src/
│   ├── app/
│   │   ├── App.tsx                    # top-level state
│   │   └── components/accesslens/
│   │       ├── ChatView.tsx           # main chat UI
│   │       ├── ChatInput.tsx          # input + file upload
│   │       ├── MessageBubble.tsx      # renders messages + markdown
│   │       ├── Sidebar.tsx            # nav + conversation list
│   │       ├── HistoryView.tsx        # browse past reviews
│   │       ├── EmptyState.tsx         # landing screen
│   │       ├── Toast.tsx              # notifications
│   │       └── types.ts
│   ├── services/
│   │   └── ai.ts                      # talks to the Groq proxy
│   └── styles/
├── server/
│   ├── index.js                       # Express proxy
│   └── package.json
├── .env                                # gitignored
└── .env.example
```

## A few notes on decisions I made

- Kept the Groq key server-side through a proxy rather than calling from the browser directly — didn't want to expose it
- Skipped a database in favor of LocalStorage; it's a personal tool, didn't need multi-device sync
- Qwen's vision model doesn't play nice with strict JSON mode, so I went with prompt engineering + a text parser instead of fighting it
- Qwen 3.6 sometimes leaks its `<think>` reasoning into the output — I strip that server-side before it hits the client
- Wrote a small custom markdown parser rather than pulling in a full library, since I only needed headings, lists, code blocks, and inline formatting

## Stuff I still want to add

- [ ] Export a review as a PDF
- [ ] Cmd+K to start a new chat
- [ ] Batch upload for multiple screenshots at once
- [ ] Shareable links for reviews
- [ ] A Figma plugin version

