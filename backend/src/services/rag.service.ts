import { getDb } from '../config/firebase'
import type { RAGDocument, RAGQuery, RAGResult } from '../types'
import { ai } from '../config/genkit'
import { embed } from '@genkit-ai/ai/embedder'

export class RAGService {
  private db = getDb()
  private embedder = ai.defineEmbedder(
    {
      name: 'gracie-barra-embedder',
      modelName: 'googleai/text-embedding-004',
      dimensions: 768,
    },
    async (input) => {
      const result = await embed({
        embedder: 'googleai/text-embedding-004',
        content: input,
      })
      return result
    }
  )

  async indexDocument(document: Omit<RAGDocument, 'id' | 'embedding'>): Promise<string> {
    const embedding = await this.generateEmbedding(document.content)

    const docData: Omit<RAGDocument, 'id'> = {
      ...document,
      embedding,
      updatedAt: new Date().toISOString(),
    }

    const docRef = await this.db.collection('knowledge_base').add(docData)
    return docRef.id
  }

  async queryKnowledgeBase(query: RAGQuery): Promise<RAGResult[]> {
    const queryEmbedding = await this.generateEmbedding(query.query)
    
    let docsQuery = this.db.collection('knowledge_base')

    if (query.category) {
      docsQuery = docsQuery.where('category', '==', query.category) as any
    }

    const snapshot = await docsQuery.get()

    const results: Array<RAGResult & { score: number }> = []

    for (const doc of snapshot.docs) {
      const data = doc.data() as RAGDocument
      
      if (!data.embedding || data.embedding.length === 0) {
        continue
      }

      const similarity = this.cosineSimilarity(queryEmbedding, data.embedding)

      if (similarity > 0.6) {
        results.push({
          content: data.content,
          relevanceScore: similarity,
          source: data.title,
          metadata: data.metadata,
          score: similarity,
        })
      }
    }

    results.sort((a, b) => b.score - a.score)

    const topK = query.topK || 3
    return results.slice(0, topK).map(({ score, ...result }) => result)
  }

  async updateDocument(documentId: string, updates: Partial<RAGDocument>): Promise<void> {
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    if (updates.content) {
      updateData.embedding = await this.generateEmbedding(updates.content)
    }

    await this.db.collection('knowledge_base').doc(documentId).update(updateData)
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.db.collection('knowledge_base').doc(documentId).delete()
  }

  async getAllDocuments(category?: RAGDocument['category']): Promise<RAGDocument[]> {
    let query = this.db.collection('knowledge_base')

    if (category) {
      query = query.where('category', '==', category) as any
    }

    const snapshot = await query.get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as RAGDocument))
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    const result = await embed({
      embedder: 'googleai/text-embedding-004',
      content: text,
    })

    return Array.from(result)
  }

  private cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      return 0
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i]
      normA += vecA[i] * vecA[i]
      normB += vecB[i] * vecB[i]
    }

    const denominator = Math.sqrt(normA) * Math.sqrt(normB)

    if (denominator === 0) {
      return 0
    }

    return dotProduct / denominator
  }
}

export const ragService = new RAGService()
