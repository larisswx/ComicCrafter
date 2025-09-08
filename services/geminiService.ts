
import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import type { Character } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ImageData {
    base64: string;
    mimeType: string;
}

export async function generateCharacterSheet(prompt: string): Promise<ImageData> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const image = response.generatedImages[0];
            return {
                base64: image.image.imageBytes,
                mimeType: image.image.mimeType,
            };
        } else {
            throw new Error('No image was generated for the character sheet.');
        }
    } catch (error) {
        console.error('Error in generateCharacterSheet:', error);
        throw new Error(`Failed to generate character sheet. Details: ${error.message}`);
    }
}

export async function generatePanelImage(character: Character, scenePrompt: string): Promise<ImageData> {
    try {
        const fullPrompt = `Scene: ${scenePrompt}. Draw the character described as "${character.prompt}" in a "${character.style}" style, maintaining their appearance from the provided reference image.`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: character.imageBase64,
                            mimeType: character.mimeType,
                        },
                    },
                    {
                        text: fullPrompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return {
                        base64: part.inlineData.data,
                        mimeType: part.inlineData.mimeType,
                    };
                }
            }
        }
        
        throw new Error('No image part found in the panel generation response.');

    } catch (error) {
        console.error('Error in generatePanelImage:', error);
        throw new Error(`Failed to generate panel image. Details: ${error.message}`);
    }
}
