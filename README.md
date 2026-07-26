# AccessLens

AI-powered accessibility reviewer for UI screenshots. Upload a design, get WCAG 2.1 feedback instantly.

![AccessLens Homepage](src/Home.png)

## 🔗 Links

- **Live Demo:** [accessibility-ai-accesslens.vercel.app](https://accessibility-ai-accesslens.vercel.app/)
- **GitHub:** [github.com/arunprakash12345/AccessibilityAI---Accesslens](https://github.com/arunprakash12345/AccessibilityAI---Accesslens)

## Features

- **Screenshot Analysis** — Drop a UI screenshot, get accessibility issues with WCAG references
- **Chat** — Ask accessibility questions, get practical answers
- **History** — Past reviews saved locally
- **Dark Mode** — Toggle between light/dark themes
- **Mobile Friendly** — Works on all devices

## Tech Stack

- React + TypeScript + Tailwind CSS + Vite
- Groq AI (Qwen for vision, Llama 3.3 for chat)
- Vercel serverless functions

## Run Locally

```bash
git clone https://github.com/arunprakash12345/AccessibilityAI---Accesslens.git
cd AccessibilityAI---Accesslens
npm install
```

Create `.env` with your Groq API key:
```
GROQ_API_KEY=your_key_here
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## License

MIT
