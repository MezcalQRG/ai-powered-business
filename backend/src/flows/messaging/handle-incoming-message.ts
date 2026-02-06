import { ai } from '../../config/genkit'
import { crmService } from '../../services/crm.service'
import { messagingService } from '../../services/messaging.service'
import { identifyUserTool } from '../../tools/crm/identify-user'
import { createLeadTool } from '../../tools/crm/create-lead'
import { checkAvailabilityTool } from '../../tools/scheduling/check-availability'
import { bookAppointmentTool } from '../../tools/scheduling/book-appointment'
import { ragQueryTool } from '../../tools/knowledge/rag-query'
import { checkStockTool } from '../../tools/inventory/check-stock'
import { logInteractionTool } from '../../tools/analytics/log-interaction'
import { z } from 'zod'

export const handleIncomingMessageFlow = ai.defineFlow(
  {
    name: 'flow_handle_incoming_message',
    inputSchema: z.object({
      from: z.string(),
      to: z.string(),
      body: z.string(),
      channel: z.enum(['sms', 'whatsapp']),
    }),
    outputSchema: z.object({
      response: z.string(),
      userId: z.string().optional(),
      action: z.string().optional(),
    }),
  },
  async ({ from, to, body, channel }) => {
    const user = await crmService.identifyUser(from)

    const conversationHistory = await messagingService.getConversationHistory(from, 5)
    const historyContext = conversationHistory
      .map(i => `${i.direction === 'inbound' ? 'User' : 'AI'}: ${i.summary}`)
      .reverse()
      .join('\n')

    const systemPrompt = user
      ? user.type === 'active_student'
        ? `You are the AI assistant for Gracie Barra martial arts academy. You're speaking with ${user.name || 'a student'}, an active student. Be helpful and professional. You can help with scheduling, account questions, and general information. Use the available tools to assist them.`
        : user.type === 'former_student'
        ? `You are the AI assistant for Gracie Barra. You're speaking with ${user.name}, a former student. Welcome them back warmly and try to re-engage them. Ask what brought them back and offer to schedule a comeback class.`
        : `You are the AI assistant for Gracie Barra. You're speaking with ${user.name || 'a prospect'}, a potential new student. Your goal is to answer questions, build excitement about training, and schedule an intro class. Be enthusiastic but professional.`
      : `You are the AI assistant for Gracie Barra martial arts academy. This is a new contact. Your goal is to greet them warmly, understand their interest in martial arts training, and guide them toward scheduling a free intro class. Be welcoming and helpful.`

    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      system: systemPrompt,
      prompt: `Previous conversation:\n${historyContext}\n\nUser message: ${body}\n\nRespond naturally and helpfully. Use tools when needed to check availability, book appointments, answer questions from the knowledge base, or check inventory.`,
      tools: [
        identifyUserTool,
        createLeadTool,
        checkAvailabilityTool,
        bookAppointmentTool,
        ragQueryTool,
        checkStockTool,
        logInteractionTool,
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    })

    const responseText = response.text()

    await messagingService.logInteraction({
      userId: from,
      channel,
      direction: 'inbound',
      outcome: 'question_answered',
      summary: body,
      timestamp: new Date().toISOString(),
    })

    if (channel === 'sms') {
      await messagingService.sendSMS(from, responseText)
    } else {
      await messagingService.sendWhatsApp(from, responseText)
    }

    return {
      response: responseText,
      userId: user?.id,
      action: 'message_sent',
    }
  }
)
