import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.warn(
    'OPENROUTER_API_KEY is not defined. AI features using OpenRouter will be disabled.'
  );
}

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: apiKey || 'missing-key',
  // defaultHeaders: {
  //   'HTTP-Referer': 'https://github.com/internahv/tuanna2003/chatbot',
  //   'X-Title': 'Vivid Chatbot',
  // },
});

export default openai;
