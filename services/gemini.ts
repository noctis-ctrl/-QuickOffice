
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

// Always use the apiKey from process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getAIFeedback(question: Question, userAnswer: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Question: ${question.prompt}
                 Expected Logic: ${question.correctAnswer}
                 User Answer: ${userAnswer}
                 Please evaluate if this answer is functionally equivalent or correct. 
                 Be helpful and encouraging, like a supportive office tutor.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isCorrect: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING },
            suggestion: { type: Type.STRING }
          },
          required: ["isCorrect", "feedback"]
        }
      }
    });

    // Extract text directly from the response property.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini Error:", error);
    return { isCorrect: false, feedback: "Oops, something went wrong with the AI coach. Try again!", suggestion: "" };
  }
}

export async function generateChallenge(topic: string, tool: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a unique ${tool} challenge about ${topic} in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: { type: Type.STRING },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["prompt", "correctAnswer", "explanation"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return null;
  }
}
