import { CitizenProfile } from "../types";
import { NATIONAL_SCHEMES } from "./knowledgeGraph";

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
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history,
        profile,
        systemPrompt: SYSTEM_PROMPT
      })
    });

    if (!response.ok) throw new Error("Failed to communicate with Saarthi Engine.");
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
}

export async function extractProfileInfo(message: string, currentProfile: CitizenProfile): Promise<Partial<CitizenProfile>> {
  try {
    const response = await fetch("/api/extract-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    if (!response.ok) return {};
    return await response.json();
  } catch (e) {
    return {};
  }
}
