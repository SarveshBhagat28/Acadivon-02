import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateQuizFromContent(content: string, difficulty: string, count: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: ${content}
Task: Create a ${difficulty} difficulty quiz with ${count} questions.
Requirements:
- Questions must be derived ONLY from the context provided.
- Format as JSON array of objects: 
[ { "question": "...", "options": ["...", "...", "...", "..."], "answer": index, "explanation": "..." } ]
Return ONLY the JSON array.`,
    });

    const text = response.text;
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Failed to parse quiz JSON");
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function getAITutorHelp(message: string, context?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are Acadivon AI, a helpful academic tutor. 
${context ? `Use this context: ${context}` : ""}
User: ${message}`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
