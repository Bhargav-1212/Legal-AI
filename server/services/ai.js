const { DOCUMENT_ANALYSIS_SYSTEM_PROMPT, DOCUMENT_ANALYSIS_USER_PROMPT, LEGAL_RESEARCH_SYSTEM_PROMPT, LEGAL_RESEARCH_USER_PROMPT } = require('./prompts');

// Initialize OpenAI only if key is present
const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY; // Moved below with trim

const BASE_URL = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").trim();
const MODEL = (process.env.LLM_MODEL || "gpt-4o").trim();
const API_KEY = (process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || "").trim();

if (!API_KEY) {
    console.warn("WARNING: OPENAI_API_KEY or LLM_API_KEY is missing. AI features will fail.");
}

console.log("AI Service Config:");
console.log("BASE_URL:", BASE_URL);
console.log("MODEL:", MODEL);
console.log("API_KEY:", API_KEY ? "Set (starts with " + API_KEY.substring(0, 5) + ")" : "Missing");

async function safeJSONParse(content) {
    try {
        // 1. Remove markdown code blocks if present
        let cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();

        // 2. Attempt direct parse
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            // 3. If direct parse fails, try extracting from first { to last }
            const start = cleaned.indexOf('{');
            const end = cleaned.lastIndexOf('}');
            if (start !== -1 && end !== -1 && end > start) {
                const jsonStr = cleaned.substring(start, end + 1);
                return JSON.parse(jsonStr);
            }
            throw e; // Throw original error if extraction fails
        }
    } catch (e) {
        console.error("JSON Parse Error:", e);
        return null;
    }
}

async function callLLM(messages) {
    if (!API_KEY) throw new Error("Server configuration error: API Key missing");

    // Ensure URL ends with /chat/completions
    const url = BASE_URL.endsWith('/') ? `${BASE_URL}chat/completions` : `${BASE_URL}/chat/completions`;
    console.log("Calling URL:", url);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL,
                messages: messages,
                temperature: 0.2,
                max_tokens: 1500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status} at ${url}: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return content;

    } catch (error) {
        console.error("LLM Call Error:", error);
        throw error;
    }
}

const analyzeDocument = async (text) => {
    try {
        const content = await callLLM([
            { role: "system", content: DOCUMENT_ANALYSIS_SYSTEM_PROMPT },
            { role: "user", content: DOCUMENT_ANALYSIS_USER_PROMPT(text) }
        ]);

        const result = await safeJSONParse(content);
        if (!result) throw new Error("Failed to parse AI response. Response might be malformed.");
        return result;
    } catch (error) {
        console.error("AI Analysis Error:", error);
        throw new Error(error.message);
    }
};

const conductResearch = async (query) => {
    try {
        const content = await callLLM([
            { role: "system", content: LEGAL_RESEARCH_SYSTEM_PROMPT },
            { role: "user", content: LEGAL_RESEARCH_USER_PROMPT(query) }
        ]);

        const result = await safeJSONParse(content);
        if (!result) throw new Error("Failed to parse AI response");
        return result;
    } catch (error) {
        console.error("AI Research Error:", error);
        throw new Error(error.message);
    }
};

module.exports = { analyzeDocument, conductResearch };
