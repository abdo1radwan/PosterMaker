
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PosterData } from "../types";

export const generatePosterContent = async (prompt: string): Promise<Partial<PosterData>> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      authors: { type: Type.STRING, description: "Comma separated list of dummy authors if not provided" },
      affiliation: { type: Type.STRING },
      abstract: { type: Type.STRING },
      introduction: { type: Type.STRING },
      methods: { type: Type.STRING },
      results: { type: Type.STRING },
      discussion: { type: Type.STRING },
      conclusions: { type: Type.STRING },
      references: { type: Type.STRING, description: "Numbered list of references" },
      resultsChart: {
        type: Type.OBJECT,
        nullable: true,
        properties: {
          title: { type: Type.STRING },
          xAxisLabel: { type: Type.STRING },
          yAxisLabel: { type: Type.STRING },
          data: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.NUMBER },
              }
            }
          }
        }
      }
    },
    required: ["title", "abstract", "introduction", "methods", "results", "conclusions"],
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate content for a scientific science fair poster (ISEF style) based on the following topic or text. 
      Make the content academic, concise, and suitable for a 48x36 inch poster. 
      
      If the topic involves potential quantitative data (e.g., comparisons, growth rates, survey results), invent plausible data for the 'resultsChart' field (a bar chart). 
      If no quantitative data makes sense, leave 'resultsChart' null.

      Input Topic/Text:
      "${prompt}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert academic mentor helping students create high-quality science fair posters.",
      },
    });

    const text = response.text;
    if (!text) return {};
    
    return JSON.parse(text) as Partial<PosterData>;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};
