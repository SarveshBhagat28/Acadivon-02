import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, StudyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FileData {
  data: string; // base64
  mimeType: string;
}

export async function generateQuizFromContent(content: string, file?: FileData): Promise<QuizQuestion[]> {
  try {
    const parts: any[] = [
      { text: `Task: Create a quiz with EXACTLY 10 questions based ONLY on the context provided.
Requirements:
- Difficulty Distribution: 3 Easy (basic definitions, direct recall), 4 Medium (understanding, application), 3 Hard (analysis, concept linking).
- Question Types: Mix of MCQ (with 4 options) and Short Answer.
- Format as JSON array of objects: 
[ { "question": "...", "options": ["...", "...", "...", "..."], "answer": "...", "difficulty": "Easy/Medium/Hard", "explanation": "...", "type": "MCQ/ShortAnswer" } ]
- For Short Answer questions, omit the "options" field.
- Ensure conceptual coverage across topics.
- Do NOT use external knowledge.
Return ONLY the JSON array.` }
    ];

    if (content.trim()) {
      parts.push({ text: `Context: ${content}` });
    }

    if (file) {
      parts.push({
        inlineData: {
          data: file.data,
          mimeType: file.mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              answer: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
              explanation: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["MCQ", "ShortAnswer"] }
            },
            required: ["question", "answer", "difficulty", "explanation", "type"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

export async function generateStudyPlan(assignmentName: string, estimatedHours: number): Promise<StudyPlan> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Assignment: ${assignmentName}
Estimated Time: ${estimatedHours} hours
Task: Generate a study plan using the Pomodoro technique (25 min study + 5 min break, 15-20 min break after 4 cycles).
Requirements:
- Break assignment into smaller, specific tasks (understand, plan, execute, review, etc.).
- Adjust total sessions based on estimated time.
- Add short motivational tips between sessions.
- Suggest specific actions for each session (not generic).
- Format as JSON:
{
  "assignmentName": "...",
  "totalTime": number,
  "sessions": [
    { "type": "Study/Break", "duration": number, "task": "...", "time": "e.g. 09:00 - 09:25", "tip": "..." }
  ]
}
Return ONLY the JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            assignmentName: { type: Type.STRING },
            totalTime: { type: Type.NUMBER },
            sessions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ["Study", "Break"] },
                  duration: { type: Type.NUMBER },
                  task: { type: Type.STRING },
                  time: { type: Type.STRING },
                  tip: { type: Type.STRING }
                },
                required: ["type", "duration", "task", "time"]
              }
            }
          },
          required: ["assignmentName", "totalTime", "sessions"]
        }
      }
    });

    return JSON.parse(response.text);
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
