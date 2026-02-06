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
    agentId?: string
  }
  aiProvider?: {
    provider: 'openai' | 'anthropic' | 'google' | 'meta'
    apiKey: string
    model: string
  }
  genkit?: {
    projectId: string
    apiKey: string
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
  channel: 'whatsapp' | 'messenger' | 'sms' | 'email' | 'phone'
  lastMessage: string
  timestamp: string
  status: 'active' | 'resolved'
  unread: boolean
  leadId?: string
  studentId?: string
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
  direction: 'inbound' | 'outbound'
  transcript?: string
  summary?: string
  leadId?: string
  studentId?: string
  callType: 'inquiry' | 'followup' | 'retention' | 'recovery' | 'general'
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

export interface Lead {
  id: string
  name: string
  email?: string
  phone: string
  source: 'phone' | 'web' | 'walkIn' | 'social' | 'referral' | 'campaign'
  status: 'new' | 'contacted' | 'qualified' | 'lessonScheduled' | 'lessonCompleted' | 'enrolled' | 'lost'
  createdAt: string
  lastContactedAt?: string
  notes: string[]
  assignedTo?: string
  interestedPrograms: string[]
  scheduledLesson?: {
    date: string
    time: string
    confirmed: boolean
  }
  conversionStage: number
}

export interface Student {
  id: string
  name: string
  email?: string
  phone: string
  program: string
  belt: string
  enrollmentDate: string
  status: 'active' | 'frozen' | 'cancelled' | 'delinquent'
  lastAttendance?: string
  attendanceCount: number
  absenceCount: number
  billingStatus: 'current' | 'overdue' | 'failed'
  accountBalance: number
  nextBillingDate: string
  notes: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  medicalNotes?: string
}

export interface AttendanceRecord {
  id: string
  studentId: string
  date: string
  classType: string
  instructor: string
  present: boolean
  excused: boolean
  notes?: string
}

export interface InventoryItem {
  id: string
  name: string
  category: 'gi' | 'belt' | 'rashguard' | 'shorts' | 'accessories' | 'other'
  sku: string
  price: number
  cost: number
  quantity: number
  reorderLevel: number
  reorderQuantity: number
  sizes?: string[]
  colors?: string[]
  imageUrl?: string
  salesCount: number
  lastRestocked?: string
}

export interface Sale {
  id: string
  studentId?: string
  items: {
    itemId: string
    quantity: number
    price: number
  }[]
  total: number
  paymentMethod: 'cash' | 'card' | 'online'
  timestamp: string
  soldBy?: string
}

export interface ClassSchedule {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  program: string
  instructor: string
  capacity: number
  currentEnrollment: number
  room?: string
  active: boolean
}

export interface Event {
  id: string
  name: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: 'tournament' | 'seminar' | 'graduation' | 'social' | 'other'
  location?: string
  capacity?: number
  registeredCount: number
  fee?: number
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  notificationsSent: boolean
}

export interface KPIMetrics {
  period: string
  revenue: {
    target: number
    actual: number
    percentageOfTarget: number
  }
  enrollments: {
    target: number
    actual: number
    newThisMonth: number
  }
  leadConversion: {
    totalLeads: number
    qualified: number
    lessonScheduled: number
    lessonCompleted: number
    enrolled: number
    dropRate: number
  }
  attendance: {
    totalActiveStudents: number
    absenteeCount: number
    absenteeRate: number
    thresholdBreached: boolean
  }
  delinquency: {
    totalInvoices: number
    delinquentCount: number
    delinquentRate: number
    totalDelinquentAmount: number
    thresholdBreached: boolean
  }
  retention: {
    freezeRequests: number
    cancellations: number
    retentionWorkflowsExecuted: number
    successfulRetentions: number
  }
  inventory: {
    lowStockItems: number
    stockoutsThisMonth: number
    totalSales: number
    profitMargin: number
  }
}
