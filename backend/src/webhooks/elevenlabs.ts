import express, { Request, Response } from 'express'
import { generateCallConfigFlow } from '../flows/voice/generate-call-config'
import { identifyUserTool } from '../tools/crm/identify-user'
import { createLeadTool } from '../tools/crm/create-lead'
import { checkAvailabilityTool } from '../tools/scheduling/check-availability'
import { bookAppointmentTool } from '../tools/scheduling/book-appointment'
import { ragQueryTool } from '../tools/knowledge/rag-query'
import { checkStockTool } from '../tools/inventory/check-stock'
import { logInteractionTool } from '../tools/analytics/log-interaction'

const router = express.Router()

router.get('/call-config', async (req: Request, res: Response) => {
  try {
    const { from } = req.query

    if (!from || typeof from !== 'string') {
      return res.status(400).json({ error: 'Missing caller ID' })
    }

    const config = await generateCallConfigFlow({
      callerId: from,
      callType: 'inbound',
    })

    res.json(config)
  } catch (error) {
    console.error('Error generating call config:', error)
    res.status(500).json({ error: 'Failed to generate call config' })
  }
})

router.post('/tools', async (req: Request, res: Response) => {
  try {
    const { tool, parameters } = req.body

    if (!tool) {
      return res.status(400).json({ error: 'Tool name required' })
    }

    let result

    switch (tool) {
      case 'crm_identify_user':
        result = await identifyUserTool(parameters)
        break
      case 'crm_create_lead':
        result = await createLeadTool(parameters)
        break
      case 'calendar_check_availability':
        result = await checkAvailabilityTool(parameters)
        break
      case 'calendar_book_appointment':
        result = await bookAppointmentTool(parameters)
        break
      case 'rag_query_knowledge_base':
        result = await ragQueryTool(parameters)
        break
      case 'inventory_check_stock':
        result = await checkStockTool(parameters)
        break
      case 'analytics_log_interaction':
        result = await logInteractionTool(parameters)
        break
      default:
        return res.status(404).json({ error: `Tool ${tool} not found` })
    }

    res.json(result)
  } catch (error) {
    console.error('Error executing tool:', error)
    res.status(500).json({ error: 'Tool execution failed' })
  }
})

router.get('/tools/list', async (req: Request, res: Response) => {
  const tools = [
    {
      name: 'crm_identify_user',
      description: 'Identifies a user by phone number',
      parameters: ['phone'],
    },
    {
      name: 'crm_create_lead',
      description: 'Creates a new lead in the CRM',
      parameters: ['name', 'phone', 'email', 'interest', 'source'],
    },
    {
      name: 'calendar_check_availability',
      description: 'Checks available appointment slots',
      parameters: ['startDate', 'endDate', 'appointmentType'],
    },
    {
      name: 'calendar_book_appointment',
      description: 'Books an appointment',
      parameters: ['userId', 'dateTime', 'appointmentType', 'duration', 'notes'],
    },
    {
      name: 'rag_query_knowledge_base',
      description: 'Searches the knowledge base',
      parameters: ['question', 'category', 'topK'],
    },
    {
      name: 'inventory_check_stock',
      description: 'Checks Pro Shop inventory',
      parameters: ['itemName', 'size', 'color'],
    },
    {
      name: 'analytics_log_interaction',
      description: 'Logs an interaction for analytics',
      parameters: ['userId', 'channel', 'outcome', 'sentiment', 'summary', 'duration'],
    },
  ]

  res.json({ tools })
})

export default router
