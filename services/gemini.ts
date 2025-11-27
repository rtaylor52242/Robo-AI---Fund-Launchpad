import { GoogleGenAI, Type } from "@google/genai";
import { CampaignCategory } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface CampaignGenParams {
  idea: string;
  goal: string;
  category: CampaignCategory;
}

export interface AIResponse {
  title: string;
  tagline: string;
  description: string;
  marketingCopy: string;
  targetAudience: string;
}

export const generateCampaignDetails = async (params: CampaignGenParams): Promise<AIResponse> => {
  try {
    const prompt = `
      You are an expert crowdfunding consultant. 
      Create a comprehensive campaign structure for a project in the "${params.category}" category.
      The user's raw idea is: "${params.idea}".
      Their primary goal is: "${params.goal}".

      Please generate a catchy title, a short punchy tagline, a compelling long-form description (at least 2 paragraphs, using markdown), 
      suggested marketing copy for social media, and identify the target audience.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            description: { type: Type.STRING },
            marketingCopy: { type: Type.STRING },
            targetAudience: { type: Type.STRING },
          },
          required: ['title', 'tagline', 'description', 'marketingCopy', 'targetAudience']
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as AIResponse;

  } catch (error) {
    console.error("AI Text Gen Error:", error);
    // Fallback structure if AI fails
    return {
      title: "Project " + params.category,
      tagline: "A revolutionary new project.",
      description: params.idea,
      marketingCopy: "Check this out!",
      targetAudience: "General public"
    };
  }
};

export const generateCampaignImage = async (description: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Generate a high-quality, photorealistic or stylistic promotional image for a crowdfunding campaign described as: ${description}. Aspect ratio 16:9. No text overlay.` }]
      },
      config: {
        // Note: gemini-2.5-flash-image uses generateContent but returns inlineData for images usually if requested via specific tools, 
        // but for standard generation, we look for the image part in the response. 
        // However, specific image gen models often require specific handling.
        // We will attempt to parse the inline data if available.
      }
    });

    // Iterate parts to find image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // Fallback: If the model returns text or fails to generate inline image (depends on specific API capability availability)
    // We return a placeholder. 
    return `https://picsum.photos/800/450?random=${Date.now()}`;

  } catch (error) {
    console.error("AI Image Gen Error:", error);
    return `https://picsum.photos/800/450?random=${Date.now()}`;
  }
};

export const analyzeCampaignPerformance = async (campaignTitle: string, description: string, currentFunding: number, goal: number) => {
  try {
    const prompt = `
      Analyze the current status of the crowdfunding campaign "${campaignTitle}".
      Description: "${description.substring(0, 200)}..."
      Progress: $${currentFunding} raised of $${goal} goal.

      Provide a JSON analysis with:
      1. A sentiment score (0-100) based on the description's appeal.
      2. Three specific actionable tips to boost funding.
      3. A projected success probability percentage (0-100).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: { type: Type.NUMBER },
            tips: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            successProbability: { type: Type.NUMBER }
          }
        }
      }
    });
     const text = response.text;
    if (!text) throw new Error("No response");
    return JSON.parse(text);
  } catch (error) {
     console.error("Analytics Error", error);
     return {
       sentimentScore: 75,
       tips: ["Share more on social media", "Add a video update", "Expand reward tiers"],
       successProbability: 60
     };
  }
}
