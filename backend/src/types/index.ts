export interface User {
  id: string
  phone: string
  email?: string
  name?: string
  type: 'new_prospect' | 'active_student' | 'former_student' | 'lead'
  createdAt: string
  updatedAt: string
}

export interface Student extends User {
  type: 'active_student' | 'former_student'
  rank?: string
  lastAttendanceDate?: string
  paymentStatus: 'current' | 'overdue' | 'suspended'
  enrollmentDate: string
  membershipType?: string
  belt?: string
  stripeCount?: number
  totalClasses?: number
}

export interface Lead extends User {
  type: 'lead' | 'new_prospect'
  source: 'phone' | 'sms' | 'whatsapp' | 'facebook' | 'instagram' | 'walkin' | 'website'
  interest?: string
  qualificationStatus?: 'unqualified' | 'qualified' | 'intro_scheduled' | 'intro_completed' | 'enrolled'
  assignedTo?: string
  lastContactDate?: string
  followUpDate?: string
  notes?: string
}

export interface Appointment {
  id: string
  userId: string
  type: 'intro_class' | 'private_lesson' | 'regular_class' | 'belt_test' | 'event'
  dateTime: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'completed' | 'no_show' | 'cancelled'
  instructorId?: string
  notes?: string
  reminderSent?: boolean
  createdAt: string
}

export interface TimeSlot {
  start: string
  end: string
  available: boolean
  type?: string
}

export interface InventoryItem {
  id: string
  name: string
  category: 'gi' | 'belt' | 'rashguard' | 'shorts' | 'patch' | 'accessory' | 'other'
  sizes: string[]
  colors: string[]
  stock: {
    size: string
    color: string
    quantity: number
  }[]
  price: number
  sku?: string
  lowStockThreshold?: number
}

export interface Interaction {
  id: string
  userId: string
  channel: 'voice' | 'sms' | 'whatsapp' | 'facebook' | 'instagram' | 'email'
  direction: 'inbound' | 'outbound'
  outcome: 'booked' | 'question_answered' | 'escalated' | 'failed' | 'no_answer'
  sentiment?: 'positive' | 'neutral' | 'negative'
  duration?: number
  summary?: string
  transcript?: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface KPI {
  id: string
  metric: 'enrollments' | 'lead_conversion' | 'absentee_rate' | 'delinquency_rate' | 'revenue' | 'response_time'
  value: number
  target: number
  period: string
  timestamp: string
}

export interface CallConfig {
  agentId: string
  systemPrompt: string
  tools: string[]
  context: {
    userId?: string
    userName?: string
    userType?: string
    paymentStatus?: string
    lastAttendance?: string
    metadata?: Record<string, unknown>
  }
  voice: {
    voiceId: string
    stability: number
    similarityBoost: number
  }
}

export interface MessagePayload {
  from: string
  to: string
  body: string
  channel: 'sms' | 'whatsapp'
  messageSid?: string
  timestamp?: string
}

export interface RAGDocument {
  id: string
  title: string
  content: string
  category: 'policy' | 'pricing' | 'schedule' | 'faq' | 'manual' | 'other'
  embedding?: number[]
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface RAGQuery {
  query: string
  topK?: number
  category?: string
}

export interface RAGResult {
  content: string
  relevanceScore: number
  source: string
  metadata?: Record<string, unknown>
}

export interface RetentionTarget {
  userId: string
  userName: string
  phone: string
  reason: 'absentee' | 'delinquent' | 'at_risk'
  daysSinceLastContact: number
  lastAttendanceDate?: string
  outstandingBalance?: number
  priority: 'high' | 'medium' | 'low'
}

export interface CampaignMessage {
  id: string
  userId: string
  channel: 'sms' | 'whatsapp' | 'voice' | 'email'
  messageType: 'retention' | 'reminder' | 'promotion' | 'event' | 'followup'
  scheduledFor: string
  sentAt?: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  response?: string
  responseAt?: string
}

export interface BusinessConfig {
  academyName: string
  phone: string
  email: string
  address?: string
  timezone: string
  businessHours: {
    [key: string]: {
      open: string
      close: string
    }
  }
  defaultClassDuration: number
  maxStudentsPerClass: number
}

export interface APICredentials {
  twilioAccountSid: string
  twilioAuthToken: string
  twilioPhoneNumber: string
  elevenLabsApiKey: string
  elevenLabsAgentId: string
  googleCalendarId?: string
  stripeApiKey?: string
}
