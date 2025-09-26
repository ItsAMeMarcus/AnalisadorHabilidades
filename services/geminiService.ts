
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeSkills(jobDescription: string, userSkills: string): Promise<AnalysisResult> {
  const prompt = `
    Analise a seguinte descrição de vaga e a lista de habilidades de um usuário.
    Compare os dois e identifique:
    1.  'commonSkills': Habilidades que o usuário possui e que são mencionadas ou relevantes para a descrição da vaga.
    2.  'skillsToDevelop': Habilidades importantes mencionadas na vaga que o usuário não listou.

    Descrição da Vaga:
    ---
    ${jobDescription}
    ---

    Habilidades do Usuário:
    ---
    ${userSkills}
    ---

    Retorne a resposta estritamente no formato JSON solicitado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            commonSkills: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Uma habilidade que o usuário possui e é relevante para a vaga."
              },
              description: "Lista de habilidades em comum entre o usuário e a vaga."
            },
            skillsToDevelop: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "Uma habilidade necessária para a vaga que o usuário não possui."
              },
              description: "Lista de habilidades que o usuário precisa desenvolver para a vaga."
            }
          },
          required: ["commonSkills", "skillsToDevelop"]
        },
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to analyze skills with Gemini API.");
  }
}
