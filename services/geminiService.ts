
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generatePromptFromImage(base64Image: string, mimeType: string): Promise<string> {
    try {
        const imagePart = {
            inlineData: {
                mimeType: mimeType,
                data: base64Image,
            },
        };

        const textPart = {
            text: `Describe this image in detail. Focus on the style, composition, colors, and mood. The description should be a creative and descriptive prompt suitable for an AI image generation model like Midjourney or DALL-E. Start with a short, punchy summary, then elaborate on the details.`
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
        });

        const text = response.text;
        if (text) {
            return text.trim();
        } else {
            throw new Error("The API returned an empty response.");
        }

    } catch (error) {
        console.error("Error generating prompt from image:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while contacting the Gemini API.");
    }
}
