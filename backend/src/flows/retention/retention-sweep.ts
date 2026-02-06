import { ai } from '../../config/genkit'
import { crmService } from '../../services/crm.service'
import { messagingService } from '../../services/messaging.service'
import { z } from 'zod'

export const retentionSweepFlow = ai.defineFlow(
  {
    name: 'flow_retention_sweep',
    inputSchema: z.object({
      daysSinceLastAttendance: z.number().default(14),
      channel: z.enum(['sms', 'whatsapp', 'voice']).default('sms'),
      maxContacts: z.number().optional(),
    }),
    outputSchema: z.object({
      totalStudentsFound: z.number(),
      contactsAttempted: z.number(),
      contactsSuccessful: z.number(),
      contactsFailed: z.number(),
      students: z.array(z.object({
        id: z.string(),
        name: z.string().optional(),
        phone: z.string(),
        daysSinceAttendance: z.number(),
        contactStatus: z.enum(['success', 'failed', 'skipped']),
      })),
    }),
  },
  async ({ daysSinceLastAttendance, channel, maxContacts }) => {
    const absenteeStudents = await crmService.getAbsenteeStudents(daysSinceLastAttendance)

    const studentsToContact = maxContacts
      ? absenteeStudents.slice(0, maxContacts)
      : absenteeStudents

    const results = {
      totalStudentsFound: absenteeStudents.length,
      contactsAttempted: 0,
      contactsSuccessful: 0,
      contactsFailed: 0,
      students: [] as any[],
    }

    for (const student of studentsToContact) {
      results.contactsAttempted++

      const daysSince = student.lastAttendanceDate
        ? Math.floor(
            (new Date().getTime() - new Date(student.lastAttendanceDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : daysSinceLastAttendance

      const personalizedMessage = `Hi ${student.name || 'there'}! We noticed you haven't been to class in a while and we miss you at Gracie Barra! 💪 Life gets busy, but your training is important. Can we help you get back on the mats? Reply YES if you'd like to schedule your comeback class!`

      try {
        if (channel === 'sms') {
          await messagingService.sendSMS(student.phone, personalizedMessage)
        } else if (channel === 'whatsapp') {
          await messagingService.sendWhatsApp(student.phone, personalizedMessage)
        }

        await messagingService.logInteraction({
          userId: student.id,
          channel: channel === 'voice' ? 'voice' : channel,
          direction: 'outbound',
          outcome: 'question_answered',
          summary: 'Retention outreach',
          timestamp: new Date().toISOString(),
        })

        results.contactsSuccessful++
        results.students.push({
          id: student.id,
          name: student.name,
          phone: student.phone,
          daysSinceAttendance: daysSince,
          contactStatus: 'success',
        })
      } catch (error) {
        results.contactsFailed++
        results.students.push({
          id: student.id,
          name: student.name,
          phone: student.phone,
          daysSinceAttendance: daysSince,
          contactStatus: 'failed',
        })
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return results
  }
)
