// Vercel Serverless Function - Health Check
export default function handler(req, res) {
  res.json({ 
    status: "ok", 
    configured: Boolean(process.env.GROQ_API_KEY) 
  });
}
