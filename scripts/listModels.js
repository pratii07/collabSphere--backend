require("dotenv").config();
const key = process.env.GEMINI_API_KEY;

async function listModels() {
    if (!key) {
        console.error("❌ No GEMINI_API_KEY found in .env");
        return;
    }
    
    console.log("🔍 Fetching available models for your API key...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();
        
        if (data.models) {
            let output = "Available Models:\n";
            data.models.forEach(m => {
                output += `- ${m.name.replace('models/', '')} (${m.displayName})\n`;
            });
            require("fs").writeFileSync("scripts/models_list.txt", output);
            console.log("✅ Model list saved to scripts/models_list.txt");
        } else {
            console.error("❌ Error response from Google API:", data);
        }
    } catch (err) {
        console.error("❌ Connection error:", err.message);
    }
}

listModels();
