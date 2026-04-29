import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getPanganAIResponse(prompt: string, context?: any) {
  const systemInstruction = `
    You are PanganAI, the intelligent assistant for PanganDesa.
    PanganDesa is a marketplace connecting village farmers directly with urban consumers via AI-powered pre-orders.
    
    Roles:
    1. For Buyers: Recommend fresh products based on season, budget, and preference. Explain traceability and harvest times.
    2. For Sellers: Help with pricing suggestions, harvest prediction (based on provided mock data), and listing optimization.
    
    Current Tone: Professional yet warm and community-focused (Indonesian "kekeluargaan").
    Language: Indonesian (primarily) but can handle English if asked.
    
    Context: ${JSON.stringify(context || {})}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("PanganAI Error:", error);
    return "Maaf, sedang ada kendala teknis. Mohon coba lagi nanti.";
  }
}
