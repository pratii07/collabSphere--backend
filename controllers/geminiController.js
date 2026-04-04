const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.explainText = async (req, res) => {
  const { text } = req.body;
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Gemini API key is not configured in the backend." });
  }

  if (!text) {
    return res.status(400).json({ error: "Please provide text or code to explain." });
  }

  try {
    const prompt = `Please provide a clear and succinct explanation of the following text/code:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ explanation: response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateDocs = async (req, res) => {
  const { code } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Gemini API key is not configured in the backend." });
  }

  if (!code) {
    return res.status(400).json({ error: "Please provide code to generate documentation for." });
  }

  try {
    const prompt = `Generate comprehensive Markdown documentation for the following code. Include an overview, function/class descriptions, parameters, and return types if applicable:\n\n${code}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ docs: response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateReadme = async (req, res) => {
  const { description } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Gemini API key is not configured in the backend." });
  }

  if (!description) {
    return res.status(400).json({ error: "Please provide a project description." });
  }

  try {
    const prompt = `Generate a high-quality Markdown README.md file based on the following project description. Include appropriate sections such as Project Title, Description, Features, Installation, and Usage:\n\n${description}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ readme: response.text() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
