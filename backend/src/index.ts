import express from 'express'
import { initializeFirebase } from './config/firebase'
import { ai } from './config/genkit'
import twilioRouter from './webhooks/twilio'
import elevenLabsRouter from './webhooks/elevenlabs'
import { retentionSweepFlow } from './flows/retention/retention-sweep'
import { appointmentReminderFlow } from './flows/reminders/appointment-reminder'
import { indexDocumentsFlow } from './flows/rag/index-documents'

initializeFirebase()

const app = express()
const PORT = process.env.PORT || 3400

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body || req.query)
  next()
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Gracie Barra AI Backend',
  })
})

app.use('/webhooks/twilio', twilioRouter)
app.use('/api', elevenLabsRouter)

app.post('/api/flows/retention-sweep', async (req, res) => {
  try {
    const result = await retentionSweepFlow(req.body || {})
    res.json(result)
  } catch (error) {
    console.error('Error running retention sweep:', error)
    res.status(500).json({ error: 'Retention sweep failed' })
  }
})

app.post('/api/flows/appointment-reminders', async (req, res) => {
  try {
    const result = await appointmentReminderFlow(req.body || {})
    res.json(result)
  } catch (error) {
    console.error('Error sending appointment reminders:', error)
    res.status(500).json({ error: 'Appointment reminders failed' })
  }
})

app.post('/api/rag/index', async (req, res) => {
  try {
    const result = await indexDocumentsFlow(req.body)
    res.json(result)
  } catch (error) {
    console.error('Error indexing documents:', error)
    res.status(500).json({ error: 'Document indexing failed' })
  }
})

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Gracie Barra AI Backend running on port ${PORT}`)
  console.log(`📞 Twilio webhooks: http://localhost:${PORT}/webhooks/twilio/*`)
  console.log(`🤖 ElevenLabs API: http://localhost:${PORT}/api/*`)
  console.log(`💚 Health check: http://localhost:${PORT}/health`)
  console.log('\n✨ Genkit flows registered and ready!')
})

export default app
