import { genkit } from 'genkit'
import { googleAI } from '@genkit-ai/googleai'
import { firebase } from '@genkit-ai/firebase'

const apiKey = process.env.GOOGLE_GENAI_API_KEY

if (!apiKey) {
  throw new Error('GOOGLE_GENAI_API_KEY environment variable is required')
}

export const ai = genkit({
  plugins: [
    googleAI({ apiKey }),
    firebase(),
  ],
  model: 'googleai/gemini-1.5-flash',
})

export default ai
