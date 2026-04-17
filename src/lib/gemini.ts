import { GoogleGenAI, Type } from "@google/genai";
import { CitizenProfile } from "../types";
import { NATIONAL_SCHEMES } from "./knowledgeGraph";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
You are JanSaarthi Assistant, the heart of JanSaarthi AI - India's Opportunity Intelligence Infrastructure.
Your mission is to help citizens of Bharat discover government schemes, jobs, and services they are eligible for.

CORE PRINCIPLES:
1. BE MULTILINGUAL: Respond in the user's language (Hindi, English, Marathi, Telugu, etc.). You must be able to translate complex policy terms into simple local dialects.
2. BE EMPATHETIC: Many users may have low literacy or technical barriers. Speak like a helpful "Saarthi" (guide).
3. BE PRECISE: Use the provided Knowledge Graph to check eligibility.
4. EXTRACT DATA: Always look for pieces of information to build the user's "Yojana ID" profile (Age, State, Gender, Occupation, Income).

CURRENT KNOWLEDGE GRAPH:
${JSON.stringify(NATIONAL_SCHEMES)}

USER PROFILE (known so far):
{{PROFILE}}

OBJECTIVE:
- Analyze the user's query.
- If you find new profile info, list it in your response.
- Recommend schemes from the knowledge graph if the user fits.
- If info is missing (e.g., age or income), ask gently.
`;

export async function processJanSaarthiChat(
  message: string, 
  history: { role: 'user' | 'assistant', content: string }[],
  profile: CitizenProfile
) {
  try {
    const systemInstruction = SYSTEM_PROMPT.replace("{{PROFILE}}", JSON.stringify(profile));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history.map(h => ({ 
          role: h.role === 'user' ? 'user' : 'model', 
          parts: [{ text: h.content }] 
        })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
}

export async function extractProfileInfo(message: string, currentProfile: CitizenProfile): Promise<Partial<CitizenProfile>> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract citizen profile information from this message: "${message}". 
      Look for: age, gender, state, district, occupation (vocat.), income, caste, disability, farmer status, BPL status.
      Return ONLY valid JSON that matches this schema:
      {
        "age": number,
        "gender": string,
        "state": string,
        "district": string,
        "occupation": string,
        "annualIncome": number,
        "casteCategory": string,
        "disabilityStatus": boolean,
        "isFarmer": boolean,
        "hasBPLCard": boolean
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            age: { type: Type.NUMBER },
            gender: { type: Type.STRING },
            state: { type: Type.STRING },
            district: { type: Type.STRING },
            occupation: { type: Type.STRING },
            annualIncome: { type: Type.NUMBER },
            casteCategory: { type: Type.STRING },
            disabilityStatus: { type: Type.BOOLEAN },
            isFarmer: { type: Type.BOOLEAN },
            hasBPLCard: { type: Type.BOOLEAN },
          }
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (e) {
    console.error("Extraction Error:", e);
    return {};
  }
}
