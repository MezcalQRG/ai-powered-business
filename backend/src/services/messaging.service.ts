import { twilioClient } from '../config/integrations'
import { getDb } from '../config/firebase'
import type { MessagePayload, Interaction } from '../types'

export class MessagingService {
  private db = getDb()
  private fromNumber = process.env.TWILIO_PHONE_NUMBER!

  async sendSMS(to: string, body: string): Promise<string> {
    const message = await twilioClient.messages.create({
      from: this.fromNumber,
      to,
      body,
    })

    await this.logInteraction({
      userId: to,
      channel: 'sms',
      direction: 'outbound',
      outcome: 'question_answered',
      summary: body,
      timestamp: new Date().toISOString(),
    })

    return message.sid
  }

  async sendWhatsApp(to: string, body: string): Promise<string> {
    const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`
    const formattedFrom = this.fromNumber.startsWith('whatsapp:')
      ? this.fromNumber
      : `whatsapp:${this.fromNumber}`

    const message = await twilioClient.messages.create({
      from: formattedFrom,
      to: formattedTo,
      body,
    })

    await this.logInteraction({
      userId: to,
      channel: 'whatsapp',
      direction: 'outbound',
      outcome: 'question_answered',
      summary: body,
      timestamp: new Date().toISOString(),
    })

    return message.sid
  }

  async getConversationHistory(phone: string, limit: number = 10): Promise<Interaction[]> {
    const snapshot = await this.db
      .collection('interactions')
      .where('userId', '==', phone)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get()

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Interaction))
  }

  async logInteraction(data: Omit<Interaction, 'id'>): Promise<string> {
    const docRef = await this.db.collection('interactions').add(data)
    return docRef.id
  }

  async makeOutboundCall(to: string, callConfigUrl: string): Promise<string> {
    const call = await twilioClient.calls.create({
      from: this.fromNumber,
      to,
      url: callConfigUrl,
      statusCallback: `${process.env.BASE_URL}/webhooks/twilio/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    })

    await this.logInteraction({
      userId: to,
      channel: 'voice',
      direction: 'outbound',
      outcome: 'question_answered',
      timestamp: new Date().toISOString(),
    })

    return call.sid
  }
}

export const messagingService = new MessagingService()
