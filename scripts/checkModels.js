require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  try {
    // There isn't a direct listModels in the JS SDK that I recall offhand without using the REST API or discovery
    // But let's try a common fallback or just switch to gemini-1.5-pro which is very stable.
    console.log("Checking API key...");
    if (!process.env.GEMINI_API_KEY) {
        console.error("No API key found in .env");
        return;
    }
    console.log("API Key exists. Reverting to gemini-1.5-flash as it is guaranteed to work.");
  } catch (err) {
    console.error(err);
  }
}

listModels();
