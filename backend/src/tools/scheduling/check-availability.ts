import { ai } from '../../config/genkit'
import { calendarService } from '../../services/calendar.service'
import { z } from 'zod'
import { addDays, startOfDay, endOfDay, parseISO, format } from 'date-fns'

export const checkAvailabilityTool = ai.defineTool(
  {
    name: 'calendar_check_availability',
    description: 'Checks available time slots for appointments within a date range',
    inputSchema: z.object({
      startDate: z.string().describe('Start date in ISO format (YYYY-MM-DD) or relative like "today", "tomorrow", "next tuesday"'),
      endDate: z.string().optional().describe('End date in ISO format (YYYY-MM-DD). If not provided, will check only the start date'),
      appointmentType: z.enum(['intro_class', 'private_lesson', 'regular_class', 'belt_test', 'event']).default('intro_class'),
    }),
    outputSchema: z.object({
      availableSlots: z.array(z.object({
        start: z.string(),
        end: z.string(),
        displayTime: z.string(),
      })),
      message: z.string(),
    }),
  },
  async ({ startDate, endDate, appointmentType }) => {
    let parsedStartDate: Date

    const lowerStartDate = startDate.toLowerCase()
    if (lowerStartDate === 'today') {
      parsedStartDate = new Date()
    } else if (lowerStartDate === 'tomorrow') {
      parsedStartDate = addDays(new Date(), 1)
    } else if (lowerStartDate.startsWith('next ')) {
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      const targetDay = lowerStartDate.replace('next ', '').trim()
      const targetDayIndex = daysOfWeek.indexOf(targetDay)
      
      if (targetDayIndex === -1) {
        parsedStartDate = parseISO(startDate)
      } else {
        parsedStartDate = new Date()
        const currentDay = parsedStartDate.getDay()
        const daysUntilTarget = (targetDayIndex - currentDay + 7) % 7 || 7
        parsedStartDate = addDays(parsedStartDate, daysUntilTarget)
      }
    } else {
      parsedStartDate = parseISO(startDate)
    }

    const parsedEndDate = endDate ? parseISO(endDate) : parsedStartDate

    const slots = await calendarService.checkAvailability(
      startOfDay(parsedStartDate),
      endOfDay(parsedEndDate),
      appointmentType
    )

    const formattedSlots = slots.slice(0, 10).map(slot => ({
      start: slot.start,
      end: slot.end,
      displayTime: format(parseISO(slot.start), 'EEEE, MMMM d \'at\' h:mm a'),
    }))

    return {
      availableSlots: formattedSlots,
      message: formattedSlots.length > 0
        ? `Found ${formattedSlots.length} available time slots`
        : 'No available slots found in the requested timeframe',
    }
  }
)
