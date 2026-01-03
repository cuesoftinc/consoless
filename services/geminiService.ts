import { GoogleGenAI, Type } from "@google/genai";
import { AIAssistanceResponse } from "../types";

// Always use process.env.API_KEY directly when initializing the client.
// Assume this variable is pre-configured and accessible in the execution context.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGameCoaching = async (gameTitle: string, playerContext: string): Promise<AIAssistanceResponse> => {
  try {
    // gemini-3-pro-preview is selected for complex text tasks involving strategy and reasoning.
    const model = 'gemini-3-pro-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: `I am playing ${gameTitle}. The current situation is: ${playerContext}. 
      Provide a helpful coaching tip, a strategic recommendation, and 3 relevant stats to track.`,
      config: {
        systemInstruction: "You are an expert AI Gaming Coach. Keep advice concise, action-oriented, and encouraging. Format output as JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tip: { type: Type.STRING, description: "A quick tactical tip" },
            strategy: { type: Type.STRING, description: "A broader strategic goal" },
            relevantStats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    // Access text property directly from GenerateContentResponse.
    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as AIAssistanceResponse;

  } catch (error) {
    console.error("AI Coaching Error:", error);
    return {
      tip: "Stay focused and watch your health bar!",
      strategy: "Try to explore alternative routes.",
      relevantStats: [{ label: "Confidence", value: "High" }]
    };
  }
};

export const getLobbyChatter = async (gameTitle: string): Promise<string> => {
   try {
     // gemini-3-flash-preview is suitable for basic text tasks like hype message generation.
     const response = await ai.models.generateContent({
       model: 'gemini-3-flash-preview',
       contents: `Generate a short, hype message for a gaming lobby for the game ${gameTitle}. Under 15 words.`,
     });
     // Access text property directly.
     return response.text || "Ready to play!";
   } catch (e) {
     return "Game on!";
   }
};