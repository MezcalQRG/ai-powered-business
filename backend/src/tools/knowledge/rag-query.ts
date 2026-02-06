import { ai } from '../../config/genkit'
import { ragService } from '../../services/rag.service'
import { z } from 'zod'

export const ragQueryTool = ai.defineTool(
  {
    name: 'rag_query_knowledge_base',
    description: 'Searches the knowledge base for answers to questions about academy policies, prices, schedules, and procedures',
    inputSchema: z.object({
      question: z.string().describe('The user question to search for in the knowledge base'),
      category: z.enum(['policy', 'pricing', 'schedule', 'faq', 'manual', 'other']).optional().describe('Optional category to narrow the search'),
      topK: z.number().optional().default(3).describe('Number of results to return (default: 3)'),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      results: z.array(z.object({
        content: z.string(),
        source: z.string(),
        relevanceScore: z.number(),
      })),
      answer: z.string(),
    }),
  },
  async ({ question, category, topK }) => {
    const results = await ragService.queryKnowledgeBase({
      query: question,
      category,
      topK,
    })

    if (results.length === 0) {
      return {
        found: false,
        results: [],
        answer: 'I could not find specific information about that in our knowledge base. Please let me transfer you to a team member who can help.',
      }
    }

    const contextText = results
      .map((r, i) => `[Source ${i + 1}: ${r.source}]\n${r.content}`)
      .join('\n\n')

    const answer = `Based on our academy information: ${results[0].content}`

    return {
      found: true,
      results: results.map(r => ({
        content: r.content,
        source: r.source,
        relevanceScore: r.relevanceScore,
      })),
      answer,
    }
  }
)
