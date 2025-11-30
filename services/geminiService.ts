
import { GoogleGenAI } from "@google/genai";

export const generateDescription = async (keywords: string): Promise<string> => {
  if (!keywords.trim()) {
    return "";
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Fix: Improved prompt for better contextual responses.
  const prompt = `You are an assistant for a tradesperson. Based on the following keywords, write a concise and professional job completion description suitable for a client invoice or job log. Be specific about the work performed. Keywords: "${keywords}"`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating description:", error);
    throw new Error("Failed to generate description from AI.");
  }
};
