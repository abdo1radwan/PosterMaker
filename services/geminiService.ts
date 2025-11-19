
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
      
      resultsVisual: {
        type: Type.OBJECT,
        nullable: true,
        description: "Choose the most appropriate chart type (bar, line, pie) for the potential results.",
        properties: {
          type: { type: Type.STRING, enum: ["bar", "line", "pie", "generic-svg"] },
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
      },

      methodsVisual: {
         type: Type.OBJECT,
         nullable: true,
         description: "An SVG diagram depicting the experimental setup or process flow.",
         properties: {
             type: { type: Type.STRING, enum: ["generic-svg"] },
             title: { type: Type.STRING },
             svgContent: { type: Type.STRING, description: "Raw SVG XML string. Use simple shapes (rect, circle, arrow, text). ViewBox='0 0 400 300'." }
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
      
      1. If the topic involves quantitative comparisons, generate a 'resultsVisual' as a 'bar' chart.
      2. If it involves trends over time/variables, use a 'line' chart.
      3. If it involves proportions, use a 'pie' chart.
      4. ALWAYS generate a 'methodsVisual' that is a simple SVG diagram (flowchart or setup schematic) representing the methodology. The SVG must be valid XML, have a viewBox="0 0 800 500", and use standard colors (black stroke, white/light gray fill).

      Input Topic/Text:
      "${prompt}"
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an expert academic mentor helping students create high-quality science fair posters with data visualizations.",
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
