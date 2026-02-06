import { ai } from '../../config/genkit'
import { calendarService } from '../../services/calendar.service'
import { messagingService } from '../../services/messaging.service'
import { crmService } from '../../services/crm.service'
import { z } from 'zod'
import { format, parseISO } from 'date-fns'

export const bookAppointmentTool = ai.defineTool(
  {
    name: 'calendar_book_appointment',
    description: 'Books an appointment for a user and sends confirmation',
    inputSchema: z.object({
      userId: z.string().describe('The ID of the user to book the appointment for'),
      dateTime: z.string().describe('The date and time of the appointment in ISO format'),
      appointmentType: z.enum(['intro_class', 'private_lesson', 'regular_class', 'belt_test', 'event']),
      duration: z.number().optional().default(60).describe('Duration of the appointment in minutes'),
      notes: z.string().optional().describe('Additional notes for the appointment'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      appointmentId: z.string().optional(),
      confirmationMessage: z.string(),
    }),
  },
  async ({ userId, dateTime, appointmentType, duration, notes }) => {
    try {
      const appointmentId = await calendarService.bookAppointment({
        userId,
        dateTime,
        type: appointmentType,
        duration,
        notes,
      })

      const user = await crmService.getStudentProfile(userId)
      const formattedDateTime = format(parseISO(dateTime), 'EEEE, MMMM d \'at\' h:mm a')

      const confirmationText = `Hi ${user?.name || 'there'}! Your ${appointmentType.replace('_', ' ')} has been scheduled for ${formattedDateTime}. We look forward to seeing you at Gracie Barra! Reply CONFIRM to secure your spot.`

      if (user?.phone) {
        await messagingService.sendSMS(user.phone, confirmationText)
      }

      if (user && user.type === 'lead') {
        await crmService.updateUser(userId, {
          qualificationStatus: 'intro_scheduled',
        } as any)
      }

      return {
        success: true,
        appointmentId,
        confirmationMessage: `Appointment booked successfully for ${formattedDateTime}. Confirmation sent via SMS.`,
      }
    } catch (error) {
      return {
        success: false,
        confirmationMessage: `Failed to book appointment: ${error}`,
      }
    }
  }
)
