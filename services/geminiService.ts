
import { GoogleGenAI } from "@google/genai";

export const generatePetNameIdeas = async (
  petType: string,
  personality: string
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Para usar o gerador de nomes, configure sua API KEY no ambiente ou Modo Admin.";
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const prompt = `
      Eu preciso de ideias de nomes criativos e únicos para um(a) ${petType} que tem uma personalidade ${personality}.
      Forneça uma lista de 5 nomes com uma explicação muito breve (3-4 palavras) para cada um.
      A resposta deve ser em Português do Brasil.
      Retorne a resposta em formato de texto simples, sem markdown.
      Exemplo de formato:
      1. Nome - Explicação curta
      2. Nome - Explicação curta
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Desculpe, não consegui pensar em nomes agora.";
  } catch (error) {
    console.error("Error generating names:", error);
    return "Ocorreu um erro ao conectar com nosso assistente criativo de IA.";
  }
};
