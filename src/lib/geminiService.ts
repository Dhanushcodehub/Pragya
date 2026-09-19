import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('[NIPUN] GEMINI_API_KEY is not set in environment variables.');
}

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
export const ai = genAI;

export async function getWhyExplanation(prompt: string): Promise<string> {
  if (!genAI) {
    return 'Gemini explanation unavailable without API key.';
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const res = await model.generateContent(prompt);
    return res.response.text();
  } catch (err) {
    return 'Could not retrieve AI explanation.';
  }
}
