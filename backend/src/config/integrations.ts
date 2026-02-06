import twilio from 'twilio'

export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    throw new Error('Twilio credentials not configured')
  }

  return twilio(accountSid, authToken)
}

export function getElevenLabsConfig() {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const agentId = process.env.ELEVENLABS_AGENT_ID

  if (!apiKey || !agentId) {
    throw new Error('ElevenLabs credentials not configured')
  }

  return { apiKey, agentId }
}

export function getGoogleCalendarConfig() {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY

  if (!apiKey) {
    console.warn('Google Calendar API key not configured')
    return null
  }

  return { apiKey }
}

export const twilioClient = getTwilioClient()
export const elevenLabsConfig = getElevenLabsConfig()
export const googleCalendarConfig = getGoogleCalendarConfig()
