const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.explainNote = async (req, res) => {
  const { title, content } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Gemini API key is not configured in the backend." });
  }

  try {
    const prompt = `Explain the following project note in detail:
    Title: ${title}
    Content: ${content}
    
    Provide a clear, structured explanation with key points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ explanation: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.improveNote = async (req, res) => {
  const { title, content } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Gemini API key is not configured in the backend." });
  }

  try {
    const prompt = `Rewrite and improve the following project note to make it more professional, clear, and concise:
    Title: ${title}
    Content: ${content}
    
    ONLY return the improved content, nothing else.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ improvedContent: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.askAI = async (req, res) => {
  const { prompt } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    console.error("AI Error: GEMINI_API_KEY missing");
    return res.status(400).json({ error: "Gemini API key is not configured in the backend." });
  }

  if (!prompt) {
    return res.status(400).json({ error: "Please provide a prompt." });
  }

  try {
    console.log("AI Prompt received:", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("AI Response generated:", text.substring(0, 50) + "...");
    res.json({ response: text });
  } catch (err) {
    console.error("AI Controller Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
