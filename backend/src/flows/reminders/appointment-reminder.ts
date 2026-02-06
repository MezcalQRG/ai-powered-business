import { ai } from '../../config/genkit'
import { calendarService } from '../../services/calendar.service'
import { crmService } from '../../services/crm.service'
import { messagingService } from '../../services/messaging.service'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'

export const appointmentReminderFlow = ai.defineFlow(
  {
    name: 'flow_appointment_reminder',
    inputSchema: z.object({
      hoursAhead: z.number().default(24),
      channel: z.enum(['sms', 'whatsapp']).default('sms'),
    }),
    outputSchema: z.object({
      totalAppointments: z.number(),
      remindersSent: z.number(),
      remindersFailed: z.number(),
      appointments: z.array(z.object({
        id: z.string(),
        userId: z.string(),
        userName: z.string().optional(),
        dateTime: z.string(),
        type: z.string(),
        reminderStatus: z.enum(['sent', 'failed']),
      })),
    }),
  },
  async ({ hoursAhead, channel }) => {
    const upcomingAppointments = await calendarService.getAppointmentsForReminder(hoursAhead)

    const results = {
      totalAppointments: upcomingAppointments.length,
      remindersSent: 0,
      remindersFailed: 0,
      appointments: [] as any[],
    }

    for (const appointment of upcomingAppointments) {
      const user = await crmService.getStudentProfile(appointment.userId)

      if (!user || !user.phone) {
        results.remindersFailed++
        results.appointments.push({
          id: appointment.id,
          userId: appointment.userId,
          userName: user?.name,
          dateTime: appointment.dateTime,
          type: appointment.type,
          reminderStatus: 'failed',
        })
        continue
      }

      const formattedDateTime = format(parseISO(appointment.dateTime), 'EEEE, MMMM d \'at\' h:mm a')
      const appointmentTypeName = appointment.type.replace('_', ' ')

      const reminderMessage = `Hi ${user.name}! Reminder: You have a ${appointmentTypeName} scheduled for ${formattedDateTime} at Gracie Barra. Reply CONFIRM to secure your spot, or RESCHEDULE if you need to change it. See you on the mats! 🥋`

      try {
        if (channel === 'sms') {
          await messagingService.sendSMS(user.phone, reminderMessage)
        } else {
          await messagingService.sendWhatsApp(user.phone, reminderMessage)
        }

        await calendarService.markReminderSent(appointment.id)

        await messagingService.logInteraction({
          userId: appointment.userId,
          channel,
          direction: 'outbound',
          outcome: 'question_answered',
          summary: `Appointment reminder sent for ${formattedDateTime}`,
          timestamp: new Date().toISOString(),
        })

        results.remindersSent++
        results.appointments.push({
          id: appointment.id,
          userId: appointment.userId,
          userName: user.name,
          dateTime: appointment.dateTime,
          type: appointment.type,
          reminderStatus: 'sent',
        })
      } catch (error) {
        results.remindersFailed++
        results.appointments.push({
          id: appointment.id,
          userId: appointment.userId,
          userName: user.name,
          dateTime: appointment.dateTime,
          type: appointment.type,
          reminderStatus: 'failed',
        })
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return results
  }
)
