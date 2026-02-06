import express, { Request, Response } from 'express'
import { handleIncomingMessageFlow } from '../flows/messaging/handle-incoming-message'

const router = express.Router()

router.post('/sms', async (req: Request, res: Response) => {
  try {
    const { From, To, Body, MessageSid } = req.body

    console.log('Incoming SMS:', { From, To, Body, MessageSid })

    await handleIncomingMessageFlow({
      from: From,
      to: To,
      body: Body,
      channel: 'sms',
    })

    res.type('text/xml')
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
  } catch (error) {
    console.error('Error handling SMS:', error)
    res.status(500).send('Error processing message')
  }
})

router.post('/whatsapp', async (req: Request, res: Response) => {
  try {
    const { From, To, Body, MessageSid } = req.body

    console.log('Incoming WhatsApp:', { From, To, Body, MessageSid })

    const cleanFrom = From.replace('whatsapp:', '')
    const cleanTo = To.replace('whatsapp:', '')

    await handleIncomingMessageFlow({
      from: cleanFrom,
      to: cleanTo,
      body: Body,
      channel: 'whatsapp',
    })

    res.type('text/xml')
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>')
  } catch (error) {
    console.error('Error handling WhatsApp:', error)
    res.status(500).send('Error processing message')
  }
})

router.post('/voice', async (req: Request, res: Response) => {
  try {
    const { From, To, CallSid } = req.body

    console.log('Incoming Voice Call:', { From, To, CallSid })

    const callConfigUrl = `${process.env.BASE_URL}/api/call-config?from=${From}`

    res.type('text/xml')
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling Gracie Barra. Please hold while we connect you.</Say>
  <Redirect>${callConfigUrl}</Redirect>
</Response>`)
  } catch (error) {
    console.error('Error handling voice call:', error)
    res.status(500).send('Error processing call')
  }
})

router.post('/status', async (req: Request, res: Response) => {
  try {
    const { MessageSid, MessageStatus, CallSid, CallStatus } = req.body

    console.log('Status Update:', { MessageSid, MessageStatus, CallSid, CallStatus })

    res.sendStatus(200)
  } catch (error) {
    console.error('Error handling status update:', error)
    res.status(500).send('Error processing status')
  }
})

export default router
