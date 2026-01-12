
import { GoogleGenAI, Type } from "@google/genai";
import { MealTime, Recipe } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateRecipes = async (ingredients: string[], mealTime: MealTime): Promise<Recipe[]> => {
  const prompt = `냉장고에 있는 다음 재료들을 활용하여 ${mealTime} 식사로 적합한 요리 레시피 3가지를 추천해줘: ${ingredients.join(', ')}. 
  각 레시피는 요리명, 간단한 설명, 필요한 재료 목록, 조리 순서, 예상 소요 시간, 난이도를 포함해야 해. 한국어로 응답해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              estimatedTime: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["id", "name", "description", "ingredients", "instructions", "estimatedTime", "difficulty"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("API 응답이 비어있습니다.");
    return JSON.parse(text);
  } catch (error) {
    console.error("Recipe generation failed:", error);
    throw error;
  }
};
