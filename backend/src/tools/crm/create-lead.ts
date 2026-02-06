import { ai } from '../../config/genkit'
import { crmService } from '../../services/crm.service'
import { z } from 'zod'

export const createLeadTool = ai.defineTool(
  {
    name: 'crm_create_lead',
    description: 'Creates a new lead record in the CRM system',
    inputSchema: z.object({
      name: z.string().optional().describe('The name of the lead'),
      phone: z.string().describe('The phone number of the lead'),
      email: z.string().optional().describe('The email address of the lead'),
      interest: z.string().optional().describe('What the lead is interested in (e.g., Jiu-Jitsu, Kids Classes)'),
      source: z.enum(['phone', 'sms', 'whatsapp', 'facebook', 'instagram', 'walkin', 'website']).describe('How the lead contacted us'),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      userId: z.string(),
      message: z.string(),
    }),
  },
  async ({ name, phone, email, interest, source }) => {
    try {
      const userId = await crmService.createLead({
        phone,
        name,
        email,
        source,
        interest,
      })

      return {
        success: true,
        userId,
        message: `Lead created successfully with ID: ${userId}`,
      }
    } catch (error) {
      return {
        success: false,
        userId: '',
        message: `Failed to create lead: ${error}`,
      }
    }
  }
)
