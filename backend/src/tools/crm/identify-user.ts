import { ai } from '../../config/genkit'
import { crmService } from '../../services/crm.service'
import { z } from 'zod'

export const identifyUserTool = ai.defineTool(
  {
    name: 'crm_identify_user',
    description: 'Identifies a user by phone number and returns their profile (New Prospect, Active Student, or Former Student)',
    inputSchema: z.object({
      phone: z.string().describe('The phone number of the user to identify'),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      user: z.object({
        id: z.string(),
        name: z.string().optional(),
        type: z.enum(['new_prospect', 'active_student', 'former_student', 'lead']),
        rank: z.string().optional(),
        lastAttendanceDate: z.string().optional(),
        paymentStatus: z.enum(['current', 'overdue', 'suspended']).optional(),
        email: z.string().optional(),
      }).optional(),
    }),
  },
  async ({ phone }) => {
    const user = await crmService.identifyUser(phone)

    if (!user) {
      return {
        found: false,
        user: undefined,
      }
    }

    const profile = await crmService.getStudentProfile(user.id)

    return {
      found: true,
      user: {
        id: user.id,
        name: user.name,
        type: user.type,
        rank: profile?.rank,
        lastAttendanceDate: profile?.lastAttendanceDate,
        paymentStatus: profile?.paymentStatus,
        email: user.email,
      },
    }
  }
)
