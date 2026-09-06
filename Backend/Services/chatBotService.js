
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY?.trim();

if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is not configured");
}

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
    })
  : null;

export const getChatbotResponse = async (message) => {
  try {
    if (!message || !message.trim()) {
      throw new Error("Message is required");
    }

    if (!ai) {
      throw new Error("Gemini API key is not configured");
    }

    const prompt = `
You are the AI Safety Assistant for a Landslide Risk Monitoring & Early Warning System for the North Eastern Region (NER) of India.

Help citizens with:
- Landslide safety
- Rainfall and flood risks
- Road blockages
- Disaster preparedness
- Emergency safety
- Evacuation guidance
- General disaster-related questions

Instructions:
- Give clear and practical answers.
- Prioritize human safety.
- Keep answers easy to understand.
- Do not invent live weather, road or risk information.
- If the user asks for live information that you do not have access to, clearly say so.
- During an emergency, advise the user to follow local authorities and emergency services.

User question:
${message.trim()}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    const text = response?.text?.trim();

    if (!text) {
      throw new Error("Gemini returned an empty response");
    }

    return text;
  } catch (error) {
    console.error("❌ Gemini Chat Error:", error);
    throw error;
  }
};

