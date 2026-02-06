import { ai } from '../../config/genkit'
import { ragService } from '../../services/rag.service'
import { z } from 'zod'

export const indexDocumentsFlow = ai.defineFlow(
  {
    name: 'flow_index_documents',
    inputSchema: z.object({
      documents: z.array(z.object({
        title: z.string(),
        content: z.string(),
        category: z.enum(['policy', 'pricing', 'schedule', 'faq', 'manual', 'other']),
        metadata: z.record(z.unknown()).optional(),
      })),
    }),
    outputSchema: z.object({
      totalDocuments: z.number(),
      indexed: z.number(),
      failed: z.number(),
      documentIds: z.array(z.string()),
    }),
  },
  async ({ documents }) => {
    const results = {
      totalDocuments: documents.length,
      indexed: 0,
      failed: 0,
      documentIds: [] as string[],
    }

    for (const doc of documents) {
      try {
        const documentId = await ragService.indexDocument({
          title: doc.title,
          content: doc.content,
          category: doc.category,
          metadata: doc.metadata,
          createdAt: new Date().toISOString(),
        })

        results.indexed++
        results.documentIds.push(documentId)
      } catch (error) {
        results.failed++
        console.error(`Failed to index document "${doc.title}":`, error)
      }
    }

    return results
  }
)
