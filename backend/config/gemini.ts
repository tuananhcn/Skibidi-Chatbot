import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not defined. AI features will be disabled.');
}

const genAI = new GoogleGenerativeAI(apiKey || 'missing-key');

// Use 'gemini-1.5-flash-latest' for the best free-tier stability
export const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
});

export default genAI;
