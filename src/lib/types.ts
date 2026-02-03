export interface User {
  id: string
  email: string
  businessName: string
  createdAt: string
}

export interface BusinessConfig {
  businessName: string
  description: string
  products: string
  tone: string
  hours: string
  location: string
  policies: string
  faqs: string
}

export interface APICredentials {
  meta?: {
    accessToken: string
    appId: string
    appSecret: string
  }
  twilio?: {
    accountSid: string
    authToken: string
    phoneNumber: string
  }
  elevenLabs?: {
    apiKey: string
    voiceId: string
  }
  aiProvider?: {
    provider: 'openai' | 'anthropic' | 'google' | 'meta'
    apiKey: string
    model: string
  }
}

export interface Campaign {
  id: string
  name: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  platform: 'facebook' | 'instagram' | 'both'
  budget: number
  createdAt: string
  imageUrl?: string
  adCopy?: string
  impressions?: number
  clicks?: number
  conversions?: number
}

export interface Conversation {
  id: string
  customerName: string
  channel: 'whatsapp' | 'messenger' | 'sms'
  lastMessage: string
  timestamp: string
  status: 'active' | 'resolved'
  unread: boolean
}

export interface Message {
  id: string
  conversationId: string
  content: string
  sender: 'customer' | 'ai' | 'user'
  timestamp: string
}

export interface Call {
  id: string
  phoneNumber: string
  duration: number
  timestamp: string
  status: 'completed' | 'missed' | 'in-progress'
  transcript?: string
  summary?: string
}

export interface LandingPage {
  id: string
  name: string
  template: string
  url: string
  published: boolean
  views: number
  conversions: number
  createdAt: string
}
