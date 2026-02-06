import { ai } from '../../config/genkit'
import { messagingService } from '../../services/messaging.service'
import { z } from 'zod'

export const logInteractionTool = ai.defineTool(
  {
    name: 'analytics_log_interaction',
    description: 'Logs an interaction to the analytics system for KPI tracking',
    inputSchema: z.object({
      userId: z.string().describe('The ID or phone number of the user'),
      channel: z.enum(['voice', 'sms', 'whatsapp', 'facebook', 'instagram', 'email']).describe('The communication channel used'),
      outcome: z.enum(['booked', 'question_answered', 'escalated', 'failed', 'no_answer']).describe('The outcome of the interaction'),
      sentiment: z.enum(['positive', 'neutral', 'negative']).optional().describe('The sentiment of the interaction'),
      summary: z.string().optional().describe('A brief summary of the interaction'),
      duration: z.number().optional().describe('Duration of the interaction in seconds (for voice calls)'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      interactionId: z.string(),
      message: z.string(),
    }),
  },
  async ({ userId, channel, outcome, sentiment, summary, duration }) => {
    try {
      const interactionId = await messagingService.logInteraction({
        userId,
        channel,
        direction: 'inbound',
        outcome,
        sentiment,
        summary,
        duration,
        timestamp: new Date().toISOString(),
      })

      return {
        success: true,
        interactionId,
        message: 'Interaction logged successfully',
      }
    } catch (error) {
      return {
        success: false,
        interactionId: '',
        message: `Failed to log interaction: ${error}`,
      }
    }
  }
)
