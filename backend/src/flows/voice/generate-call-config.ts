import { ai } from '../../config/genkit'
import { crmService } from '../../services/crm.service'
import { z } from 'zod'

export const generateCallConfigFlow = ai.defineFlow(
  {
    name: 'flow_generate_call_config',
    inputSchema: z.object({
      callerId: z.string(),
      callType: z.enum(['inbound', 'outbound']).default('inbound'),
      purpose: z.enum(['general', 'sales', 'retention', 'collection', 'support']).optional(),
    }),
    outputSchema: z.object({
      systemPrompt: z.string(),
      context: z.object({
        userId: z.string().optional(),
        userName: z.string().optional(),
        userType: z.string().optional(),
        paymentStatus: z.string().optional(),
        lastAttendance: z.string().optional(),
      }),
      voiceConfig: z.object({
        voiceId: z.string(),
        stability: z.number(),
        similarityBoost: z.number(),
      }),
    }),
  },
  async ({ callerId, callType, purpose }) => {
    const user = await crmService.identifyUser(callerId)

    let systemPrompt = ''
    let detectedPurpose = purpose || 'general'

    if (!user) {
      systemPrompt = `You are the friendly voice assistant for Gracie Barra martial arts academy. This is a new caller. 

Your goals:
1. Greet them warmly and professionally
2. Ask how you can help them today
3. If they're interested in training, get their name and explain our programs
4. Offer to schedule a FREE intro class
5. Use the calendar tools to check availability and book appointments
6. Be enthusiastic about Brazilian Jiu-Jitsu but don't oversell

Keep responses under 3 sentences. Speak naturally. Ask one question at a time.`
    } else {
      const student = await crmService.getStudentProfile(user.id)

      if (student) {
        if (student.paymentStatus === 'overdue' && purpose === 'collection') {
          detectedPurpose = 'collection'
          systemPrompt = `You are calling ${student.name || 'a student'} about an overdue payment.

Your approach:
1. Greet them warmly - you're not a bill collector, you're a helpful assistant
2. Mention we noticed their account needs attention
3. Ask if everything is okay and if there's anything we can help with
4. Offer payment options or payment plan if needed
5. Be empathetic but clear that we need to resolve this

Last attendance: ${student.lastAttendanceDate || 'Unknown'}
Payment status: Overdue

Keep it friendly and solution-focused.`
        } else if (student.lastAttendanceDate && purpose === 'retention') {
          detectedPurpose = 'retention'
          systemPrompt = `You are calling ${student.name || 'a student'} because they haven't attended class recently.

Your approach:
1. Greet them warmly and mention you noticed they haven't been in
2. Ask if everything is okay - are they injured? Too busy?
3. Listen to their reason with empathy
4. Remind them of their goals and progress (they're a ${student.rank || 'student'})
5. Offer to help them get back on track - maybe a different class time?
6. Try to schedule their next class

Last seen: ${student.lastAttendanceDate || 'A while ago'}

Be genuinely caring and helpful, not pushy.`
        } else {
          systemPrompt = `You are the voice assistant for Gracie Barra. You're speaking with ${student.name || 'a student'}, an active member.

Your role:
1. Greet them professionally
2. Help with any questions about schedule, account, or academy operations
3. Use tools to check class availability, answer policy questions, or check Pro Shop inventory
4. Be helpful and efficient

Member since: ${student.enrollmentDate || 'Unknown'}
Rank: ${student.rank || 'Student'}

Keep responses concise and helpful.`
        }
      } else if (user.type === 'lead' || user.type === 'new_prospect') {
        detectedPurpose = 'sales'
        systemPrompt = `You are the voice assistant for Gracie Barra. You're speaking with ${user.name || 'a prospect'} who has shown interest.

Your goals:
1. Build excitement about training at Gracie Barra
2. Answer questions about programs, schedule, and pricing
3. Address any concerns they might have
4. Schedule a FREE intro class
5. Get them enrolled

Be enthusiastic, professional, and helpful. Use questions from the knowledge base to give accurate information.`
      }
    }

    return {
      systemPrompt,
      context: {
        userId: user?.id,
        userName: user?.name,
        userType: user?.type,
        paymentStatus: (user as any)?.paymentStatus,
        lastAttendance: (user as any)?.lastAttendanceDate,
      },
      voiceConfig: {
        voiceId: 'ElevenLabs-Default',
        stability: 0.7,
        similarityBoost: 0.8,
      },
    }
  }
)
